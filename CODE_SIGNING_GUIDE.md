# Code Signing Guide for Orbital DB

This guide explains how to set up code signing for macOS and Windows builds of Orbital DB.

## Table of Contents

- [macOS Code Signing](#macos-code-signing)
- [Windows Code Signing](#windows-code-signing)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Testing Signed Builds](#testing-signed-builds)

---

## macOS Code Signing

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com

2. **Developer ID Application Certificate**
   - Required for distributing apps outside the Mac App Store

### Step 1: Create Certificates

1. Go to https://developer.apple.com/account/resources/certificates/list
2. Click the "+" button to create a new certificate
3. Select "Developer ID Application" (for distribution outside Mac App Store)
4. Follow the instructions to create a Certificate Signing Request (CSR):
   ```bash
   # Open Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority
   # Enter your email and name
   # Select "Saved to disk"
   # Save the CSR file
   ```
5. Upload the CSR file
6. Download the certificate and double-click to install in Keychain Access

### Step 2: Export Certificate for CI/CD

```bash
# Export the certificate with private key from Keychain Access
# File > Export Items
# Choose .p12 format
# Set a strong password (you'll need this for CI/CD)

# Convert to base64 for GitHub Secrets
base64 -i Certificates.p12 -o certificate.base64.txt
```

### Step 3: Set Up Notarization

1. Create an App-Specific Password:
   - Go to https://appleid.apple.com/account/manage
   - Sign in with your Apple ID
   - Under "App-Specific Passwords", click "Generate Password"
   - Label it "Orbital DB Notarization"
   - Save the generated password securely

2. Set environment variables for notarization:
   ```bash
   export APPLE_ID="your-apple-id@example.com"
   export APPLE_ID_PASSWORD="your-app-specific-password"
   export APPLE_TEAM_ID="your-team-id"  # Find at developer.apple.com
   ```

### Step 4: Local Signing & Notarization

```bash
# Build with signing enabled
npm run package:mac

# The build process will automatically:
# 1. Sign the app with your Developer ID certificate
# 2. Create a DMG and ZIP
# 3. Submit to Apple for notarization (if credentials are set)
# 4. Staple the notarization ticket to the DMG

# Check notarization status
xcrun notarytool history --apple-id "your-apple-id@example.com" --password "app-specific-password" --team-id "YOUR_TEAM_ID"
```

### Step 5: Verify Signed App

```bash
# Check code signature
codesign -dv --verbose=4 "release/0.2.0/mac-arm64/Orbital DB.app"

# Check notarization
spctl -a -vvv -t install "release/0.2.0/Orbital DB-0.2.0-arm64.dmg"

# Should output: "accepted" and "source=Notarized Developer ID"
```

---

## Windows Code Signing

### Prerequisites

1. **Code Signing Certificate**
   - Purchase from a Certificate Authority (CA):
     - DigiCert (recommended)
     - Sectigo
     - SSL.com
   - Certificate types:
     - Standard Code Signing (~$200-400/year) - requires USB token
     - EV Code Signing (~$300-600/year) - instant SmartScreen reputation, requires hardware token

2. **Windows Machine** (for initial setup)

### Step 1: Obtain Certificate

#### Option A: Standard Code Signing Certificate

1. Purchase from DigiCert, Sectigo, or SSL.com
2. Complete identity verification (requires business documents)
3. Download the certificate (.pfx or .p12 file)
4. Set a strong password for the certificate

#### Option B: EV Code Signing Certificate (Recommended)

1. Purchase EV certificate from DigiCert or similar
2. Complete enhanced identity verification (business registration, personal ID)
3. Receive hardware token (USB device) with certificate
4. For CI/CD: Use cloud-based signing service (e.g., DigiCert ONE, SSL.com eSigner)

### Step 2: Export Certificate for CI/CD

```bash
# Convert PFX to base64 for GitHub Secrets (if using standard cert)
certutil -encode certificate.pfx certificate.base64.txt
# OR on macOS/Linux:
base64 -i certificate.pfx -o certificate.base64.txt
```

### Step 3: Set Up Environment Variables

```bash
# For local signing
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-certificate-password

# For EV certificates with cloud signing (example: SSL.com eSigner)
set SSL_COM_USERNAME=your-username
set SSL_COM_PASSWORD=your-password
set SSL_COM_TOTP_SECRET=your-totp-secret
```

### Step 4: Configure electron-builder for Cloud Signing

For EV certificates with cloud signing services, update `package.json`:

```json
{
  "build": {
    "win": {
      "sign": "./scripts/sign-windows.js",
      "signingHashAlgorithms": ["sha256"]
    }
  }
}
```

Create `scripts/sign-windows.js`:

```javascript
const { execSync } = require('child_process');

exports.default = async function(configuration) {
  // Use SSL.com eSigner, DigiCert ONE, or similar cloud signing service
  const signCmd = `esigner sign -credential_id="${process.env.SSL_COM_CREDENTIAL_ID}" -username="${process.env.SSL_COM_USERNAME}" -password="${process.env.SSL_COM_PASSWORD}" -totp_secret="${process.env.SSL_COM_TOTP_SECRET}" -input="${configuration.path}"`;

  console.log(`Signing ${configuration.path}`);
  execSync(signCmd, { stdio: 'inherit' });
};
```

### Step 5: Local Signing

```bash
# Build with signing enabled
npm run package:win

# Verify signature
signtool verify /pa "release/0.2.0/Orbital DB Setup 0.2.0.exe"
```

### Step 6: Verify Signed Executable

```powershell
# Check signature details
Get-AuthenticodeSignature "release\0.2.0\Orbital DB Setup 0.2.0.exe" | Format-List

# Should show:
# - Status: Valid
# - SignerCertificate: Your certificate details
# - TimeStamperCertificate: Timestamp authority
```

---

## GitHub Actions CI/CD

### Step 1: Add Secrets to GitHub

Go to your repository → Settings → Secrets and variables → Actions

Add the following secrets:

**macOS Signing:**
- `MACOS_CERTIFICATE`: Base64-encoded .p12 certificate
- `MACOS_CERTIFICATE_PASSWORD`: Password for .p12 file
- `APPLE_ID`: Your Apple ID email
- `APPLE_ID_PASSWORD`: App-specific password
- `APPLE_TEAM_ID`: Your Apple Developer Team ID

**Windows Signing:**

For standard certificate:
- `WINDOWS_CERTIFICATE`: Base64-encoded .pfx certificate
- `WINDOWS_CERTIFICATE_PASSWORD`: Certificate password

For EV certificate with cloud signing:
- `SSL_COM_USERNAME`: Cloud signing username
- `SSL_COM_PASSWORD`: Cloud signing password
- `SSL_COM_TOTP_SECRET`: TOTP secret for 2FA
- `SSL_COM_CREDENTIAL_ID`: Credential ID from cloud service

### Step 2: Update GitHub Actions Workflow

Create `.github/workflows/release.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: npm audit --production --audit-level=high

      - name: Type check
        run: npm run typecheck

      # macOS Code Signing Setup
      - name: Import macOS Certificate
        if: matrix.os == 'macos-latest'
        run: |
          # Create temporary keychain
          security create-keychain -p "${{ secrets.MACOS_CERTIFICATE_PASSWORD }}" build.keychain
          security default-keychain -s build.keychain
          security unlock-keychain -p "${{ secrets.MACOS_CERTIFICATE_PASSWORD }}" build.keychain

          # Import certificate
          echo "${{ secrets.MACOS_CERTIFICATE }}" | base64 --decode > certificate.p12
          security import certificate.p12 -k build.keychain -P "${{ secrets.MACOS_CERTIFICATE_PASSWORD }}" -T /usr/bin/codesign
          security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "${{ secrets.MACOS_CERTIFICATE_PASSWORD }}" build.keychain

          # Clean up
          rm certificate.p12

      # Windows Code Signing Setup
      - name: Import Windows Certificate
        if: matrix.os == 'windows-latest'
        run: |
          echo "${{ secrets.WINDOWS_CERTIFICATE }}" > certificate.base64.txt
          certutil -decode certificate.base64.txt certificate.pfx
          del certificate.base64.txt
        shell: cmd

      # Build and Sign
      - name: Build macOS
        if: matrix.os == 'macos-latest'
        run: npm run package:mac
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}

      - name: Build Windows
        if: matrix.os == 'windows-latest'
        run: npm run package:win
        env:
          CSC_LINK: certificate.pfx
          CSC_KEY_PASSWORD: ${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}
          # For EV cloud signing:
          # SSL_COM_USERNAME: ${{ secrets.SSL_COM_USERNAME }}
          # SSL_COM_PASSWORD: ${{ secrets.SSL_COM_PASSWORD }}
          # SSL_COM_TOTP_SECRET: ${{ secrets.SSL_COM_TOTP_SECRET }}

      # Upload Release Assets
      - name: Upload macOS Artifacts
        if: matrix.os == 'macos-latest'
        uses: softprops/action-gh-release@v1
        with:
          files: |
            release/*/*.dmg
            release/*/*.zip

      - name: Upload Windows Artifacts
        if: matrix.os == 'windows-latest'
        uses: softprops/action-gh-release@v1
        with:
          files: |
            release/*/*.exe

      # Cleanup
      - name: Cleanup macOS Keychain
        if: always() && matrix.os == 'macos-latest'
        run: |
          security delete-keychain build.keychain || true

      - name: Cleanup Windows Certificate
        if: always() && matrix.os == 'windows-latest'
        run: |
          del certificate.pfx || true
        shell: cmd
```

---

## Testing Signed Builds

### macOS Testing

1. **Download the signed DMG**
2. **Mount and install the app**
3. **Check Gatekeeper acceptance:**
   ```bash
   spctl -a -vvv -t install "Orbital DB.app"
   # Should show: "accepted" and "source=Notarized Developer ID"
   ```
4. **Try to open the app** - it should open without security warnings

### Windows Testing

1. **Download the signed installer**
2. **Right-click → Properties → Digital Signatures tab**
   - Should show your certificate details
   - Status should be "Valid"
3. **Run the installer** - Windows SmartScreen should:
   - For EV certs: No warnings (instant reputation)
   - For standard certs: May show warning initially, but builds reputation over time
4. **Check installed app:**
   ```powershell
   Get-AuthenticodeSignature "C:\Program Files\Orbital DB\Orbital DB.exe"
   ```

---

## Cost Summary

### macOS
- **Apple Developer Program**: $99/year
- **One-time setup**: ~2-3 hours
- **Renewal**: Annual (certificate auto-renews with membership)

### Windows
- **Standard Code Signing**: $200-400/year
  - Takes time to build SmartScreen reputation
  - May show warnings to users initially

- **EV Code Signing**: $300-600/year (Recommended)
  - Instant SmartScreen reputation
  - No warnings to users
  - Requires hardware token or cloud signing service
  - Cloud signing adds ~$50-100/year

### Total Annual Cost
- **Minimum**: $299/year (Apple + Standard Windows cert)
- **Recommended**: $399-699/year (Apple + EV Windows cert)

---

## Recommendations

1. **Start with EV Code Signing for Windows**
   - Instant trust, no SmartScreen warnings
   - Better user experience
   - Worth the extra cost

2. **Use Cloud Signing Services**
   - Easier CI/CD integration
   - No hardware tokens to manage
   - DigiCert ONE or SSL.com eSigner

3. **Automate Everything**
   - Use GitHub Actions for all builds
   - Never manually sign locally
   - Consistent, reproducible builds

4. **Test Thoroughly**
   - Always test signed builds before release
   - Check on fresh machines without dev tools
   - Verify signatures with system tools

---

## Troubleshooting

### macOS: "Developer cannot be verified"
- Certificate not properly installed in keychain
- App not notarized
- Notarization ticket not stapled
- Solution: Re-sign and re-notarize

### Windows: SmartScreen Warning
- Standard certificate (not EV)
- New certificate without reputation
- Solution: Get EV certificate or build reputation over time

### CI/CD Build Fails
- Check secret values are correct
- Verify certificate passwords
- Check certificate expiration
- Review GitHub Actions logs for details

---

## Additional Resources

- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [electron-builder Code Signing Docs](https://www.electron.build/code-signing)
- [DigiCert Code Signing](https://www.digicert.com/signing/code-signing-certificates)
- [Windows Code Signing Best Practices](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)

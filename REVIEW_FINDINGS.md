# Orbital DB – Security & Architecture Review

## Executive Summary
- The Electron surface follows core hardening guidance (sandboxed window, `contextIsolation`, preload bridge) but several privileged IPC handlers still trust renderer inputs, leaving room for SQL injection or arbitrary file writes.
- DuckDB integration is feature-complete yet every query is executed synchronously on the main thread, materializing full result sets and keeping connections open indefinitely, which threatens responsiveness and memory usage.
- A few UX assurances (e.g., read-only profiles) are not enforced in the backend, so destructive SQL can still run despite the UI badge.
- Build and CI pipelines are healthy (type check, lint, multi-platform packaging), but there is no automated testing or CSP for the renderer, so regressions/XSS rely on manual detection.

## Detailed Findings

### Medium Severity
1. **Metadata IPC SQL injection** – `listTables`, `getColumns`, and `listConstraints` concatenate schema/table names directly into SQL (`src/main/DuckDBService.ts:132-205`). A crafted schema identifier (or tampered renderer IPC) can run arbitrary SQL inside the trusted process. Use prepared statements or bind parameters via DuckDB’s API instead of string interpolation.
2. **Arbitrary file write primitive** – The preload API exposes `window.orbitalDb.files.writeFile` with any path (`src/preload/preload.ts:62-75`). The IPC handler simply invokes `fs.writeFile` (`src/main/ipcHandlers.ts:246-253`), so any renderer compromise can overwrite user files or drop executables. Restrict writes to controlled directories, require dialogs, or remove the helper.
3. **Read-only profiles not enforced** – The UI displays a read-only badge (`src/renderer/components/ProfileList.tsx:34-47`), but `DuckDBService.openConnection` never toggles DuckDB’s read-only mode and all queries are accepted (`src/main/DuckDBService.ts:15-120`). Users could rely on the flag and still execute destructive SQL. Honor the flag via `DuckDBInstance.create(path, { access_mode: 'read_only' })` or reject mutating statements.

### Low Severity
1. **Table viewer builds SQL from route params** – `TablePage` interpolates `schemaName`/`tableName` from the URL directly into a quoted identifier (`src/renderer/routes/TablePage.tsx:21-41`). Malformed names (containing `"`) can break the query or inject SQL. Escape identifiers or route parameters before use.
2. **Renderer lacks CSP** – `src/renderer/index.html` contains no Content Security Policy. Any renderer XSS could freely load remote scripts. Add a restrictive CSP (`default-src 'self'`) and tighten `webPreferences` further (e.g., `enableRemoteModule: false`).
3. **Query export doubles workload** – `exportToCsv` re-runs the full query to count rows after exporting (`src/main/DuckDBService.ts:202-225`). For large datasets this doubles I/O time and risks inconsistent counts. Track row counts during export or stream metadata back from DuckDB if available.

### Architectural / Maintainability Issues
- **Main-thread workload** – All `runQuery` calls use `runAndReadAll` and materialize complete result sets (`src/main/DuckDBService.ts:92-116`). Large queries will block the main process and the renderer data grid (`src/renderer/components/DataGrid.tsx:13-49`) is non-virtualized, so UI freezes and memory blow-ups are likely.
- **Connection lifecycle is unmanaged** – The dashboard opens every profile connection on mount (`src/renderer/components/DatabaseOverview.tsx:23-78`), but `closeConnection` is never dispatched anywhere (`src/renderer/state/slices/profilesSlice.ts:52-106`). Connections remain open until app quit, increasing resource use and file-lock conflicts on Windows.
- **Path handling is POSIX-only** – Multiple components split paths on `'/'` (`src/renderer/routes/ImportDataPage.tsx:45-54`, `CreateDatabasePage.tsx:40-60`, `QueryEditor.tsx:69-78`), so Windows users see mangled file names and table suggestions.
- **IPC file dialogs ignore multi-select** – `dialog.showOpenDialog` allows multi-selection (`src/main/ipcHandlers.ts:198-217`), but the preload helper returns only the first entry (`src/preload/preload.ts:62-67`), preventing expected bulk imports.
- **No automated tests** – There are no unit/e2e tests covering IPC handlers, DuckDB service, or React state slices, so regressions rely entirely on manual verification.

## Phased Remediation Plan

### Phase 1 – Security Hardening
1. Parameterize all metadata SQL queries and properly escape renderer-supplied identifiers (`listTables`, `getColumns`, `listConstraints`, `TablePage`).
2. Remove or strictly gate `window.orbitalDb.files.writeFile`; constrain saved files to prompts with user-selected paths.
3. Enforce read-only profiles at the DuckDB level (read-only connections or mutation filtering) and block exports/imports for those profiles.
4. Add a CSP to `src/renderer/index.html` and disable any unused Electron features (e.g., `enableRemoteModule: false` if not already).

### Phase 2 – Resource & Lifecycle Management
1. Introduce configurable row limits and streaming/pagination for `runQuery`; render results with virtualization (`@tanstack/react-virtual`) to keep the UI responsive.
2. Track active view usage and close idle DuckDB connections when routes unmount; wire the existing `closeConnection` thunk into React effects.
3. Move heavy DuckDB work off the main thread (worker thread or background process) to maintain UI responsiveness.
4. Normalize path handling via Node’s `path` utilities (e.g., `path.basename`, `path.parse`) exposed through IPC to keep Windows/Linux parity.

### Phase 3 – Reliability & UX Improvements
1. Cover IPC handlers and Redux slices with unit tests (e.g., using `jest` or `vitest`) and consider end-to-end smoke tests via Playwright or Spectron.
2. Honor multi-file imports by returning the full selection array through the preload bridge and updating callers accordingly.
3. Optimize CSV export to avoid duplicate query execution (capture row counts during export or use DuckDB’s `COPY` diagnostics).
4. Document the security posture (read-only enforcement rules, file write limitations, CSP) in `README.md` and release notes to set user expectations.

---

Prepared by Codex (GPT-5). Let me know which phase you’d like to tackle first.

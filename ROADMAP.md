# Orbital DB - Product Roadmap

## Current Status: v0.1.0 - Core Features Complete ✅

All core functionality is implemented and tested:
- DuckDB integration with connection management
- Profile management with JSON persistence
- Schema browsing and table viewing
- Query execution with result display
- Concurrent connection safety (serialized access)
- Dark mode support
- CI/CD pipeline with automated builds

## Next Up: Phase 1 - File Picker & Enhanced SQL Support

### File Picker Integration

**Goal**: Make it easy for users to select database files and attach data files for querying.

**Features**:
- Electron dialog integration for browsing to `.duckdb` files
- "Browse" button in profile creation/editing forms
- File path validation and user-friendly error messages
- Support for both absolute and relative paths

**Tasks**:
- [ ] Add Electron dialog integration (IPC handler for `dialog.showOpenDialog`)
- [ ] Create `selectDatabaseFile` IPC handler in main process
- [ ] Update ProfileForm with file picker button for dbPath field
- [ ] Add file validation (check if file exists, readable permissions)
- [ ] Update preload API to expose file picker functions

### Attached Files Support

**Goal**: Enable users to attach CSV, Parquet, and JSON files that appear as queryable tables.

**Schema Enhancement**:
```typescript
interface AttachedFile {
  id: string;
  alias: string;      // e.g., "sales_data" - used as table name in SQL
  path: string;       // Local file path or URL
  type: 'parquet' | 'csv' | 'json';
}

interface DuckDBProfile {
  // ... existing fields ...
  attachedFiles?: AttachedFile[];
}
```

**User Experience**:
1. In profile view, user sees "Attached Files" section
2. Click "Attach File" → file picker dialog
3. User provides alias (e.g., "sales_data")
4. File appears in schema browser as a queryable table
5. Can query directly: `SELECT * FROM sales_data`

**Tasks**:
- [ ] Update DuckDBProfile type with attachedFiles field
- [ ] Add "Attached Files" section to ProfileForm component
- [ ] Create AttachedFileList component for viewing/managing files
- [ ] Implement add/remove file functionality in UI
- [ ] Update DuckDBService.openConnection to create views for attached files
  ```sql
  CREATE VIEW {alias} AS SELECT * FROM read_parquet('{path}');
  CREATE VIEW {alias} AS SELECT * FROM read_csv('{path}');
  CREATE VIEW {alias} AS SELECT * FROM read_json('{path}');
  ```
- [ ] Update schema introspection to include attached file views
- [ ] Add visual indicators in schema tree (📎 icon for attached files)
- [ ] Persist attachedFiles array in profiles.json

### Full SQL Support Verification

**Goal**: Ensure all SQL statement types work correctly and provide appropriate feedback.

**SQL Statement Support Matrix**:

| Category | Statements | Status | Needs |
|----------|-----------|--------|-------|
| **DQL** | SELECT | ✅ Working | Nothing - fully functional |
| **DDL** | CREATE, ALTER, DROP, TRUNCATE | ⚠️ Untested | Verification & examples |
| **DML** | INSERT, UPDATE, DELETE | ⚠️ Untested | Affected row count display |
| **TCL** | BEGIN, COMMIT, ROLLBACK, SAVEPOINT | ⚠️ Untested | Transaction indicator in UI |

**Persistence Behavior**:
- **File-based databases** (`.duckdb`): All changes persist to disk automatically
- **In-memory databases** (`:memory:`): All changes lost when connection closes
- **Read-only mode**: Prevents DDL/DML operations

**Tasks**:
- [ ] Test DDL statements (CREATE TABLE, CREATE VIEW, DROP, ALTER)
- [ ] Test DML statements (INSERT, UPDATE, DELETE)
- [ ] Test TCL statements (BEGIN TRANSACTION, COMMIT, ROLLBACK)
- [ ] Add affected row count display for non-SELECT queries
- [ ] Improve query result handling for statements that don't return rows
- [ ] Add persistence indicator in TopBar (💾 for file, 🧠 for memory)
- [ ] Add transaction mode indicator (show when in active transaction)
- [ ] Create SQL examples documentation for common operations
- [ ] Add statement type detection for better result formatting

**Example SQL Workflows**:
```sql
-- DDL: Create persistent table
CREATE TABLE customers (id INTEGER, name VARCHAR, email VARCHAR);

-- DML: Insert data
INSERT INTO customers VALUES (1, 'Alice', 'alice@example.com');

-- DQL: Query data
SELECT * FROM customers;

-- Query attached Parquet file
SELECT * FROM sales_data;  -- where sales_data is attached file

-- TCL: Use transactions
BEGIN TRANSACTION;
UPDATE customers SET email = 'new@example.com' WHERE id = 1;
COMMIT;
```

---

## Phase 2: Query Experience Improvements

### Query History & Snippets

**Goal**: Help users reuse and organize their SQL queries.

**Features**:
- Persist last N queries per profile (stored in profiles.json or separate history file)
- Query history panel in Query page
- Quick re-run and edit buttons for historical queries
- Saved snippets with friendly names and descriptions
- Search/filter through query history

**Tasks**:
- [ ] Add query history storage (limit to last 50 queries per profile)
- [ ] Create QueryHistory component with list view
- [ ] Add timestamp and execution time to history entries
- [ ] Implement "Run Again" and "Edit" actions
- [ ] Create SavedSnippets feature for frequently used queries
- [ ] Add snippet management UI (save, rename, delete, organize)

### Monaco Editor Integration

**Goal**: Replace textarea with professional SQL editor.

**Features**:
- Syntax highlighting for SQL
- Autocomplete for table/column names
- Multi-cursor editing
- Find/replace functionality
- Bracket matching and code folding

**Tasks**:
- [ ] Install `@monaco-editor/react` package
- [ ] Replace textarea in QueryEditor with Monaco
- [ ] Configure SQL language support
- [ ] Implement autocomplete provider using schema metadata
- [ ] Add DuckDB-specific SQL functions to autocomplete
- [ ] Configure keybindings (keep Cmd/Ctrl+Enter for execution)

### Streaming & Virtualized Results

**Goal**: Handle large result sets efficiently without freezing the UI.

**Features**:
- Virtualized scrolling for DataGrid (only render visible rows)
- Progressive loading indicator for large queries
- Chunked result streaming from worker thread
- Configurable page size for result batching

**Tasks**:
- [ ] Install `@tanstack/react-virtual` or similar virtualization library
- [ ] Replace current DataGrid with virtualized version
- [ ] Implement chunked query execution in DuckDBService
- [ ] Add streaming protocol to worker RPC interface
- [ ] Show loading states with progress indicators
- [ ] Add "Load More" button for incremental fetching

---

## Phase 3: Performance Monitoring & Insights

### Slow Query Insights

**Goal**: Help users understand query performance and optimize their SQL.

**Features**:
- Record execution time and row count for all queries
- Visual indicators for slow queries (> 5s)
- Toast notifications for long-running queries
- Query execution statistics dashboard
- Performance history chart

**Tasks**:
- [ ] Add query execution metrics to result metadata
- [ ] Create performance tracking service
- [ ] Implement toast notification system
- [ ] Add slow query warning threshold in Settings
- [ ] Create performance insights page with charts
- [ ] Show query plan (EXPLAIN) option in QueryEditor

### Enhanced Cancellation UX

**Goal**: Make query cancellation more visible and reliable.

**Features**:
- Progress indicator during query execution
- Prominent Cancel button (already implemented)
- Timeout override UI for specific queries
- Notification when query is cancelled or times out
- Support for cancelling multiple concurrent queries

**Tasks**:
- [ ] Add progress bar during query execution
- [ ] Improve cancel button visibility and feedback
- [ ] Add per-query timeout override field
- [ ] Create unified notification/toast system
- [ ] Surface timeout events from worker thread
- [ ] Add query queue visualization for concurrent queries

---

## Phase 4: Data Import/Export Enhancements

### Export Functionality

**Goal**: Enable users to export query results in multiple formats.

**Features**:
- Export to CSV (already implemented in DuckDBService)
- Export to JSON
- Export to Parquet
- Copy to clipboard (formatted for Excel, Markdown, etc.)
- Export with optional row limit

**Tasks**:
- [ ] Add "Export" button to query results
- [ ] Create ExportDialog component with format selection
- [ ] Implement JSON export in DuckDBService
- [ ] Implement Parquet export in DuckDBService
- [ ] Add clipboard copy functionality
- [ ] Show export progress for large datasets
- [ ] Add export format preference in Settings

### Import Wizard Improvements

**Goal**: Make data import more flexible and user-friendly.

**Features**:
- Batch import multiple files at once
- File format auto-detection
- Schema inference and preview
- Custom delimiter/encoding options for CSV
- Import validation and error reporting

**Tasks**:
- [ ] Support multiple file selection in import dialog
- [ ] Add file format detection based on content
- [ ] Implement schema preview before import
- [ ] Add CSV options (delimiter, header, encoding)
- [ ] Create validation step with error highlighting
- [ ] Show import progress with row count updates

---

## Phase 5: Advanced Features

### MotherDuck Cloud Integration

**Goal**: Connect to MotherDuck cloud databases for collaborative analytics.

**Schema Enhancement**:
```typescript
interface DuckDBProfile {
  connectionType: 'file' | 'memory' | 'motherduck';

  // For MotherDuck
  motherDuckToken?: string;
  motherDuckDatabase?: string;
}
```

**Features**:
- Connect to MotherDuck cloud databases
- Secure token storage using Electron safeStorage
- Cloud status indicator in TopBar
- Share databases across team members
- Mix local and cloud data sources

**Tasks**:
- [ ] Add MotherDuck connection type to ProfileForm
- [ ] Implement secure token storage (not in plain JSON)
- [ ] Update DuckDBService to handle `md:` connection strings
- [ ] Add connection validation for MotherDuck
- [ ] Create cloud status indicator in UI
- [ ] Handle authentication errors gracefully
- [ ] Add MotherDuck documentation and examples

### Remote File Support

**Goal**: Query data from HTTP and S3 URLs without downloading.

**Features**:
- Attach remote CSV/Parquet files via HTTP URLs
- S3 integration with credentials
- URL validation and connectivity checks
- Caching strategy for frequently accessed remote files
- Progress indicators for remote data access

**Tasks**:
- [ ] Add URL support to AttachedFile type
- [ ] Implement HTTP URL validation
- [ ] Add S3 credentials to profile settings
- [ ] Test DuckDB's native HTTP/S3 support
- [ ] Add connection status for remote files
- [ ] Implement file metadata caching
- [ ] Handle network errors gracefully

### Extension Management

**Goal**: Make it easy to install and use DuckDB extensions.

**Features**:
- UI for browsing available extensions
- One-click extension installation
- Extension status indicators (installed/loaded)
- Auto-load extensions on connection
- Extension documentation links

**Tasks**:
- [ ] Create Extensions page in UI
- [ ] List available DuckDB extensions with descriptions
- [ ] Add "Install" button for each extension
- [ ] Implement `INSTALL` and `LOAD` SQL execution
- [ ] Store loaded extensions in profile settings
- [ ] Show extension status in Settings page
- [ ] Add extension usage examples

---

## Phase 6: User Experience Polish

### Settings Page Enhancement

**Goal**: Give users control over application behavior.

**Features**:
- Theme selection (light/dark/auto)
- Default row limit configuration
- Auto-open last used profile on startup
- Default query timeout settings
- Editor preferences (font size, theme, key bindings)
- Performance tuning (memory limit, thread count)

**Tasks**:
- [ ] Create Settings store in Redux
- [ ] Implement theme auto-detection based on system
- [ ] Add settings persistence to app config file
- [ ] Create SettingsPage with organized sections
- [ ] Add default values for all configurable options
- [ ] Apply settings to DuckDBService on connection
- [ ] Add settings import/export for backup

### Keyboard Shortcuts

**Goal**: Enable power users to work efficiently.

**Shortcuts to Implement**:
- `Cmd/Ctrl+K` - Quick command palette
- `Cmd/Ctrl+N` - New profile
- `Cmd/Ctrl+T` - New query tab
- `Cmd/Ctrl+W` - Close current tab
- `Cmd/Ctrl+1-9` - Switch between profiles
- `Cmd/Ctrl+B` - Toggle schema browser
- `Cmd/Ctrl+/` - Toggle comment in SQL editor
- `F5` - Refresh schema tree

**Tasks**:
- [ ] Create keyboard shortcut service
- [ ] Implement command palette component
- [ ] Add shortcut hints to UI (tooltips, help page)
- [ ] Make shortcuts configurable in Settings
- [ ] Add keyboard shortcut documentation

### Notifications & Feedback

**Goal**: Provide clear, non-intrusive feedback for all operations.

**Features**:
- Toast notification system for success/error messages
- Progress indicators for long-running operations
- Confirmation dialogs for destructive actions
- Undo/redo support for profile changes
- Status bar with connection and operation info

**Tasks**:
- [ ] Implement toast notification system
- [ ] Create NotificationService in Redux
- [ ] Add progress indicators to async operations
- [ ] Implement confirmation dialogs for delete operations
- [ ] Add undo stack for profile CRUD
- [ ] Create status bar component

---

## Phase 7: Testing & Quality

### Automated Testing Suite

**Goal**: Ensure reliability and prevent regressions.

**Test Coverage**:
- Unit tests for DuckDBService
- Unit tests for Redux slices
- Integration tests for IPC handlers
- E2E tests for critical user flows
- Performance benchmarks

**Tasks**:
- [ ] Set up Jest for unit testing
- [ ] Write tests for DuckDBService methods
- [ ] Write tests for Redux slice reducers
- [ ] Set up Playwright for E2E testing
- [ ] Create E2E test scenarios (create profile, run query, etc.)
- [ ] Add CI job for running tests
- [ ] Set up code coverage reporting
- [ ] Create performance regression tests

### Documentation & Onboarding

**Goal**: Help new users get started quickly.

**Documentation Needs**:
- Getting started guide with screenshots
- Video tutorials for common workflows
- SQL examples and best practices
- DuckDB-specific features guide
- Troubleshooting FAQ
- API documentation for developers

**Tasks**:
- [ ] Update README with screenshots and GIFs
- [ ] Create user guide with step-by-step tutorials
- [ ] Record demo videos for key features
- [ ] Write DuckDB tips and tricks guide
- [ ] Create troubleshooting FAQ page
- [ ] Add in-app help and tooltips
- [ ] Create developer documentation for contributors

---

## Release Planning

### v0.2.0 - File Management & SQL Completeness
**Target**: Q1 2025
- File picker integration
- Attached files support
- Full SQL verification (DDL/DML/TCL)
- Query history
- Monaco editor integration

### v0.3.0 - Performance & UX
**Target**: Q2 2025
- Virtualized result grids
- Streaming query execution
- Export enhancements (JSON, Parquet)
- Settings page
- Keyboard shortcuts

### v0.4.0 - Advanced Features
**Target**: Q3 2025
- MotherDuck integration
- Remote file support
- Extension management
- Automated testing suite

### v1.0.0 - Production Ready
**Target**: Q4 2025
- Complete test coverage
- Full documentation
- Performance optimizations
- Security audit
- Accessibility compliance

---

## Technical Debt & Maintenance

### Current Technical Debt
- None identified (codebase is clean as of v0.1.0)

### Ongoing Maintenance Tasks
- [ ] Keep @duckdb/node-api updated with latest releases
- [ ] Monitor Electron security advisories
- [ ] Update dependencies regularly (npm audit)
- [ ] Review and improve error messages based on user feedback
- [ ] Performance monitoring and optimization
- [ ] Code cleanup and refactoring as needed

---

## Community & Contribution

### Open Source Readiness
- [ ] Add CONTRIBUTING.md guidelines
- [ ] Create issue templates for bugs and features
- [ ] Set up PR template with checklist
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Create developer setup guide
- [ ] Add architecture decision records (ADR)

### Community Features
- [ ] User feedback mechanism
- [ ] Feature request voting system
- [ ] Community SQL snippet sharing
- [ ] Plugin/extension system for community add-ons

---

**Last Updated**: 2025-11-26
**Current Version**: v0.1.0
**Next Milestone**: v0.2.0 - File Management & SQL Completeness

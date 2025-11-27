// Component for managing attached files in a profile

import { useState } from 'react';
import type { AttachedFile } from '@shared/types';

interface AttachedFileListProps {
  files: AttachedFile[];
  onChange: (files: AttachedFile[]) => void;
  disabled?: boolean;
}

export default function AttachedFileList({ files, onChange, disabled }: AttachedFileListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newType, setNewType] = useState<AttachedFile['type']>('auto');
  const [error, setError] = useState<string | null>(null);

  const handleSelectFile = async () => {
    if (!window.orbitalDb) {
      setError('Electron APIs are unavailable. This feature requires the Electron runtime.');
      return;
    }

    try {
      const result = await window.orbitalDb.files.selectDataFiles();
      if (result && result.length > 0) {
        setNewPath(result[0]);

        // Auto-suggest alias from filename (cross-platform path handling)
        const fileName = result[0].split(/[/\\]/).pop() || '';
        const baseName = fileName.replace(/\.(csv|parquet|json|jsonl)$/i, '');
        const suggestedAlias = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        setNewAlias(suggestedAlias);

        // Auto-detect file type
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'csv') setNewType('csv');
        else if (ext === 'parquet') setNewType('parquet');
        else if (ext === 'json' || ext === 'jsonl') setNewType('json');
        else setNewType('auto');

        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddFile = () => {
    setError(null);

    // Validate alias
    if (!newAlias.trim()) {
      setError('Alias is required');
      return;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newAlias)) {
      setError('Alias must start with a letter or underscore and contain only letters, numbers, and underscores');
      return;
    }

    // Check for duplicate alias
    if (files.some(f => f.alias.toLowerCase() === newAlias.toLowerCase())) {
      setError('An attached file with this alias already exists');
      return;
    }

    if (!newPath.trim()) {
      setError('File path is required');
      return;
    }

    const newFile: AttachedFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      alias: newAlias.trim(),
      path: newPath.trim(),
      type: newType,
    };

    onChange([...files, newFile]);

    // Reset form
    setNewAlias('');
    setNewPath('');
    setNewType('auto');
    setIsAdding(false);
  };

  const handleRemoveFile = (id: string) => {
    onChange(files.filter(f => f.id !== id));
  };

  const getFileTypeIcon = (type: AttachedFile['type']) => {
    switch (type) {
      case 'csv': return '📊';
      case 'parquet': return '📦';
      case 'json': return '📋';
      case 'auto': return '📄';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Attached Files</label>
        {!disabled && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-sm btn-secondary px-2 py-1"
          >
            + Attach File
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 -mt-2">
        Attach CSV, Parquet, or JSON files that will be queryable as tables
      </p>

      {files.length === 0 && !isAdding && (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 border-dashed">
          <p className="text-sm text-gray-500">No files attached</p>
          <p className="text-xs text-gray-400 mt-1">
            Attached files appear as queryable tables in the schema browser
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-2xl">{getFileTypeIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {file.alias}
                    </code>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {file.type === 'auto' ? 'auto-detect' : file.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1" title={file.path}>
                    {file.path}
                  </p>
                </div>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.id)}
                  className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  title="Remove attached file"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded space-y-3">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Attach New File
          </h4>

          <div>
            <label className="block text-xs font-medium mb-1">File Path</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="input-field flex-1 text-sm"
                placeholder="/path/to/data.csv"
              />
              <button
                type="button"
                onClick={handleSelectFile}
                className="btn-secondary text-sm whitespace-nowrap"
              >
                Browse...
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Table Alias (used in SQL queries)
            </label>
            <input
              type="text"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              className="input-field w-full text-sm"
              placeholder="sales_data"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use lowercase letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">File Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as AttachedFile['type'])}
              className="input-field w-full text-sm"
            >
              <option value="auto">Auto-detect</option>
              <option value="csv">CSV</option>
              <option value="parquet">Parquet</option>
              <option value="json">JSON/JSONL</option>
            </select>
          </div>

          {error && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleAddFile}
              className="btn-primary text-sm px-3 py-1"
            >
              Add File
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewAlias('');
                setNewPath('');
                setNewType('auto');
                setError(null);
              }}
              className="btn-secondary text-sm px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

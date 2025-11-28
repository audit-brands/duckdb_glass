import { useState } from 'react';

export interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat, options: ExportOptions) => void;
  rowCount: number;
}

export type ExportFormat = 'csv' | 'json' | 'parquet';

export interface ExportOptions {
  // CSV options
  delimiter?: string;
  header?: boolean;

  // JSON options
  jsonFormat?: 'array' | 'newline';
}

export function ExportDialog({ isOpen, onClose, onExport, rowCount }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [delimiter, setDelimiter] = useState<string>(',');
  const [header, setHeader] = useState<boolean>(true);
  const [jsonFormat, setJsonFormat] = useState<'array' | 'newline'>('array');

  if (!isOpen) return null;

  const handleExport = () => {
    const options: ExportOptions = {};

    if (format === 'csv') {
      options.delimiter = delimiter;
      options.header = header;
    } else if (format === 'json') {
      options.jsonFormat = jsonFormat;
    }

    onExport(format, options);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Export Query Results</h2>

        <div className="space-y-4">
          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="form-radio"
                />
                <span>CSV (Comma-Separated Values)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="form-radio"
                />
                <span>JSON</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="parquet"
                  checked={format === 'parquet'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="form-radio"
                />
                <span>Parquet (Columnar format)</span>
              </label>
            </div>
          </div>

          {/* CSV-specific options */}
          {format === 'csv' && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Delimiter</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab (\t)</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={header}
                  onChange={(e) => setHeader(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-sm">Include header row</span>
              </label>
            </div>
          )}

          {/* JSON-specific options */}
          {format === 'json' && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">JSON Format</label>
                <select
                  value={jsonFormat}
                  onChange={(e) => setJsonFormat(e.target.value as 'array' | 'newline')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                >
                  <option value="array">Array (single JSON array)</option>
                  <option value="newline">Newline-delimited (NDJSON)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {jsonFormat === 'array'
                    ? 'Outputs a single JSON array containing all rows'
                    : 'Outputs one JSON object per line (NDJSON/JSONL format)'}
                </p>
              </div>
            </div>
          )}

          {/* Row count info */}
          <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            Will export {rowCount.toLocaleString()} row{rowCount !== 1 ? 's' : ''}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="btn-primary"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

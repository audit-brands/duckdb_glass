// Virtualized data grid component for displaying large query results efficiently

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { QueryResult } from '@shared/types';

interface VirtualizedDataGridProps {
  result: QueryResult;
}

export default function VirtualizedDataGrid({ result }: VirtualizedDataGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer for rows
  const rowVirtualizer = useVirtualizer({
    count: result.rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimated row height in pixels
    overscan: 10, // Number of rows to render outside visible area
  });

  if (result.rowCount === 0) {
    return <div className="text-gray-500 text-center py-8">No data</div>;
  }

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-700 rounded"
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">
              #
            </th>
            {result.columns.map((col, idx) => (
              <th
                key={idx}
                className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 whitespace-nowrap"
              >
                <div>{col.name}</div>
                <div className="text-gray-400 font-normal">{col.dataType}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Virtual spacer for rows before visible area */}
          {virtualRows.length > 0 && virtualRows[0].index > 0 && (
            <tr>
              <td
                colSpan={result.columns.length + 1}
                style={{ height: `${virtualRows[0].start}px`, padding: 0 }}
              />
            </tr>
          )}

          {/* Virtualized rows */}
          {virtualRows.map((virtualRow) => {
            const row = result.rows[virtualRow.index];
            return (
              <tr
                key={virtualRow.index}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ height: `${virtualRow.size}px` }}
              >
                <td className="px-3 py-2 text-xs text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  {virtualRow.index + 1}
                </td>
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 min-w-[100px] max-w-md break-words"
                    title={String(cell)}
                  >
                    {cell === null ? (
                      <span className="text-gray-400 italic">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Virtual spacer for rows after visible area */}
          {virtualRows.length > 0 && (
            <tr>
              <td
                colSpan={result.columns.length + 1}
                style={{ height: `${totalHeight - (virtualRows[virtualRows.length - 1].end)}px`, padding: 0 }}
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

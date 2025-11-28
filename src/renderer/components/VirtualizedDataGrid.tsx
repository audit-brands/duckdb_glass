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
      style={{ contain: 'strict' }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {/* Sticky header */}
        <div
          className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
          style={{ height: '40px' }}
        >
          <div className="flex">
            <div className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600 w-16 flex-shrink-0">
              #
            </div>
            {result.columns.map((col, idx) => (
              <div
                key={idx}
                className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 min-w-[150px] flex-shrink-0"
              >
                <div className="whitespace-nowrap">{col.name}</div>
                <div className="text-gray-400 font-normal whitespace-nowrap">{col.dataType}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtualized rows */}
        {virtualRows.map((virtualRow) => {
          const row = result.rows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex"
            >
              <div className="px-3 py-2 text-xs text-gray-400 border-r border-gray-200 dark:border-gray-700 w-16 flex-shrink-0">
                {virtualRow.index + 1}
              </div>
              {row.map((cell, cellIdx) => (
                <div
                  key={cellIdx}
                  className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 min-w-[150px] max-w-md break-words flex-shrink-0"
                  title={String(cell)}
                >
                  {cell === null ? (
                    <span className="text-gray-400 italic">NULL</span>
                  ) : (
                    String(cell)
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

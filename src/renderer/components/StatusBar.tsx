// StatusBar component - displays connection and operation status at bottom of screen

import { useAppSelector } from '../state/hooks';

export default function StatusBar() {
  const { list: profiles, activeProfileId, loading } = useAppSelector((state) => state.profiles);
  const activeProfile = profiles.find((p: { id: string }) => p.id === activeProfileId);

  // Don't show status bar if no active profile
  if (!activeProfile) {
    return null;
  }

  const isMemory = activeProfile.dbPath === ':memory:';
  const isReadOnly = activeProfile.readOnly;

  return (
    <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400">
      {/* Left side - Connection info */}
      <div className="flex items-center space-x-4">
        {/* Connection status */}
        <div className="flex items-center space-x-1.5">
          {loading ? (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Connected</span>
            </>
          )}
        </div>

        {/* Database name */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {activeProfile.name}
          </span>
        </div>

        {/* Database type */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span title={isMemory ? 'In-Memory Database' : 'Persistent File Database'}>
            {isMemory ? '🧠 In-Memory' : '💾 Persistent'}
          </span>
        </div>

        {/* Read-only indicator */}
        {isReadOnly && (
          <div className="flex items-center space-x-1.5">
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              Read-Only
            </span>
          </div>
        )}
      </div>

      {/* Right side - Additional info */}
      <div className="flex items-center space-x-4">
        {/* Database path (truncated) */}
        {!isMemory && (
          <div className="flex items-center space-x-1.5 max-w-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="truncate" title={activeProfile.dbPath}>
              {activeProfile.dbPath}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Top bar component

import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { toggleTheme } from '../state/slices/uiSlice';

export default function TopBar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  // Select primitive values separately to avoid unnecessary re-renders
  const activeProfileId = useAppSelector((state) => state.profiles.activeProfileId);
  const profiles = useAppSelector((state) => state.profiles.list);
  const connectionStatus = useAppSelector((state) =>
    activeProfileId ? state.profiles.connectionStatus[activeProfileId] : undefined
  );
  const connectionError = useAppSelector((state) =>
    activeProfileId ? state.profiles.connectionErrors[activeProfileId] : undefined
  );

  // Memoize the derived profile object
  const activeProfile = useMemo(() =>
    activeProfileId ? profiles.find((p) => p.id === activeProfileId) : null,
    [activeProfileId, profiles]
  );

  const statusStyles =
    connectionStatus === 'failed'
      ? {
          container: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
          dot: 'bg-red-500',
          label: 'Connection Failed',
        }
      : connectionStatus === 'connecting'
        ? {
            container: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
            dot: 'bg-yellow-500 animate-pulse',
            label: 'Connecting',
          }
        : {
            container: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
            dot: 'bg-green-500',
            label: 'Connected',
          };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeProfile && (
            <div
              className={`flex items-center space-x-3 px-3 py-1 rounded-full text-sm ${statusStyles.container}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`}></span>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {statusStyles.label}: {activeProfile.name}
                  </span>
                  <span
                    title={activeProfile.dbPath === ':memory:' ? 'In-memory database (data lost on disconnect)' : 'File-based database (changes persist to disk)'}
                    className="text-base"
                  >
                    {activeProfile.dbPath === ':memory:' ? '🧠' : '💾'}
                  </span>
                </div>
                {connectionError && (
                  <span className="text-xs opacity-80">
                    {connectionError}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </header>
  );
}

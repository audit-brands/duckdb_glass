// Profile list component

import { useNavigate } from 'react-router-dom';
import type { DuckDBProfile } from '@shared/types';

interface ProfileListProps {
  profiles: DuckDBProfile[];
  onDelete: (id: string) => void;
}

export default function ProfileList({ profiles, onDelete }: ProfileListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((profile) => {
        const isMemory = profile.dbPath === ':memory:';
        const persistenceIcon = isMemory ? '🧠' : '💾';
        const persistenceLabel = isMemory ? 'In-Memory' : 'Persistent';

        return (
          <div key={profile.id} className="card hover:shadow-lg transition-shadow min-w-0">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <span
                className="text-lg"
                title={`${persistenceLabel} database`}
              >
                {persistenceIcon}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isMemory
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {persistenceLabel}
                </span>
                {profile.readOnly && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                    Read-only
                  </span>
                )}
              </div>
              <div className="truncate">
                <span className="font-medium">Path:</span> {profile.dbPath}
              </div>
            </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/db/${profile.id}/schema`)}
              className="flex-1 min-w-[80px] btn-primary text-sm py-1.5"
            >
              Schema
            </button>
            <button
              onClick={() => navigate(`/db/${profile.id}/query`)}
              className="flex-1 min-w-[80px] btn-secondary text-sm py-1.5"
            >
              Query
            </button>
            <button
              onClick={() => navigate(`/db/${profile.id}/import`)}
              className="flex-1 min-w-[80px] btn-secondary text-sm py-1.5"
            >
              Import
            </button>
            <button
              onClick={() => onDelete(profile.id)}
              className="flex-1 min-w-[80px] py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
}

// Extensions management page - install and manage DuckDB extensions

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../state/hooks';
import { addToast } from '../state/slices/uiSlice';
import { acquireConnection, releaseConnection } from '../state/slices/profilesSlice';
import type { DuckDBProfile } from '@shared/types';

interface ExtensionInfo {
  extension_name: string;
  loaded: boolean;
  installed: boolean;
  install_path: string;
  description: string;
  aliases: string | string[] | null;
}

export default function ExtensionsPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const dispatch = useAppDispatch();
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [profile, setProfile] = useState<DuckDBProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [installingExt, setInstallingExt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!profileId) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        // Acquire connection and wait for it to be ready
        await dispatch(acquireConnection(profileId)).unwrap();

        if (cancelled) return;

        // Load profile to get current extension list
        const profiles = await window.orbitalDb.profiles.list();
        const currentProfile = profiles.find((p) => p.id === profileId);
        setProfile(currentProfile || null);

        if (cancelled) return;

        // Query DuckDB for available extensions
        const result = await window.orbitalDb.query.run(
          profileId,
          "SELECT extension_name, loaded, installed, install_path, description, aliases FROM duckdb_extensions() ORDER BY extension_name",
          undefined,
          { rowLimit: 1000 }
        );

        if (cancelled) return;

        const extList: ExtensionInfo[] = result.rows.map((row) => {
          const aliases = row[5];
          let aliasesStr: string | null = null;

          if (aliases && typeof aliases === 'object') {
            // Handle DuckDB LIST type which has an 'items' property
            if ('items' in aliases && Array.isArray(aliases.items)) {
              aliasesStr = aliases.items.join(', ');
            } else if (Array.isArray(aliases)) {
              aliasesStr = aliases.join(', ');
            }
          } else if (typeof aliases === 'string') {
            aliasesStr = aliases;
          }

          return {
            extension_name: row[0] as string,
            loaded: row[1] as boolean,
            installed: row[2] as boolean,
            install_path: row[3] as string,
            description: row[4] as string,
            aliases: aliasesStr,
          };
        });

        setExtensions(extList);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load extensions:', err);
          dispatch(
            addToast({
              type: 'error',
              message: `Failed to load extensions: ${(err as Error).message}`,
              duration: 7000,
            })
          );
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
      dispatch(releaseConnection(profileId));
    };
  }, [profileId, dispatch]);

  const handleInstall = async (extensionName: string) => {
    if (!profileId) return;

    setInstallingExt(extensionName);
    try {
      await window.orbitalDb.query.run(
        profileId,
        `INSTALL ${extensionName}`,
        undefined,
        { rowLimit: 0 }
      );

      // Refresh extension list
      const result = await window.orbitalDb.query.run(
        profileId,
        "SELECT extension_name, loaded, installed, install_path, description, aliases FROM duckdb_extensions() ORDER BY extension_name",
        undefined,
        { rowLimit: 1000 }
      );

      const extList: ExtensionInfo[] = result.rows.map((row) => {
        const aliases = row[5];
        let aliasesStr: string | null = null;

        if (aliases && typeof aliases === 'object') {
          // Handle DuckDB LIST type which has an 'items' property
          if ('items' in aliases && Array.isArray(aliases.items)) {
            aliasesStr = aliases.items.join(', ');
          } else if (Array.isArray(aliases)) {
            aliasesStr = aliases.join(', ');
          }
        } else if (typeof aliases === 'string') {
          aliasesStr = aliases;
        }

        return {
          extension_name: row[0] as string,
          loaded: row[1] as boolean,
          installed: row[2] as boolean,
          install_path: row[3] as string,
          description: row[4] as string,
          aliases: aliasesStr,
        };
      });

      setExtensions(extList);

      dispatch(
        addToast({
          type: 'success',
          message: `Extension "${extensionName}" installed successfully`,
          duration: 4000,
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: `Failed to install "${extensionName}": ${(err as Error).message}`,
          duration: 7000,
        })
      );
    } finally {
      setInstallingExt(null);
    }
  };

  const handleLoad = async (extensionName: string) => {
    if (!profileId) return;

    setInstallingExt(extensionName);
    try {
      await window.orbitalDb.query.run(
        profileId,
        `LOAD ${extensionName}`,
        undefined,
        { rowLimit: 0 }
      );

      // Refresh extension list
      const result = await window.orbitalDb.query.run(
        profileId,
        "SELECT extension_name, loaded, installed, install_path, description, aliases FROM duckdb_extensions() ORDER BY extension_name",
        undefined,
        { rowLimit: 1000 }
      );

      const extList: ExtensionInfo[] = result.rows.map((row) => {
        const aliases = row[5];
        let aliasesStr: string | null = null;

        if (aliases && typeof aliases === 'object') {
          // Handle DuckDB LIST type which has an 'items' property
          if ('items' in aliases && Array.isArray(aliases.items)) {
            aliasesStr = aliases.items.join(', ');
          } else if (Array.isArray(aliases)) {
            aliasesStr = aliases.join(', ');
          }
        } else if (typeof aliases === 'string') {
          aliasesStr = aliases;
        }

        return {
          extension_name: row[0] as string,
          loaded: row[1] as boolean,
          installed: row[2] as boolean,
          install_path: row[3] as string,
          description: row[4] as string,
          aliases: aliasesStr,
        };
      });

      setExtensions(extList);

      dispatch(
        addToast({
          type: 'success',
          message: `Extension "${extensionName}" loaded successfully`,
          duration: 4000,
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: `Failed to load "${extensionName}": ${(err as Error).message}`,
          duration: 7000,
        })
      );
    } finally {
      setInstallingExt(null);
    }
  };

  const handleToggleAutoLoad = async (extensionName: string, currentlyAutoLoaded: boolean) => {
    if (!profileId || !profile) return;

    try {
      const currentExtensions = profile.extensions || [];
      const updatedExtensions = currentlyAutoLoaded
        ? currentExtensions.filter((e) => e !== extensionName)
        : [...currentExtensions, extensionName];

      await window.orbitalDb.profiles.update(profileId, {
        extensions: updatedExtensions,
      });

      // Update local profile state
      const profiles = await window.orbitalDb.profiles.list();
      const updatedProfile = profiles.find((p) => p.id === profileId);
      setProfile(updatedProfile || null);

      dispatch(
        addToast({
          type: 'success',
          message: currentlyAutoLoaded
            ? `"${extensionName}" removed from auto-load`
            : `"${extensionName}" will auto-load on connection`,
          duration: 4000,
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: `Failed to update auto-load: ${(err as Error).message}`,
          duration: 7000,
        })
      );
    }
  };

  if (!profileId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profile selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading extensions...</p>
      </div>
    );
  }

  const filteredExtensions = extensions.filter((ext) =>
    ext.extension_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const autoLoadedExtensions = profile?.extensions || [];

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Extension Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Install and manage DuckDB extensions to add functionality
        </p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search extensions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Extensions</div>
          <div className="text-3xl font-bold">{extensions.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Installed</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {extensions.filter((e) => e.installed).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Loaded</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {extensions.filter((e) => e.loaded).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Auto-load</div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {autoLoadedExtensions.length}
          </div>
        </div>
      </div>

      {/* Extensions List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Available Extensions</h2>
        <div className="space-y-3">
          {filteredExtensions.map((ext) => {
            const isAutoLoaded = autoLoadedExtensions.includes(ext.extension_name);
            const isWorking = installingExt === ext.extension_name;

            return (
              <div
                key={ext.extension_name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{ext.extension_name}</h3>
                      {ext.loaded && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          Loaded
                        </span>
                      )}
                      {ext.installed && !ext.loaded && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          Installed
                        </span>
                      )}
                      {isAutoLoaded && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          Auto-load
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {ext.description || 'No description available'}
                    </p>
                    {ext.aliases && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Aliases: {ext.aliases}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!ext.installed && (
                      <button
                        onClick={() => handleInstall(ext.extension_name)}
                        disabled={isWorking}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        {isWorking ? 'Installing...' : 'Install'}
                      </button>
                    )}
                    {ext.installed && !ext.loaded && (
                      <button
                        onClick={() => handleLoad(ext.extension_name)}
                        disabled={isWorking}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        {isWorking ? 'Loading...' : 'Load'}
                      </button>
                    )}
                    {ext.installed && (
                      <button
                        onClick={() => handleToggleAutoLoad(ext.extension_name, isAutoLoaded)}
                        className={`text-sm px-3 py-1 rounded transition-colors whitespace-nowrap ${
                          isAutoLoaded
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isAutoLoaded ? '✓ Auto-load' : 'Auto-load'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExtensions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No extensions found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

// Configuration module for Orbital DB
// Loads environment variables from .env file (development only)

import * as dotenv from 'dotenv';
import { DEFAULT_RESULT_LIMIT, DEFAULT_QUERY_TIMEOUT_MS } from '../shared/constants';

// Load .env file if it exists (development only, not shipped with app)
dotenv.config();

/**
 * Application configuration loaded from environment variables
 * These are development-time defaults that can be overridden via .env file
 */
export const CONFIG = {
  /**
   * Node environment (development, production, test)
   */
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * Whether the app is running in development mode
   */
  isDevelopment: process.env.NODE_ENV === 'development',

  /**
   * Logging level for the application
   * Options: error, warn, info, debug, trace
   */
  logLevel: (process.env.LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug' | 'trace',

  /**
   * DuckDB configuration defaults
   * These can be overridden per-connection or via user settings in the future
   */
  duckdb: {
    /**
     * Default memory limit for DuckDB instances
     * Examples: '2GB', '4GB', '8GB'
     */
    defaultMemoryLimit: process.env.DEFAULT_MEMORY_LIMIT || '2GB',

    /**
     * Default number of threads for DuckDB query execution
     * 0 = use all available cores
     */
    defaultThreads: parseInt(process.env.DEFAULT_THREADS || '2', 10),
  },
  /**
   * Query result handling
   */
  results: {
    maxRows: parseInt(process.env.DEFAULT_RESULT_LIMIT || `${DEFAULT_RESULT_LIMIT}`, 10),
    maxExecutionTimeMs: parseInt(
      process.env.DEFAULT_QUERY_TIMEOUT_MS || `${DEFAULT_QUERY_TIMEOUT_MS}`,
      10
    ),
  },

  /**
   * Feature flags for development
   */
  features: {
    /**
     * Enable Electron DevTools in development
     */
    enableDevTools: process.env.VITE_ENABLE_DEV_TOOLS === 'true',

    /**
     * Enable experimental features (for testing)
     */
    enableExperimentalFeatures: process.env.VITE_ENABLE_EXPERIMENTAL_FEATURES === 'true',
  },

  /**
   * Build configuration
   */
  build: {
    /**
     * Generate source maps in production builds
     */
    generateSourceMap: process.env.GENERATE_SOURCEMAP === 'true',
  },
} as const;

/**
 * Log configuration on startup (development only)
 */
if (CONFIG.isDevelopment) {
  console.log('[Config] Loaded configuration:', {
    nodeEnv: CONFIG.nodeEnv,
    logLevel: CONFIG.logLevel,
    duckdb: CONFIG.duckdb,
    results: CONFIG.results,
  });
}

/**
 * Context for evaluating feature flags
 */
export interface FlagContext {
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  language?: string;
  [key: string]: unknown;
}

/**
 * Configuration options for the feature flag client
 */
export interface ClientOptions {
  /**
   * API key for accessing the feature flag service
   */
  apiKey: string;
  
  /**
   * Environment key (e.g., development, staging, production)
   */
  environmentKey: string;
  
  /**
   * Base URL for the API (defaults to production)
   */
  baseUrl?: string;
  
  /**
   * How frequently to poll for updates (in milliseconds)
   * Set to 0 to disable polling
   */
  pollingInterval?: number;
  
  /**
   * Initial flag values to bootstrap the SDK
   */
  bootstrap?: Record<string, unknown>;
  
  /**
   * Enable detailed logging
   */
  enableLogs?: boolean;
  
  /**
   * Default values to use when a flag is not found
   */
  defaultFlagValues?: Record<string, unknown>;
  
  /**
   * Default context to use for all flag evaluations
   */
  defaultContext?: FlagContext;
}

/**
 * Options for checking a feature flag
 */
export interface FlagOptions {
  /**
   * Context for flag evaluation
   */
  context?: FlagContext;
  
  /**
   * Default value to return if flag is not found
   */
  defaultValue?: unknown;
}
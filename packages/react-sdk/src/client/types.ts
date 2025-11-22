/**
 * Type definitions for @peek-a-boo/react-sdk
 *
 * This file imports shared types from @peek-a-boo/core and defines SDK-specific types.
 * Never duplicate types that exist in core - always import them.
 */

// ============================================================================
// IMPORTED FROM CORE (Single Source of Truth)
// ============================================================================

import type { FeatureFlag, Environment } from '@peek-a-boo/core';

// Re-export for SDK consumers
export type { FeatureFlag, Environment };

// ============================================================================
// SDK-SPECIFIC TYPES
// ============================================================================

/**
 * Configuration for FeatureFlagClient
 */
export interface ClientConfig {
  /** Project ID from Peek-a-boo dashboard */
  projectId: string;
  /** Environment to fetch flags for */
  environment: Environment;
  /** API base URL (defaults to http://localhost:6001 in development) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Result object returned by useFeatureFlag hook
 *
 * @template T - Type of the flag value (defaults to unknown for type safety)
 */
export interface FlagResult<T = unknown> {
  /** Whether the flag is enabled */
  enabled: boolean;
  /** Flag value (typed based on generic parameter) */
  value?: T;
  /** Loading state (true while fetching) */
  loading: boolean;
  /** Error if fetch failed */
  error?: Error;
}

/**
 * API response when fetching all flags from SDK service
 */
export interface FlagsResponse {
  /** Array of feature flags */
  flags: FeatureFlag[];
  /** Environment the flags belong to */
  environment: string;
}

/**
 * Custom error class for Peek-a-boo SDK errors
 *
 * @example
 * ```typescript
 * try {
 *   await client.initialize();
 * } catch (error) {
 *   if (error instanceof PeekabooError) {
 *     console.log(error.code); // e.g., "INVALID_PROJECT_ID"
 *   }
 * }
 * ```
 */
export class PeekabooError extends Error {
  constructor(
    message: string,
    /** Error code for programmatic handling */
    public code: ErrorCode
  ) {
    super(message);
    this.name = 'PeekabooError';

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PeekabooError);
    }
  }
}

/**
 * Error codes used by PeekabooError
 */
export enum ErrorCode {
  /** Invalid or missing project ID */
  INVALID_PROJECT_ID = 'INVALID_PROJECT_ID',

  /** Invalid environment parameter */
  INVALID_ENVIRONMENT = 'INVALID_ENVIRONMENT',

  /** Requested resource not found (404) */
  NOT_FOUND = 'NOT_FOUND',

  /** HTTP error from API (non-2xx status) */
  HTTP_ERROR = 'HTTP_ERROR',

  /** Network connectivity issue */
  NETWORK_ERROR = 'NETWORK_ERROR',

  /** Request timeout */
  TIMEOUT = 'TIMEOUT',

  /** Unknown error */
  UNKNOWN = 'UNKNOWN',
}

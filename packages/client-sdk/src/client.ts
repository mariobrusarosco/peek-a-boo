import { ClientOptions, FlagContext, FlagOptions } from './types';
import { logger } from './utils/logger';
import { EventEmitter } from './utils/events';

/**
 * Feature Flag Client for Peek-a-boo
 * Provides methods for evaluating feature flags
 */
export class FeatureFlagClient {
  private readonly apiKey: string;
  private readonly environmentKey: string;
  private readonly baseUrl: string;
  private readonly pollingInterval: number;
  private readonly defaultContext?: FlagContext;
  private readonly enableLogs: boolean;
  private readonly defaultFlagValues: Record<string, unknown>;
  private flags: Record<string, unknown> = {};
  private events = new EventEmitter();
  private pollTimer?: number;
  private isInitialized = false;
  private isError = false;

  /**
   * Creates a new Feature Flag client
   * @param options Configuration options
   */
  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.environmentKey = options.environmentKey;
    this.baseUrl = options.baseUrl || 'https://api.peek-a-boo.io';
    this.pollingInterval = options.pollingInterval ?? 30000; // Default to 30 seconds
    this.defaultContext = options.defaultContext;
    this.enableLogs = options.enableLogs ?? false;
    this.defaultFlagValues = options.defaultFlagValues || {};

    // Initialize with bootstrap values if provided
    if (options.bootstrap) {
      this.flags = { ...options.bootstrap };
      this.isInitialized = true;
    }

    this.log('FeatureFlagClient initialized');
    
    // Start fetching flags if not bootstrapped
    if (!this.isInitialized) {
      this.fetchFlags();
    }

    // Set up polling if enabled
    if (this.pollingInterval > 0) {
      this.startPolling();
    }
  }

  /**
   * Checks if a feature flag is enabled
   * @param key The feature flag key
   * @param options Options for flag evaluation
   * @returns Boolean indicating if the flag is enabled
   */
  isEnabled(key: string, options?: FlagOptions): boolean {
    const defaultValue = options?.defaultValue ?? this.defaultFlagValues[key] ?? false;
    
    if (!this.isInitialized) {
      this.log(`Flag '${key}' checked before initialization, returning default: ${defaultValue}`);
      return defaultValue as boolean;
    }

    const flag = this.flags[key];
    if (flag === undefined) {
      this.log(`Flag '${key}' not found, returning default: ${defaultValue}`);
      return defaultValue as boolean;
    }

    const context = this.mergeContext(options?.context);
    
    // Basic targeting logic - in real implementation this would
    // check rules against the context
    if (typeof flag === 'object' && flag !== null && 'targeting' in flag && context.userId) {
      // Simple example of targeting logic
      return this.evaluateTargeting(flag, context, defaultValue as boolean);
    }

    // Simple boolean flag or object with enabled property
    if (typeof flag === 'boolean') {
      return flag;
    } else if (typeof flag === 'object' && flag !== null && 'enabled' in flag && typeof (flag as { enabled: unknown }).enabled === 'boolean') {
      return (flag as { enabled: boolean }).enabled;
    }
    
    return defaultValue as boolean; // Fallback
  }

  /**
   * Gets the value of a feature flag
   * @param key The feature flag key
   * @param options Options for flag evaluation
   * @returns The value of the flag
   */
  getValue<T>(key: string, options?: FlagOptions): T {
    const defaultValue = options?.defaultValue ?? this.defaultFlagValues[key];
    
    if (!this.isInitialized) {
      this.log(`Flag value '${key}' checked before initialization, returning default`);
      return defaultValue as T;
    }

    const flag = this.flags[key];
    if (flag === undefined) {
      this.log(`Flag '${key}' not found, returning default`);
      return defaultValue as T;
    }

    const context = this.mergeContext(options?.context);
    
    // For object flags with targeting
    if (typeof flag === 'object' && flag !== null && 'targeting' in flag && 'value' in flag && context.userId) {
      const evaluationResult = this.evaluateTargeting(flag, context, defaultValue);
      // If targeting returns true, use the flag's value, otherwise use defaultValue
      return (evaluationResult ? (flag as { value: T }).value : defaultValue) as T;
    }

    // For object flags with value property (no targeting or targeting didn't apply/match)
    if (typeof flag === 'object' && flag !== null && 'value' in flag) {
      return (flag as { value: T }).value;
    }

    // For simple value flags (boolean, string, number)
    return flag as T;
  }

  /**
   * Subscribe to flag changes
   * @param callback Function to call when flags change
   * @returns Unsubscribe function
   */
  onFlagsChanged(callback: (flags: Record<string, unknown>) => void): () => void {
    return this.events.on('flagsChanged', callback as (...args: unknown[]) => void);
  }

  /**
   * Initialize the client and fetch flags
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.log('Client already initialized');
      return;
    }
    
    await this.fetchFlags();
  }

  /**
   * Fetch the latest flags from the server
   * @returns Promise that resolves when flags are fetched
   */
  async fetchFlags(): Promise<void> {
    try {
      this.log('Fetching flags...');
      const context = this.defaultContext || {};
      
      const url = new URL(`${this.baseUrl}/api/v1/flags`);
      url.searchParams.append('environment', this.environmentKey);
      
      // Add context as query parameters for server-side evaluation
      Object.entries(context).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(`context.${key}`, String(value));
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch flags: ${response.statusText}`);
      }

      const data = await response.json() as { flags?: Record<string, unknown> }; // Assert type of data
      
      // Update flags and notify subscribers
      this.flags = data.flags || {};
      this.isInitialized = true;
      this.isError = false;
      this.events.emit('flagsChanged', this.flags);
      
      this.log('Flags updated:', this.flags);
    } catch (error) {
      this.isError = true;
      this.log('Error fetching flags:', error);
    }
  }

  /**
   * Close the client and clean up resources
   */
  close(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
    
    this.events.clear();
    this.log('Client closed');
  }

  private startPolling(): void {
    this.pollTimer = window.setInterval(() => {
      this.fetchFlags();
    }, this.pollingInterval);
    
    this.log(`Polling started (interval: ${this.pollingInterval}ms)`);
  }

  private mergeContext(context?: FlagContext): FlagContext {
    return {
      ...this.defaultContext,
      ...context
    };
  }

  private evaluateTargeting(flag: unknown, context: FlagContext, defaultValue: unknown): boolean {
    try {
      // Ensure flag is an object and not null
      if (!flag || typeof flag !== 'object') {
        return defaultValue as boolean; 
      }

      // Check for default enabled state of the flag itself, if targeting doesn't apply/match
      let flagEnabledState: boolean | undefined = undefined;
      if ('enabled' in flag && typeof (flag as { enabled: unknown }).enabled === 'boolean') {
        flagEnabledState = (flag as { enabled: boolean }).enabled;
      }

      // Check for targeting property and its validity
      if (!('targeting' in flag) || 
          !flag.targeting || 
          typeof flag.targeting !== 'object' || 
          flag.targeting === null) {
        // No targeting property, or it's not a valid object. Use flag's own enabled state or default.
        return flagEnabledState !== undefined ? flagEnabledState : defaultValue as boolean;
      }

      // Now, flag.targeting is known to be a non-null object. Check for its 'rules' property.
      const targetingConfig = flag.targeting as { rules?: unknown };

      if (!('rules' in targetingConfig) || !Array.isArray(targetingConfig.rules)) {
        // No 'rules' array in targetingConfig. Use flag's own enabled state or default.
        return flagEnabledState !== undefined ? flagEnabledState : defaultValue as boolean;
      }

      // Now targetingConfig.rules is known to be an array.
      for (const rule of targetingConfig.rules) {
        if (this.matchesRule(rule, context)) {
          return true; // A rule matched, feature is enabled by this rule
        }
      }
      
      // No rules matched. Use flag's own enabled state or default.
      return flagEnabledState !== undefined ? flagEnabledState : defaultValue as boolean;

    } catch (error) {
      this.log('Error evaluating targeting rules:', error);
      return defaultValue as boolean;
    }
  }

  private matchesRule(rule: unknown, context: FlagContext): boolean {
    // Very simple rule matching - real implementation would be more robust
    const attribute = rule && typeof rule === 'object' && 'attribute' in rule ? rule.attribute : undefined;
    const operator = rule && typeof rule === 'object' && 'operator' in rule ? rule.operator : undefined;
    const value = rule && typeof rule === 'object' && 'value' in rule ? rule.value : undefined;
    
    const contextValue = context[attribute as string];

    if (!attribute || !operator || value === undefined || contextValue === undefined) {
      return false;
    }
    
    switch (operator) {
      case 'EQUALS':
        return contextValue === value;
      case 'NOT_EQUALS':
        return contextValue !== value;
      case 'CONTAINS':
        return typeof contextValue === 'string' && typeof value === 'string' && contextValue.includes(value);
      case 'IN':
        return Array.isArray(value) && value.includes(contextValue);
      default:
        return false;
    }
  }

  private log(...args: unknown[]): void {
    if (this.enableLogs) {
      logger.info(...args);
    }
  }
}
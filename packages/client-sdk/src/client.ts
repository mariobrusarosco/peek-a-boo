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
  private readonly defaultFlagValues: Record<string, any>;
  private flags: Record<string, any> = {};
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
      return defaultValue;
    }

    const flag = this.flags[key];
    if (flag === undefined) {
      this.log(`Flag '${key}' not found, returning default: ${defaultValue}`);
      return defaultValue;
    }

    const context = this.mergeContext(options?.context);
    
    // Basic targeting logic - in real implementation this would
    // check rules against the context
    if (typeof flag === 'object' && flag.targeting && context.userId) {
      // Simple example of targeting logic
      return this.evaluateTargeting(flag, context, defaultValue);
    }

    // Simple boolean flag
    return flag === true || flag.enabled === true;
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
    if (typeof flag === 'object' && flag.targeting && context.userId) {
      const variant = this.evaluateTargeting(flag, context, defaultValue);
      return (variant ? flag.value : defaultValue) as T;
    }

    // For object flags with value property
    if (typeof flag === 'object' && flag.value !== undefined) {
      return flag.value as T;
    }

    // For simple value flags
    return flag as T;
  }

  /**
   * Subscribe to flag changes
   * @param callback Function to call when flags change
   * @returns Unsubscribe function
   */
  onFlagsChanged(callback: (flags: Record<string, any>) => void): () => void {
    return this.events.on('flagsChanged', callback);
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

      const data = await response.json();
      
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

  private evaluateTargeting(flag: any, context: FlagContext, defaultValue: any): boolean {
    // Simple targeting implementation - in a real SDK this would be more sophisticated
    try {
      if (!flag.targeting || !flag.targeting.rules || !Array.isArray(flag.targeting.rules)) {
        return flag.enabled === true;
      }
      
      // Check if any targeting rule matches
      for (const rule of flag.targeting.rules) {
        if (this.matchesRule(rule, context)) {
          return true;
        }
      }
      
      // No rules matched
      return flag.enabled === true;
    } catch (error) {
      this.log('Error evaluating targeting rules:', error);
      return defaultValue;
    }
  }

  private matchesRule(rule: any, context: FlagContext): boolean {
    // Very simple rule matching - real implementation would be more robust
    const attribute = rule.attribute;
    const operator = rule.operator;
    const value = rule.value;
    
    if (!attribute || !operator || value === undefined || context[attribute] === undefined) {
      return false;
    }
    
    switch (operator) {
      case 'EQUALS':
        return context[attribute] === value;
      case 'NOT_EQUALS':
        return context[attribute] !== value;
      case 'CONTAINS':
        return String(context[attribute]).includes(String(value));
      case 'IN':
        return Array.isArray(value) && value.includes(context[attribute]);
      default:
        return false;
    }
  }

  private log(...args: any[]): void {
    if (this.enableLogs) {
      logger.info(...args);
    }
  }
} 
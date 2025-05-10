/**
 * Simple logger utility for the SDK
 */
export const logger = {
  /**
   * Log informational message
   */
  info: (...args: unknown[]): void => {
    if (typeof console !== 'undefined') {
      console.info('[Peek-a-boo]', ...args);
    }
  },
  
  /**
   * Log warning message
   */
  warn: (...args: unknown[]): void => {
    if (typeof console !== 'undefined') {
      console.warn('[Peek-a-boo]', ...args);
    }
  },
  
  /**
   * Log error message
   */
  error: (...args: unknown[]): void => {
    if (typeof console !== 'undefined') {
      console.error('[Peek-a-boo]', ...args);
    }
  }
}; 
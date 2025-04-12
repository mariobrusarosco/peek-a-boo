type EventCallback = (...args: any[]) => void;

/**
 * Simple event emitter for the SDK
 */
export class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  /**
   * Subscribe to an event
   * @param event Event name
   * @param callback Function to call when event is emitted
   * @returns Unsubscribe function
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
      if (this.events[event].length === 0) {
        delete this.events[event];
      }
    };
  }

  /**
   * Emit an event with arguments
   * @param event Event name
   * @param args Arguments to pass to event handlers
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          // Prevent errors in callbacks from breaking the event loop
          if (typeof console !== 'undefined') {
            console.error(`Error in event handler for ${event}:`, error);
          }
        }
      });
    }
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.events = {};
  }
} 

/**
 * Circuit Breaker Pattern Implementation
 * 
 * This utility provides a circuit breaker pattern implementation to prevent
 * further operations when certain thresholds are exceeded.
 */

// Circuit breaker states
export enum CircuitState {
  CLOSED = 'CLOSED',   // Normal operation - requests are allowed
  OPEN = 'OPEN',       // Failure threshold exceeded - requests are blocked
  HALF_OPEN = 'HALF_OPEN'  // Testing if service has recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening the circuit
  resetTimeout: number;          // Time in ms before attempting to half-open
  monitorInterval?: number;      // Optional monitoring interval
  onStateChange?: (oldState: CircuitState, newState: CircuitState) => void;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastStateChange: number = Date.now();
  private config: CircuitBreakerConfig;
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      monitorInterval: 60000, // 1 minute
      ...config
    };
    
    // Start monitoring if interval is specified
    if (this.config.monitorInterval) {
      this.startMonitoring();
    }
  }

  /**
   * Execute a function with circuit breaker protection
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      // Check if it's time to try again
      if ((Date.now() - this.lastStateChange) > this.config.resetTimeout) {
        this.halfOpen();
      } else {
        throw new Error("Circuit is OPEN - operation rejected");
      }
    }
    
    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Record a successful operation
   */
  private recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= 2) { // Require 2 consecutive successes to close circuit
        this.close();
      }
    }
    
    // Reset failure count in CLOSED state
    if (this.state === CircuitState.CLOSED) {
      this.failureCount = 0;
    }
  }

  /**
   * Record a failed operation
   */
  private recordFailure(): void {
    this.failureCount++;
    if (this.state === CircuitState.CLOSED && this.failureCount >= this.config.failureThreshold) {
      this.open();
    } else if (this.state === CircuitState.HALF_OPEN) {
      this.open();
    }
  }

  /**
   * Open the circuit
   */
  private open(): void {
    const oldState = this.state;
    this.state = CircuitState.OPEN;
    this.lastStateChange = Date.now();
    this.successCount = 0;
    
    // Set timer to transition to HALF_OPEN after resetTimeout
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    
    this.resetTimer = setTimeout(() => {
      this.halfOpen();
    }, this.config.resetTimeout);
    
    if (this.config.onStateChange) {
      this.config.onStateChange(oldState, this.state);
    }
    
    console.log(`Circuit OPENED at ${new Date().toISOString()}`);
  }

  /**
   * Half-open the circuit to test if the failure condition is resolved
   */
  private halfOpen(): void {
    const oldState = this.state;
    this.state = CircuitState.HALF_OPEN;
    this.lastStateChange = Date.now();
    this.successCount = 0;
    
    if (this.config.onStateChange) {
      this.config.onStateChange(oldState, this.state);
    }
    
    console.log(`Circuit HALF-OPENED at ${new Date().toISOString()}`);
  }

  /**
   * Close the circuit - normal operations
   */
  private close(): void {
    const oldState = this.state;
    this.state = CircuitState.CLOSED;
    this.lastStateChange = Date.now();
    this.failureCount = 0;
    this.successCount = 0;
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
    
    if (this.config.onStateChange) {
      this.config.onStateChange(oldState, this.state);
    }
    
    console.log(`Circuit CLOSED at ${new Date().toISOString()}`);
  }

  /**
   * Start monitoring the circuit breaker state
   */
  private startMonitoring(): void {
    setInterval(() => {
      const stateAge = Date.now() - this.lastStateChange;
      console.log(`Circuit monitor: State=${this.state}, Age=${stateAge}ms, Failures=${this.failureCount}`);
    }, this.config.monitorInterval);
  }

  /**
   * Get the current state of the circuit
   */
  public getState(): CircuitState {
    return this.state;
  }

  /**
   * Force reset the circuit to closed state
   */
  public reset(): void {
    const oldState = this.state;
    this.close();
    
    if (this.config.onStateChange && oldState !== CircuitState.CLOSED) {
      this.config.onStateChange(oldState, CircuitState.CLOSED);
    }
  }
}

// Create a central registry of circuit breakers
const circuitBreakers: Record<string, CircuitBreaker> = {};

/**
 * Get or create a circuit breaker instance
 */
export const getCircuitBreaker = (name: string, config?: CircuitBreakerConfig): CircuitBreaker => {
  if (!circuitBreakers[name]) {
    circuitBreakers[name] = new CircuitBreaker(config || {
      failureThreshold: 5,
      resetTimeout: 30000
    });
  }
  return circuitBreakers[name];
};

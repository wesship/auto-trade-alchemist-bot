
/**
 * Model Performance Monitoring
 * 
 * This utility tracks AI model performance metrics over time to detect
 * drift or performance degradation.
 */

// Re-export everything from the refactored modules
export * from './monitoring';

// Also export the default export for backward compatibility
import monitoring from './monitoring';
export default monitoring;

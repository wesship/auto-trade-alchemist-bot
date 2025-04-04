
/**
 * Model Performance Monitoring
 * 
 * This utility tracks AI model performance metrics over time to detect
 * drift or performance degradation.
 */

export * from './types';
export * from './metrics';
export * from './alerts';
export * from './comparison';

// For backwards compatibility, create a default export
import * as metrics from './metrics';
import * as alerts from './alerts';
import * as comparison from './comparison';

export default {
  recordModelMetric: metrics.recordModelMetric,
  getModelMetrics: metrics.getModelMetrics,
  getPerformanceAlerts: alerts.getPerformanceAlerts,
  clearPerformanceAlerts: alerts.clearPerformanceAlerts,
  calculateModelPerformance: metrics.calculateModelPerformance,
  recordModelComparison: comparison.recordModelComparison,
  getModelComparisons: comparison.getModelComparisons,
  getAggregatedModelPerformance: comparison.getAggregatedModelPerformance
};

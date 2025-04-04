/**
 * Performance alerts management
 */

import { ModelMetric, ModelPerformanceAlert } from './types';
import { getStoredPerformanceAlerts, storePerformanceAlerts } from './storage';
import { getModelMetrics } from './metrics';

/**
 * Get all performance alerts
 */
export const getPerformanceAlerts = (): ModelPerformanceAlert[] => {
  return getStoredPerformanceAlerts();
};

/**
 * Clear all performance alerts
 */
export const clearPerformanceAlerts = (): void => {
  storePerformanceAlerts([]);
};

/**
 * Check for performance degradation based on recent metrics
 */
export const checkPerformanceDegradation = (currentMetric: ModelMetric): void => {
  try {
    const metrics = getModelMetrics(currentMetric.modelId);
    if (metrics.length < 5) return; // Need at least 5 metrics for comparison
    
    // Get average of previous 5 metrics (excluding current)
    const recentMetrics = metrics.slice(-6, -1);
    const avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.accuracy, 0) / recentMetrics.length;
    const avgProfitLoss = recentMetrics.reduce((sum, m) => sum + m.profitLoss, 0) / recentMetrics.length;
    const avgSuccessRate = recentMetrics.reduce((sum, m) => sum + m.successRate, 0) / recentMetrics.length;
    
    const alerts: ModelPerformanceAlert[] = [];
    
    // Check for accuracy degradation (15% drop)
    if (currentMetric.accuracy < avgAccuracy * 0.85) {
      alerts.push({
        modelId: currentMetric.modelId,
        metricName: 'accuracy',
        timestamp: new Date().toISOString(),
        currentValue: currentMetric.accuracy,
        threshold: avgAccuracy * 0.85,
        message: `Model accuracy has dropped by more than 15% (from ${avgAccuracy.toFixed(2)} to ${currentMetric.accuracy.toFixed(2)})`
      });
    }
    
    // Check for profit/loss degradation (30% drop)
    if (avgProfitLoss > 0 && currentMetric.profitLoss < avgProfitLoss * 0.7) {
      alerts.push({
        modelId: currentMetric.modelId,
        metricName: 'profitLoss',
        timestamp: new Date().toISOString(),
        currentValue: currentMetric.profitLoss,
        threshold: avgProfitLoss * 0.7,
        message: `Model profit has dropped by more than 30% (from ${avgProfitLoss.toFixed(2)} to ${currentMetric.profitLoss.toFixed(2)})`
      });
    }
    
    // Check for success rate degradation (20% drop)
    if (currentMetric.successRate < avgSuccessRate * 0.8) {
      alerts.push({
        modelId: currentMetric.modelId,
        metricName: 'successRate',
        timestamp: new Date().toISOString(),
        currentValue: currentMetric.successRate,
        threshold: avgSuccessRate * 0.8,
        message: `Model success rate has dropped by more than 20% (from ${(avgSuccessRate * 100).toFixed(2)}% to ${(currentMetric.successRate * 100).toFixed(2)}%)`
      });
    }
    
    // If we have alerts, store them
    if (alerts.length > 0) {
      const existingAlerts = getStoredPerformanceAlerts();
      
      const updatedAlerts = [...existingAlerts, ...alerts];
      
      // Keep only the latest 50 alerts
      if (updatedAlerts.length > 50) {
        updatedAlerts.splice(0, updatedAlerts.length - 50);
      }
      
      storePerformanceAlerts(updatedAlerts);
      
      // Log alerts to console
      alerts.forEach(alert => {
        console.warn(`Model Performance Alert: ${alert.message}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking for performance degradation:', error);
  }
};

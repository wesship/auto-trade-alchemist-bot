/**
 * Model Performance Monitoring
 * 
 * This utility tracks AI model performance metrics over time to detect
 * drift or performance degradation.
 */

export interface ModelMetric {
  modelId: string;
  timestamp: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  profitLoss: number;
  tradeCount: number;
  successRate: number;
}

export interface ModelPerformanceAlert {
  modelId: string;
  metricName: string;
  timestamp: string;
  currentValue: number;
  threshold: number;
  message: string;
}

// Store metrics in localStorage with prefixes
const METRICS_KEY_PREFIX = 'model_metrics_';
const ALERTS_KEY = 'model_performance_alerts';

/**
 * Record a model performance metric
 */
export const recordModelMetric = (metric: ModelMetric): void => {
  try {
    const key = `${METRICS_KEY_PREFIX}${metric.modelId}`;
    const storedMetrics = localStorage.getItem(key);
    const metrics = storedMetrics ? JSON.parse(storedMetrics) : [];
    
    metrics.push(metric);
    
    // Keep only the last 100 metrics for storage efficiency
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    localStorage.setItem(key, JSON.stringify(metrics));
    
    // Check for performance degradation
    checkPerformanceDegradation(metric);
    
  } catch (error) {
    console.error('Failed to record model metric:', error);
  }
};

/**
 * Get model metrics for a given model
 */
export const getModelMetrics = (modelId: string): ModelMetric[] => {
  try {
    const key = `${METRICS_KEY_PREFIX}${modelId}`;
    const storedMetrics = localStorage.getItem(key);
    return storedMetrics ? JSON.parse(storedMetrics) : [];
  } catch (error) {
    console.error('Failed to retrieve model metrics:', error);
    return [];
  }
};

/**
 * Get all performance alerts
 */
export const getPerformanceAlerts = (): ModelPerformanceAlert[] => {
  try {
    const storedAlerts = localStorage.getItem(ALERTS_KEY);
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  } catch (error) {
    console.error('Failed to retrieve performance alerts:', error);
    return [];
  }
};

/**
 * Clear all performance alerts
 */
export const clearPerformanceAlerts = (): void => {
  localStorage.removeItem(ALERTS_KEY);
};

/**
 * Check for performance degradation based on recent metrics
 */
const checkPerformanceDegradation = (currentMetric: ModelMetric): void => {
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
      const storedAlerts = localStorage.getItem(ALERTS_KEY);
      const existingAlerts = storedAlerts ? JSON.parse(storedAlerts) : [];
      
      const updatedAlerts = [...existingAlerts, ...alerts];
      
      // Keep only the latest 50 alerts
      if (updatedAlerts.length > 50) {
        updatedAlerts.splice(0, updatedAlerts.length - 50);
      }
      
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
      
      // Log alerts to console
      alerts.forEach(alert => {
        console.warn(`Model Performance Alert: ${alert.message}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking for performance degradation:', error);
  }
};

/**
 * Calculate model performance metrics based on trade signals and executions
 */
export const calculateModelPerformance = (
  modelId: string,
  signals: any[],
  executions: any[]
): ModelMetric => {
  // Match signals with their executions
  let correctPredictions = 0;
  let totalPredictions = 0;
  let totalProfit = 0;
  
  // Process only signals that have matching executions
  const matchedSignals = signals.filter(signal => {
    return executions.some(exec => 
      exec.symbol === signal.symbol && 
      exec.modelId === modelId &&
      new Date(exec.timestamp).getTime() - new Date(signal.timestamp).getTime() < 24 * 60 * 60 * 1000 // Within 24 hours
    );
  });
  
  matchedSignals.forEach(signal => {
    totalPredictions++;
    
    // Find executions for this signal
    const relatedExecutions = executions.filter(exec => 
      exec.symbol === signal.symbol && 
      exec.modelId === modelId &&
      new Date(exec.timestamp).getTime() - new Date(signal.timestamp).getTime() < 24 * 60 * 60 * 1000
    );
    
    // Determine if the prediction was correct (simplified - in real world would need price movement data)
    if (relatedExecutions.length > 0) {
      // For this example, assume a correct prediction if action matches and there was a profit
      const execution = relatedExecutions[0];
      const isProfitable = (signal.action === 'BUY' && execution.profit > 0) || 
                           (signal.action === 'SELL' && execution.profit < 0);
      
      if (isProfitable) {
        correctPredictions++;
      }
      
      totalProfit += execution.profit || 0;
    }
  });
  
  // Calculate metrics
  const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  const successRate = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  
  // In a real system, you'd calculate precision, recall, and F1 score more accurately
  // This is a simplified version
  const precision = accuracy;
  const recall = accuracy;
  const f1Score = accuracy;
  
  return {
    modelId,
    timestamp: new Date().toISOString(),
    accuracy,
    precision,
    recall,
    f1Score,
    profitLoss: totalProfit,
    tradeCount: totalPredictions,
    successRate
  };
};

export default {
  recordModelMetric,
  getModelMetrics,
  getPerformanceAlerts,
  clearPerformanceAlerts,
  calculateModelPerformance
};

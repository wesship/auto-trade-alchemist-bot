/**
 * Metrics recording and calculation utilities
 */

import { ModelMetric } from './types';
import { getStoredModelMetrics, storeModelMetrics } from './storage';
import { checkPerformanceDegradation } from './alerts';

/**
 * Record a model performance metric
 */
export const recordModelMetric = (metric: ModelMetric): void => {
  try {
    const modelId = metric.modelId;
    const metrics = getStoredModelMetrics(modelId);
    
    metrics.push(metric);
    
    // Keep only the last 100 metrics for storage efficiency
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    storeModelMetrics(modelId, metrics);
    
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
  return getStoredModelMetrics(modelId);
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

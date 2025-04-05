
import { ModelDriftStatus, ModelHealth } from '../../../types/trading';

/**
 * Generate sample model health data
 */
export const generateModelHealth = (modelId: string): ModelHealth => {
  // In a real application, this would be based on actual metrics
  return {
    accuracy: 0.75 + (Math.random() * 0.2 - 0.1), // 65-85% accuracy
    drift: Math.random() > 0.8 ? ModelDriftStatus.WARNING : ModelDriftStatus.NORMAL,
    lastEvaluationDate: new Date().toISOString(),
    trainingStatus: Math.random() > 0.7 ? 'NEEDS_TRAINING' : 'READY',
    errorRate: Math.random() * 0.15, // 0-15% error rate
    latency: 100 + Math.random() * 200 // 100-300ms latency
  };
};

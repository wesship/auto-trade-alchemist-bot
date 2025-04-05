
import { ModelEvaluationMetrics, ModelComparisonResult, ModelPerformanceHistory } from './types';
import logger from '@/utils/logger';

// In-memory storage for evaluation metrics
// In a real app, this would be a database
const evaluationHistory: ModelEvaluationMetrics[] = [];
const comparisonHistory: ModelComparisonResult[] = [];

/**
 * Record evaluation metrics for a model
 */
export const recordModelEvaluation = (metrics: ModelEvaluationMetrics): void => {
  logger.info(`Recording evaluation metrics for model ${metrics.modelId}`);
  evaluationHistory.push(metrics);
};

/**
 * Get evaluation history for a specific model
 */
export const getModelEvaluationHistory = (modelId: string): ModelEvaluationMetrics[] => {
  return evaluationHistory.filter(metrics => metrics.modelId === modelId);
};

/**
 * Get aggregated performance metrics for a model
 */
export const getModelPerformanceHistory = (modelId: string): ModelPerformanceHistory => {
  const modelMetrics = getModelEvaluationHistory(modelId);
  
  // Calculate average metrics
  const averageMetrics = {
    codeQuality: 0,
    syntaxErrors: 0,
    promptAdherence: 0,
    completionTime: 0,
    tokenUsage: 0
  };
  
  if (modelMetrics.length > 0) {
    averageMetrics.codeQuality = modelMetrics.reduce((sum, m) => sum + m.codeQuality, 0) / modelMetrics.length;
    averageMetrics.syntaxErrors = modelMetrics.reduce((sum, m) => sum + m.syntaxErrors, 0) / modelMetrics.length;
    averageMetrics.promptAdherence = modelMetrics.reduce((sum, m) => sum + m.promptAdherence, 0) / modelMetrics.length;
    averageMetrics.completionTime = modelMetrics.reduce((sum, m) => sum + m.completionTime, 0) / modelMetrics.length;
    averageMetrics.tokenUsage = modelMetrics.reduce((sum, m) => sum + m.tokenUsage, 0) / modelMetrics.length;
  }
  
  const lastEvaluated = modelMetrics.length > 0 
    ? modelMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
    : '';
  
  return {
    modelId,
    evaluations: modelMetrics,
    averageMetrics,
    lastEvaluated
  };
};

/**
 * Record a model comparison result
 */
export const recordModelComparison = (result: ModelComparisonResult): void => {
  logger.info(`Recording comparison results for ${result.evaluations.length} models`);
  comparisonHistory.push(result);
};

/**
 * Get all model comparison results
 */
export const getModelComparisons = (): ModelComparisonResult[] => {
  return comparisonHistory;
};

/**
 * Get model comparisons for a specific prompt
 */
export const getModelComparisonsForPrompt = (promptId: string): ModelComparisonResult[] => {
  return comparisonHistory.filter(comparison => comparison.promptId === promptId);
};

/**
 * Get the most recent model comparison
 */
export const getMostRecentComparison = (): ModelComparisonResult | null => {
  if (comparisonHistory.length === 0) return null;
  
  return comparisonHistory.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
};

/**
 * Calculate performance score for a model
 * This combines code quality, syntax errors, and backtest performance
 * into a single score from 0-100
 */
export const calculatePerformanceScore = (metrics: ModelEvaluationMetrics): number => {
  // Weights for different metrics
  const weights = {
    codeQuality: 0.3,
    syntaxErrors: 0.2,
    promptAdherence: 0.2,
    backtestPerformance: 0.3
  };
  
  // Calculate backtest score (if available)
  let backtestScore = 0;
  if (metrics.backtestPerformance) {
    const bp = metrics.backtestPerformance;
    backtestScore = (
      normalize(bp.sharpeRatio, 0, 3) * 0.3 +
      normalize(1 - bp.maxDrawdown / 100, 0, 1) * 0.2 +
      normalize(bp.winRate, 0, 1) * 0.2 +
      normalize(bp.profitFactor, 1, 3) * 0.3
    ) * 100;
  }
  
  // Normalize syntax errors (lower is better)
  const normalizedSyntaxErrors = Math.max(0, 100 - metrics.syntaxErrors * 10);
  
  // Calculate final score
  const score = 
    weights.codeQuality * metrics.codeQuality * 10 +
    weights.syntaxErrors * normalizedSyntaxErrors +
    weights.promptAdherence * metrics.promptAdherence * 10 +
    weights.backtestPerformance * backtestScore;
  
  return Math.min(100, Math.max(0, score));
};

// Helper function to normalize values to 0-1 range
const normalize = (value: number, min: number, max: number): number => {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
};

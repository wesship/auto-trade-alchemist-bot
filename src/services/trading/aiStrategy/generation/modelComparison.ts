
import logger from '@/utils/logger';
import { generateStrategy } from './strategyGenerator';
import { AIStrategyGenerationResult } from '../types';
import { 
  ModelEvaluationMetrics, 
  recordModelComparison, 
  calculatePerformanceScore 
} from '../evaluation';

/**
 * Compare strategies from multiple AI models
 */
export const compareAIModels = async (
  promptId: string,
  modelIds?: string[]
): Promise<AIStrategyGenerationResult[]> => {
  try {
    // Import here to avoid circular dependencies
    const { availableAIModels } = await import('../models');
    
    const modelsToCompare = modelIds || availableAIModels.filter(m => m.isAvailable).map(m => m.id);
    
    logger.info(`Comparing ${modelsToCompare.length} AI models for prompt ${promptId}`);
    
    // Generate strategies in parallel
    const results = await Promise.all(
      modelsToCompare.map(modelId => generateStrategy(modelId, promptId))
    );
    
    // Create a comparison result
    const evaluations: ModelEvaluationMetrics[] = results.map(result => {
      // Convert AIStrategyGenerationResult to ModelEvaluationMetrics
      return {
        modelId: result.modelId,
        codeQuality: result.codeQualityScore,
        syntaxErrors: result.syntaxErrorCount,
        promptAdherence: result.adherenceToInstructionsScore,
        completionTime: result.generationTime,
        tokenUsage: Math.round(500 + Math.random() * 1000), // Simulated
        timestamp: result.timestamp,
        promptId,
        promptComplexity: result.promptComplexity,
        backtestPerformance: {
          sharpeRatio: 1.2 + Math.random() * 0.8,
          maxDrawdown: 5 + Math.random() * 15,
          winRate: 0.4 + Math.random() * 0.3,
          profitFactor: 1.1 + Math.random() * 0.9,
          totalTrades: 50 + Math.floor(Math.random() * 100),
          annualizedReturn: 8 + Math.random() * 15
        }
      };
    });
    
    // Calculate performance scores and find the best models
    const scores = evaluations.map(evaluation => ({
      modelId: evaluation.modelId,
      score: calculatePerformanceScore(evaluation),
      codeQuality: evaluation.codeQuality,
      backtestScore: evaluation.backtestPerformance ? evaluation.backtestPerformance.sharpeRatio * evaluation.backtestPerformance.profitFactor : 0
    }));
    
    // Find best models for different criteria
    const bestOverall = scores.sort((a, b) => b.score - a.score)[0].modelId;
    const bestForCodeQuality = scores.sort((a, b) => b.codeQuality - a.codeQuality)[0].modelId;
    const bestForBacktesting = scores.sort((a, b) => b.backtestScore - a.backtestScore)[0].modelId;
    
    // Record the comparison
    recordModelComparison({
      evaluations,
      bestOverall,
      bestForCodeQuality,
      bestForBacktesting,
      timestamp: new Date().toISOString(),
      promptId
    });
    
    return results;
  } catch (error) {
    logger.error(`Error comparing AI models:`, error);
    throw error;
  }
};

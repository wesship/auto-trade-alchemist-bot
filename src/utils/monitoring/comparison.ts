/**
 * Model comparison utilities
 */

import { ModelComparisonData, AggregatedModelPerformance } from './types';
import { getStoredModelComparisons, storeModelComparisons } from './storage';

/**
 * Record a model comparison result for AI code quality analysis
 * Used for comparing different AI models' generated trading strategies
 */
export const recordModelComparison = (comparisonData: ModelComparisonData[]): void => {
  try {
    const timestamp = new Date().toISOString();
    
    // Add timestamp to each record
    const records = comparisonData.map(data => ({
      ...data,
      timestamp
    }));
    
    // Retrieve existing comparisons
    const comparisons = getStoredModelComparisons();
    
    // Add new comparison records
    comparisons.push(...records);
    
    // Keep only last 20 comparison sets
    const uniqueTimestamps = [...new Set(comparisons.map(c => c.timestamp))];
    if (uniqueTimestamps.length > 20) {
      const timestampsToKeep = uniqueTimestamps.slice(-20);
      const filteredComparisons = comparisons.filter(c => 
        timestampsToKeep.includes(c.timestamp || '')
      );
      
      storeModelComparisons(filteredComparisons);
    } else {
      storeModelComparisons(comparisons);
    }
    
    console.info(`Recorded comparison data for ${records.length} AI models`);
    
  } catch (error) {
    console.error('Failed to record model comparison:', error);
  }
};

/**
 * Get all model comparison results
 */
export const getModelComparisons = (): ModelComparisonData[] => {
  return getStoredModelComparisons();
};

/**
 * Get aggregated performance metrics by model ID
 */
export const getAggregatedModelPerformance = (modelIds: string[]): AggregatedModelPerformance[] => {
  try {
    const comparisons = getModelComparisons();
    
    return modelIds.map(modelId => {
      const modelComparisons = comparisons.filter(c => c.modelId === modelId);
      
      if (modelComparisons.length === 0) {
        return {
          modelId,
          avgCodeQualityScore: 0,
          avgAdherenceScore: 0,
          totalSyntaxErrors: 0,
          performanceByComplexity: {
            easy: { count: 0, avgScore: 0 },
            medium: { count: 0, avgScore: 0 },
            hard: { count: 0, avgScore: 0 }
          }
        };
      }
      
      // Calculate averages and totals
      const avgCodeQualityScore = modelComparisons.reduce((sum, c) => sum + c.codeQualityScore, 0) / modelComparisons.length;
      const avgAdherenceScore = modelComparisons.reduce((sum, c) => sum + c.adherenceToInstructionsScore, 0) / modelComparisons.length;
      const totalSyntaxErrors = modelComparisons.reduce((sum, c) => sum + c.syntaxErrorCount, 0);
      
      // Group by complexity
      const easyPrompts = modelComparisons.filter(c => c.promptComplexity === 'easy');
      const mediumPrompts = modelComparisons.filter(c => c.promptComplexity === 'medium');
      const hardPrompts = modelComparisons.filter(c => c.promptComplexity === 'hard');
      
      return {
        modelId,
        avgCodeQualityScore,
        avgAdherenceScore,
        totalSyntaxErrors,
        performanceByComplexity: {
          easy: {
            count: easyPrompts.length,
            avgScore: easyPrompts.length > 0 
              ? easyPrompts.reduce((sum, c) => sum + c.codeQualityScore, 0) / easyPrompts.length
              : 0
          },
          medium: {
            count: mediumPrompts.length,
            avgScore: mediumPrompts.length > 0
              ? mediumPrompts.reduce((sum, c) => sum + c.codeQualityScore, 0) / mediumPrompts.length
              : 0
          },
          hard: {
            count: hardPrompts.length,
            avgScore: hardPrompts.length > 0
              ? hardPrompts.reduce((sum, c) => sum + c.codeQualityScore, 0) / hardPrompts.length
              : 0
          }
        }
      };
    });
    
  } catch (error) {
    console.error('Failed to calculate aggregated model performance:', error);
    return [];
  }
};

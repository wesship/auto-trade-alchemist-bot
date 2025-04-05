
import logger from '@/utils/logger';
import { StrategyFeedback } from './types';

// In-memory storage for strategy feedback
// In a real app, this would be stored in a database
const strategyFeedback: StrategyFeedback[] = [];

/**
 * Submit feedback for a strategy
 */
export const submitStrategyFeedback = (feedback: Omit<StrategyFeedback, 'timestamp'>): StrategyFeedback => {
  const newFeedback: StrategyFeedback = {
    ...feedback,
    timestamp: new Date().toISOString()
  };
  
  strategyFeedback.push(newFeedback);
  logger.info(`Recorded feedback for strategy ${feedback.strategyId} from user ${feedback.userId}`);
  
  return newFeedback;
};

/**
 * Get all feedback for a strategy
 */
export const getStrategyFeedback = (strategyId: string): StrategyFeedback[] => {
  return strategyFeedback.filter(feedback => feedback.strategyId === strategyId);
};

/**
 * Calculate average rating for a strategy
 */
export const getAverageStrategyRating = (strategyId: string): number | null => {
  const feedback = getStrategyFeedback(strategyId);
  if (feedback.length === 0) return null;
  
  const sum = feedback.reduce((total, item) => total + item.rating, 0);
  return sum / feedback.length;
};

/**
 * Get detailed feedback stats for a strategy
 */
export const getStrategyFeedbackStats = (strategyId: string): any => {
  const feedback = getStrategyFeedback(strategyId);
  if (feedback.length === 0) return null;
  
  // Calculate averages
  const avgRating = feedback.reduce((total, item) => total + item.rating, 0) / feedback.length;
  
  // Calculate distribution of ratings
  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  feedback.forEach(item => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingDistribution[item.rating as 1|2|3|4|5]++;
    }
  });
  
  // Calculate category averages
  const categories = {
    usability: feedback.filter(item => item.usability !== undefined).length > 0 
      ? feedback.reduce((total, item) => total + (item.usability || 0), 0) / 
        feedback.filter(item => item.usability !== undefined).length
      : null,
    profitability: feedback.filter(item => item.profitability !== undefined).length > 0
      ? feedback.reduce((total, item) => total + (item.profitability || 0), 0) / 
        feedback.filter(item => item.profitability !== undefined).length
      : null,
    complexity: feedback.filter(item => item.complexity !== undefined).length > 0
      ? feedback.reduce((total, item) => total + (item.complexity || 0), 0) / 
        feedback.filter(item => item.complexity !== undefined).length
      : null
  };
  
  return {
    totalFeedback: feedback.length,
    averageRating: avgRating,
    ratingDistribution,
    categories,
    latestFeedback: feedback
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  };
};

/**
 * Get overall stats for all strategy feedback
 */
export const getOverallFeedbackStats = (): any => {
  if (strategyFeedback.length === 0) return null;
  
  // Group feedback by strategy
  const strategyIds = [...new Set(strategyFeedback.map(item => item.strategyId))];
  
  const strategyStats = strategyIds.map(id => {
    const stats = getStrategyFeedbackStats(id);
    return {
      strategyId: id,
      averageRating: stats.averageRating,
      totalFeedback: stats.totalFeedback
    };
  });
  
  // Get top rated strategies
  const topRatedStrategies = [...strategyStats]
    .filter(stats => stats.totalFeedback >= 3) // Minimum feedback threshold
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);
  
  // Get strategies with most feedback
  const mostFeedbackStrategies = [...strategyStats]
    .sort((a, b) => b.totalFeedback - a.totalFeedback)
    .slice(0, 5);
  
  return {
    totalFeedbacks: strategyFeedback.length,
    uniqueStrategies: strategyIds.length,
    topRatedStrategies,
    mostFeedbackStrategies,
    averageOverallRating: strategyFeedback.reduce((total, item) => total + item.rating, 0) / strategyFeedback.length
  };
};

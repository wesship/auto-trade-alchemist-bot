
// Re-export everything from the models directory
export * from './models/modelTypes';

/**
 * Types for AI strategy generation and results
 */
export interface AIStrategyGenerationResult {
  modelId: string;
  strategyCode: string;
  promptComplexity: 'easy' | 'medium' | 'hard';
  strategyType: string;
  codeQualityScore: number;
  syntaxErrorCount: number;
  adherenceToInstructionsScore: number;
  generationTime: number;
  timestamp: string;
  version?: string;
}

/**
 * Strategy version tracking
 */
export interface StrategyVersion {
  version: string;
  strategyCode: string;
  timestamp: string;
  modelId: string;
  promptId: string;
  changes?: string;
}

/**
 * A/B testing configuration
 */
export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  modelIds: string[];
  promptId: string;
  metrics: string[];
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
}

/**
 * User feedback for a generated strategy
 */
export interface StrategyFeedback {
  strategyId: string;
  userId: string;
  rating: number;
  comments?: string;
  usability?: number;
  profitability?: number;
  complexity?: number;
  timestamp: string;
}

/**
 * Strategy generation parameters
 */
export interface StrategyGenerationParams {
  modelId: string;
  promptId: string;
  marketContext?: {
    symbol: string;
    timeframe: string;
    marketCondition?: 'bullish' | 'bearish' | 'sideways' | 'volatile';
  };
  customPromptModifiers?: string[];
  maxTokens?: number;
  temperature?: number;
}

/**
 * Strategy prompt interface
 */
export interface StrategyPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  tags?: string[];
  complexity?: 'easy' | 'medium' | 'hard';
  lastModified?: string;
  author?: string;
  version?: string;
}

/**
 * Strategy prompts organized by complexity
 */
export interface StrategyPrompts {
  easy: StrategyPrompt[];
  medium: StrategyPrompt[];
  hard: StrategyPrompt[];
}

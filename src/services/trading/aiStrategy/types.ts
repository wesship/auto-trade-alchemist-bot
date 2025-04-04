
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
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  isNew?: boolean;
}

export interface StrategyPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface StrategyPrompts {
  easy: StrategyPrompt[];
  medium: StrategyPrompt[];
  hard: StrategyPrompt[];
}

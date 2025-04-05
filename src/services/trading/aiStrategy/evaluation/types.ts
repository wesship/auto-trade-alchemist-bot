
/**
 * Types for AI model evaluation system
 */

export interface ModelEvaluationMetrics {
  modelId: string;
  codeQuality: number;
  syntaxErrors: number;
  promptAdherence: number;
  completionTime: number; // in ms
  tokenUsage: number;
  backtestPerformance?: BacktestMetrics;
  timestamp: string;
  promptId: string;
  promptComplexity: 'easy' | 'medium' | 'hard';
}

export interface BacktestMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  annualizedReturn: number;
}

export interface ModelComparisonResult {
  evaluations: ModelEvaluationMetrics[];
  bestForCodeQuality: string;
  bestForBacktesting: string;
  bestOverall: string;
  timestamp: string;
  promptId: string;
}

export interface ModelPerformanceHistory {
  modelId: string;
  evaluations: ModelEvaluationMetrics[];
  averageMetrics: {
    codeQuality: number;
    syntaxErrors: number;
    promptAdherence: number;
    completionTime: number;
    tokenUsage: number;
  };
  lastEvaluated: string;
}

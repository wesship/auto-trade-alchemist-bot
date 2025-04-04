
/**
 * Model Monitoring Types
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
  strategyType?: string;
  promptComplexity?: 'easy' | 'medium' | 'hard';
  codeQualityScore?: number;
  syntaxErrorCount?: number;
  adherenceToInstructionsScore?: number;
  backtestPerformance?: {
    sharpeRatio?: number;
    maxDrawdown?: number;
    winRate?: number;
    profitFactor?: number;
  };
}

export interface ModelPerformanceAlert {
  modelId: string;
  metricName: string;
  timestamp: string;
  currentValue: number;
  threshold: number;
  message: string;
}

export interface ModelComparisonData {
  modelId: string;
  promptComplexity: 'easy' | 'medium' | 'hard';
  strategyType: string;
  codeQualityScore: number;
  syntaxErrorCount: number;
  adherenceToInstructionsScore: number;
  timestamp?: string;
  backtestPerformance?: {
    sharpeRatio?: number;
    maxDrawdown?: number;
    winRate?: number;
    profitFactor?: number;
  };
}

export interface AggregatedModelPerformance {
  modelId: string;
  avgCodeQualityScore: number;
  avgAdherenceScore: number;
  totalSyntaxErrors: number;
  performanceByComplexity: {
    easy: { count: number; avgScore: number };
    medium: { count: number; avgScore: number };
    hard: { count: number; avgScore: number };
  };
}


/**
 * Types for AI model management
 */
export interface AIModel {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  isNew?: boolean;
  category: ModelCategory;
  capabilities: ModelCapability[];
  performanceRating?: number;
  lastEvaluated?: string;
}

export enum ModelCategory {
  GENERAL_PURPOSE = 'general',
  TECHNICAL_ANALYSIS = 'technical',
  FUNDAMENTAL_ANALYSIS = 'fundamental',
  SENTIMENT_ANALYSIS = 'sentiment',
  EXPERIMENTAL = 'experimental'
}

export enum ModelCapability {
  CODE_GENERATION = 'code',
  REASONING = 'reasoning',
  PATTERN_RECOGNITION = 'pattern',
  NATURAL_LANGUAGE = 'nlp',
  CHART_ANALYSIS = 'chart',
  BACKTESTING = 'backtest'
}

/**
 * Filter options for AI models
 */
export interface ModelFilterOptions {
  categories?: ModelCategory[];
  capabilities?: ModelCapability[];
  onlyAvailable?: boolean;
  includeNew?: boolean;
  minPerformanceRating?: number;
}

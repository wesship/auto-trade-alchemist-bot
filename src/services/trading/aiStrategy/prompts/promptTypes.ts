
/**
 * Types for strategy prompts
 */

export enum PromptCategory {
  TECHNICAL = 'technical',
  FUNDAMENTAL = 'fundamental',
  SENTIMENT = 'sentiment',
  HYBRID = 'hybrid',
  EXPERIMENTAL = 'experimental'
}

export type PromptComplexity = 'easy' | 'medium' | 'hard';

export interface PromptTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface StrategyPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: PromptCategory;
  complexity: PromptComplexity;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  version: string;
  authorId?: string;
}

export interface PromptFilterOptions {
  categories?: PromptCategory[];
  complexities?: PromptComplexity[];
  tags?: string[];
  searchQuery?: string;
}

export interface PromptVersion {
  version: string;
  prompt: string;
  updatedAt: string;
  changes: string;
}

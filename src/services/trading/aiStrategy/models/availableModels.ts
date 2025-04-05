
import { AIModel, ModelCategory, ModelCapability } from './modelTypes';

/**
 * Available AI models for strategy generation
 */
export const availableAIModels: AIModel[] = [
  { 
    id: 'deepseek-r1', 
    name: 'DeepSeek R1', 
    description: 'Advanced reasoning and instruction following', 
    isAvailable: true, 
    isNew: true,
    category: ModelCategory.GENERAL_PURPOSE,
    capabilities: [ModelCapability.REASONING, ModelCapability.CODE_GENERATION],
    performanceRating: 9.2,
    lastEvaluated: '2025-03-28'
  },
  { 
    id: 'chatgpt-o1', 
    name: 'ChatGPT-o1', 
    description: 'Versatile performance across complexity levels', 
    isAvailable: true,
    category: ModelCategory.GENERAL_PURPOSE,
    capabilities: [ModelCapability.NATURAL_LANGUAGE, ModelCapability.CODE_GENERATION],
    performanceRating: 8.7,
    lastEvaluated: '2025-03-20'
  },
  { 
    id: 'claude-3.5', 
    name: 'Claude 3.5', 
    description: 'Good for technical analysis strategies', 
    isAvailable: true,
    category: ModelCategory.TECHNICAL_ANALYSIS,
    capabilities: [ModelCapability.PATTERN_RECOGNITION, ModelCapability.CHART_ANALYSIS],
    performanceRating: 8.9,
    lastEvaluated: '2025-03-25'
  },
  { 
    id: 'horizon-ai', 
    name: 'HorizonAI', 
    description: 'Specialized for trading algorithms', 
    isAvailable: true,
    category: ModelCategory.TECHNICAL_ANALYSIS,
    capabilities: [ModelCapability.BACKTESTING, ModelCapability.CODE_GENERATION],
    performanceRating: 8.5,
    lastEvaluated: '2025-03-15'
  },
  { 
    id: 'gemini-1.5', 
    name: 'Gemini 1.5 Pro', 
    description: 'Experimental model with high variance', 
    isAvailable: false,
    category: ModelCategory.EXPERIMENTAL,
    capabilities: [ModelCapability.REASONING, ModelCapability.NATURAL_LANGUAGE],
    performanceRating: 7.8,
    lastEvaluated: '2025-03-10'
  },
  { 
    id: 'grok3', 
    name: 'Grok3 + Think', 
    description: 'Advanced reasoning model with coding focus', 
    isAvailable: true, 
    isNew: true,
    category: ModelCategory.GENERAL_PURPOSE,
    capabilities: [ModelCapability.REASONING, ModelCapability.CODE_GENERATION],
    performanceRating: 9.0,
    lastEvaluated: '2025-03-30'
  },
  {
    id: 'sentiment-expert',
    name: 'Sentiment Expert',
    description: 'Specialized in market sentiment analysis',
    isAvailable: true,
    isNew: true,
    category: ModelCategory.SENTIMENT_ANALYSIS,
    capabilities: [ModelCapability.NATURAL_LANGUAGE, ModelCapability.PATTERN_RECOGNITION],
    performanceRating: 8.8,
    lastEvaluated: '2025-04-01'
  },
  {
    id: 'fundamental-ai',
    name: 'Fundamental Analyst',
    description: 'Focused on fundamental company analysis',
    isAvailable: true,
    category: ModelCategory.FUNDAMENTAL_ANALYSIS,
    capabilities: [ModelCapability.REASONING, ModelCapability.NATURAL_LANGUAGE],
    performanceRating: 8.6,
    lastEvaluated: '2025-03-25'
  }
];

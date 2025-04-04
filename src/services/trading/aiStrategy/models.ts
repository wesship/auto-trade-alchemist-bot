
import { AIModel } from './types';

/**
 * Available AI models for strategy generation
 */
export const availableAIModels: AIModel[] = [
  { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning and instruction following', isAvailable: true, isNew: true },
  { id: 'chatgpt-o1', name: 'ChatGPT-o1', description: 'Versatile performance across complexity levels', isAvailable: true },
  { id: 'claude-3.5', name: 'Claude 3.5', description: 'Good for technical analysis strategies', isAvailable: true },
  { id: 'horizon-ai', name: 'HorizonAI', description: 'Specialized for trading algorithms', isAvailable: true },
  { id: 'gemini-1.5', name: 'Gemini 1.5 Pro', description: 'Experimental model with high variance', isAvailable: false },
  { id: 'grok3', name: 'Grok3 + Think', description: 'Advanced reasoning model with coding focus', isAvailable: true, isNew: true },
];


import { AIStrategyGenerationResult, StrategyPromptConfig } from './aiStrategy/types';
import { Asset, TradeSignal, TradeExecution } from '@/types/trading';
import { fetchMarketData } from './marketService';
import { executeTradeAction } from './tradeService';
import { generateStrategy, compareAIModels } from './aiStrategy/generation';
import { availableAIModels } from './aiStrategy/models';
import { strategyPrompts } from './aiStrategy/prompts';
import logger from '@/utils/logger';
import securityUtils from '@/utils/security';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';

// API keys for external access - in production, use an environment variable or secret manager
// This is just a simple implementation for demonstration
const API_KEYS: Record<string, { name: string, permissions: string[] }> = {
  'test-api-key-123': { name: 'Test Agent', permissions: ['read', 'write'] },
  'read-only-key-456': { name: 'Read Only Agent', permissions: ['read'] }
};

/**
 * Validates the API key from the request
 */
const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || !API_KEYS[apiKey]) {
    return false;
  }
  return true;
};

/**
 * Checks if the API key has the required permission
 */
const hasPermission = (apiKey: string, permission: 'read' | 'write'): boolean => {
  if (!validateApiKey(apiKey)) return false;
  return API_KEYS[apiKey].permissions.includes(permission);
};

/**
 * Error response helper
 */
const errorResponse = (message: string, status = 403) => {
  return {
    status,
    error: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get market data
 */
export const getMarketData = async (apiKey: string): Promise<Asset[] | { status: number, error: string, timestamp: string }> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Invalid API key used: ${apiKey || 'undefined'}`,
      'medium'
    );
    return errorResponse('Invalid API key');
  }
  
  try {
    logger.info('API: Fetching market data', { apiKey });
    const assets = await fetchMarketData();
    return assets;
  } catch (error) {
    logger.error('API: Error fetching market data', error);
    return errorResponse('Error fetching market data', 500);
  }
};

/**
 * Execute a trade
 */
export const executeTrade = async (
  apiKey: string, 
  modelId: string,
  symbol: string,
  action: 'BUY' | 'SELL',
  quantity: number
): Promise<TradeExecution | { status: number, error: string, timestamp: string }> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Invalid API key used: ${apiKey || 'undefined'}`,
      'medium'
    );
    return errorResponse('Invalid API key');
  }
  
  if (!hasPermission(apiKey, 'write')) {
    logger.warn('Insufficient permissions for trade execution', { apiKey });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `API key doesn't have write permission: ${apiKey}`,
      'medium'
    );
    return errorResponse('Insufficient permissions');
  }
  
  try {
    logger.info('API: Executing trade', { apiKey, modelId, symbol, action, quantity });
    
    // Validate inputs
    if (!modelId || !symbol || !action || quantity <= 0) {
      return errorResponse('Invalid trade parameters', 400);
    }
    
    const trade = await executeTradeAction(modelId, symbol, action, quantity);
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "API Trade Executed",
      `${action} ${quantity} ${symbol} at $${trade.price} via API (${API_KEYS[apiKey].name})`
    );
    
    return trade;
  } catch (error) {
    logger.error('API: Error executing trade', error);
    return errorResponse('Error executing trade', 500);
  }
};

/**
 * Generate a trading strategy
 */
export const generateTradingStrategy = async (
  apiKey: string,
  modelId: string,
  promptId: string
): Promise<AIStrategyGenerationResult | { status: number, error: string, timestamp: string }> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return errorResponse('Invalid API key');
  }
  
  try {
    logger.info('API: Generating trading strategy', { apiKey, modelId, promptId });
    
    // Validate model and prompt exist
    const modelExists = availableAIModels.some(model => model.id === modelId);
    let promptExists = false;
    
    for (const level of Object.keys(strategyPrompts)) {
      const prompts = strategyPrompts[level as keyof typeof strategyPrompts] as StrategyPromptConfig[];
      if (prompts.some(prompt => prompt.id === promptId)) {
        promptExists = true;
        break;
      }
    }
    
    if (!modelExists) {
      return errorResponse(`Model with ID ${modelId} not found`, 404);
    }
    
    if (!promptExists) {
      return errorResponse(`Prompt with ID ${promptId} not found`, 404);
    }
    
    const strategy = await generateStrategy(modelId, promptId);
    return strategy;
  } catch (error) {
    logger.error('API: Error generating strategy', error);
    return errorResponse('Error generating strategy', 500);
  }
};

/**
 * Compare multiple AI models for a specific prompt
 */
export const compareModels = async (
  apiKey: string,
  promptId: string,
  modelIds?: string[]
): Promise<AIStrategyGenerationResult[] | { status: number, error: string, timestamp: string }> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return errorResponse('Invalid API key');
  }
  
  try {
    logger.info('API: Comparing AI models', { apiKey, promptId, modelIds });
    
    // Validate prompt exists
    let promptExists = false;
    for (const level of Object.keys(strategyPrompts)) {
      const prompts = strategyPrompts[level as keyof typeof strategyPrompts] as StrategyPromptConfig[];
      if (prompts.some(prompt => prompt.id === promptId)) {
        promptExists = true;
        break;
      }
    }
    
    if (!promptExists) {
      return errorResponse(`Prompt with ID ${promptId} not found`, 404);
    }
    
    // If provided, validate all model IDs exist
    if (modelIds && modelIds.length > 0) {
      const invalidModels = modelIds.filter(id => 
        !availableAIModels.some(model => model.id === id)
      );
      
      if (invalidModels.length > 0) {
        return errorResponse(`The following models were not found: ${invalidModels.join(', ')}`, 404);
      }
    }
    
    const results = await compareAIModels(promptId, modelIds);
    return results;
  } catch (error) {
    logger.error('API: Error comparing models', error);
    return errorResponse('Error comparing models', 500);
  }
};

/**
 * Get available AI models
 */
export const getAvailableModels = (apiKey: string) => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return errorResponse('Invalid API key');
  }
  
  logger.info('API: Fetching available models', { apiKey });
  return availableAIModels;
};

/**
 * Get available strategy prompts
 */
export const getAvailablePrompts = (apiKey: string) => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return errorResponse('Invalid API key');
  }
  
  logger.info('API: Fetching available prompts', { apiKey });
  return strategyPrompts;
};

/**
 * Register a new API key (in a real system, this would use a more secure method)
 */
export const registerApiKey = (name: string, permissions: string[] = ['read']): string => {
  // In a real system, you would use a more secure method for generating and storing API keys
  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const segments = [8, 4, 4, 4, 12]; // Format like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    
    return segments.map(segment => {
      let result = '';
      for (let i = 0; i < segment; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }).join('-');
  };
  
  const apiKey = generateKey();
  API_KEYS[apiKey] = { name, permissions };
  
  logger.info('New API key registered', { name, permissions });
  return apiKey;
};

// Export the API service functions
export default {
  getMarketData,
  executeTrade,
  generateTradingStrategy,
  compareModels,
  getAvailableModels,
  getAvailablePrompts,
  registerApiKey
};

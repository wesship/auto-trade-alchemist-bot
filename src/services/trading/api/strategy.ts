
/**
 * Strategy API
 * Handles strategy-related requests via the API
 */

import logger from '@/utils/logger';
import { generateStrategy, compareAIModels } from '../aiStrategy/generation';
import { availableAIModels } from '../aiStrategy/models';
import { strategyPrompts } from '../aiStrategy/prompts';
import { ApiErrorResponse, ApiStrategyRequest, ApiModelComparisonRequest } from './types';
import { validateApiKey, errorResponse, handleUnauthorizedAccess } from './auth';
import { AIStrategyGenerationResult, StrategyPromptConfig } from '../aiStrategy/types';

/**
 * Generate a trading strategy
 */
export const generateTradingStrategy = async (
  apiKey: string,
  request: ApiStrategyRequest
): Promise<AIStrategyGenerationResult | ApiErrorResponse> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return handleUnauthorizedAccess(apiKey);
  }
  
  try {
    const { modelId, promptId } = request;
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
  request: ApiModelComparisonRequest
): Promise<AIStrategyGenerationResult[] | ApiErrorResponse> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return handleUnauthorizedAccess(apiKey);
  }
  
  try {
    const { promptId, modelIds } = request;
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

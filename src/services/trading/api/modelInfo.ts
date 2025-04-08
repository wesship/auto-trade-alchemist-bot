
/**
 * Model Info API
 * Handles model and prompt information requests via the API
 */

import logger from '@/utils/logger';
import { availableAIModels } from '../aiStrategy/models';
import { strategyPrompts } from '../aiStrategy/prompts';
import { ApiErrorResponse } from './types';
import { validateApiKey, errorResponse, handleUnauthorizedAccess } from './auth';

/**
 * Get available AI models
 */
export const getAvailableModels = (apiKey: string) => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return handleUnauthorizedAccess(apiKey);
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
    return handleUnauthorizedAccess(apiKey);
  }
  
  logger.info('API: Fetching available prompts', { apiKey });
  return strategyPrompts;
};

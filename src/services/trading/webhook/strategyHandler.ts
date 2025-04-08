
/**
 * Strategy Generation Webhook Handler
 * Handles strategy generation requests via webhooks
 */

import logger from '@/utils/logger';
import { generateStrategy } from '../aiStrategy/generation';
import { StrategyGenerationWebhookData, WebhookErrorResponse, WebhookSuccessResponse } from './types';
import { validateWebhookSecret, errorResponse, handleUnauthorizedAccess, getWebhookSecretName } from './auth';

/**
 * Handles a strategy generation webhook request
 */
export const handleStrategyGenerationWebhook = async (
  secret: string,
  data: StrategyGenerationWebhookData
): Promise<WebhookSuccessResponse<any> | WebhookErrorResponse> => {
  if (!validateWebhookSecret(secret)) {
    return handleUnauthorizedAccess(secret);
  }
  
  try {
    const { modelId, promptId } = data;
    const secretName = getWebhookSecretName(secret);
    logger.info('Webhook: Generating strategy', { webhook: secretName, modelId, promptId });
    
    // Validate inputs
    if (!modelId || !promptId) {
      return errorResponse('Invalid strategy generation parameters', 400);
    }
    
    const strategy = await generateStrategy(modelId, promptId);
    return {
      status: 'success',
      data: strategy,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Webhook: Error generating strategy', error);
    return errorResponse('Error generating strategy', 500);
  }
};

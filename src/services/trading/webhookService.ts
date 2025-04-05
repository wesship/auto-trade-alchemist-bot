
import { executeTradeAction } from './tradeService';
import { generateStrategy } from './aiStrategy/generation';
import { fetchMarketData } from './marketService';
import logger from '@/utils/logger';
import securityUtils from '@/utils/securityUtils';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';

// Webhook secrets for external access - in production, use an environment variable or secret manager
// This is just a simple implementation for demonstration
const WEBHOOK_SECRETS: Record<string, { name: string, permissions: string[] }> = {
  'test-webhook-secret-123': { name: 'Test Agent', permissions: ['read', 'write'] },
  'read-only-secret-456': { name: 'Read Only Agent', permissions: ['read'] }
};

/**
 * Validates the webhook secret from the request
 */
const validateWebhookSecret = (secret: string): boolean => {
  if (!secret || !WEBHOOK_SECRETS[secret]) {
    return false;
  }
  return true;
};

/**
 * Checks if the webhook secret has the required permission
 */
const hasPermission = (secret: string, permission: 'read' | 'write'): boolean => {
  if (!validateWebhookSecret(secret)) return false;
  return WEBHOOK_SECRETS[secret].permissions.includes(permission);
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
 * Handles a market data webhook request
 */
export const handleMarketDataWebhook = async (secret: string) => {
  if (!validateWebhookSecret(secret)) {
    logger.warn('Unauthorized webhook access attempt', { secret });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Invalid webhook secret used: ${secret || 'undefined'}`,
      'medium'
    );
    return errorResponse('Invalid webhook secret');
  }
  
  try {
    logger.info('Webhook: Fetching market data', { webhook: WEBHOOK_SECRETS[secret].name });
    const assets = await fetchMarketData();
    return {
      status: 'success',
      data: assets,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Webhook: Error fetching market data', error);
    return errorResponse('Error fetching market data', 500);
  }
};

/**
 * Handles a trade execution webhook request
 */
export const handleTradeWebhook = async (
  secret: string,
  data: {
    modelId: string;
    symbol: string;
    action: 'BUY' | 'SELL';
    quantity: number;
  }
) => {
  if (!validateWebhookSecret(secret)) {
    logger.warn('Unauthorized webhook access attempt', { secret });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Invalid webhook secret used: ${secret || 'undefined'}`,
      'medium'
    );
    return errorResponse('Invalid webhook secret');
  }
  
  if (!hasPermission(secret, 'write')) {
    logger.warn('Insufficient permissions for trade execution', { secret });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Webhook doesn't have write permission: ${secret}`,
      'medium'
    );
    return errorResponse('Insufficient permissions');
  }
  
  try {
    const { modelId, symbol, action, quantity } = data;
    logger.info('Webhook: Executing trade', { webhook: WEBHOOK_SECRETS[secret].name, modelId, symbol, action, quantity });
    
    // Validate inputs
    if (!modelId || !symbol || !action || quantity <= 0) {
      return errorResponse('Invalid trade parameters', 400);
    }
    
    const trade = await executeTradeAction(modelId, symbol, action, quantity);
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "Webhook Trade Executed",
      `${action} ${quantity} ${symbol} at $${trade.price} via webhook (${WEBHOOK_SECRETS[secret].name})`
    );
    
    return {
      status: 'success',
      data: trade,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Webhook: Error executing trade', error);
    return errorResponse('Error executing trade', 500);
  }
};

/**
 * Handles a strategy generation webhook request
 */
export const handleStrategyGenerationWebhook = async (
  secret: string,
  data: {
    modelId: string;
    promptId: string;
  }
) => {
  if (!validateWebhookSecret(secret)) {
    logger.warn('Unauthorized webhook access attempt', { secret });
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
      `Invalid webhook secret used: ${secret || 'undefined'}`,
      'medium'
    );
    return errorResponse('Invalid webhook secret');
  }
  
  try {
    const { modelId, promptId } = data;
    logger.info('Webhook: Generating strategy', { webhook: WEBHOOK_SECRETS[secret].name, modelId, promptId });
    
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

/**
 * Generate a new webhook secret (in a real system, this would use a more secure method)
 */
export const registerWebhookSecret = (name: string, permissions: string[] = ['read']): string => {
  // In a real system, you would use a more secure method for generating and storing webhook secrets
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  const secret = generateSecret();
  WEBHOOK_SECRETS[secret] = { name, permissions };
  
  logger.info('New webhook secret registered', { name, permissions });
  return secret;
};

// Export webhook functions
export default {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
};

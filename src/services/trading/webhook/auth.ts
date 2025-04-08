
/**
 * Webhook Authentication
 * Handles authentication and permission checks for webhook requests
 */

import logger from '@/utils/logger';
import securityUtils from '@/utils/securityUtils';
import { WebhookSecret, WebhookErrorResponse } from './types';

// Webhook secrets for external access - in production, use an environment variable or secret manager
// This is just a simple implementation for demonstration
const WEBHOOK_SECRETS: Record<string, WebhookSecret> = {
  'test-webhook-secret-123': { name: 'Test Agent', permissions: ['read', 'write'] },
  'read-only-secret-456': { name: 'Read Only Agent', permissions: ['read'] }
};

/**
 * Validates the webhook secret from the request
 */
export const validateWebhookSecret = (secret: string): boolean => {
  if (!secret || !WEBHOOK_SECRETS[secret]) {
    return false;
  }
  return true;
};

/**
 * Checks if the webhook secret has the required permission
 */
export const hasPermission = (secret: string, permission: 'read' | 'write'): boolean => {
  if (!validateWebhookSecret(secret)) return false;
  return WEBHOOK_SECRETS[secret].permissions.includes(permission);
};

/**
 * Get webhook secret name
 */
export const getWebhookSecretName = (secret: string): string | null => {
  if (!validateWebhookSecret(secret)) return null;
  return WEBHOOK_SECRETS[secret].name;
};

/**
 * Error response helper
 */
export const errorResponse = (message: string, status = 403): WebhookErrorResponse => {
  return {
    status,
    error: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle unauthorized access attempt
 */
export const handleUnauthorizedAccess = (secret: string, message: string = 'Invalid webhook secret'): WebhookErrorResponse => {
  logger.warn('Unauthorized webhook access attempt', { secret });
  securityUtils.recordSecurityEvent(
    securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
    `Invalid webhook secret used: ${secret || 'undefined'}`,
    'medium'
  );
  return errorResponse(message);
};

/**
 * Handle insufficient permissions
 */
export const handleInsufficientPermissions = (secret: string): WebhookErrorResponse => {
  logger.warn('Insufficient permissions for webhook access', { secret });
  securityUtils.recordSecurityEvent(
    securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
    `Webhook doesn't have sufficient permissions: ${secret}`,
    'medium'
  );
  return errorResponse('Insufficient permissions');
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

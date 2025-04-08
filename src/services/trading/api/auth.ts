
/**
 * API Authentication
 * Handles authentication and permission checks for API requests
 */

import logger from '@/utils/logger';
import securityUtils from '@/utils/security';
import { ApiKey, ApiErrorResponse } from './types';

// API keys for external access - in production, use an environment variable or secret manager
// This is just a simple implementation for demonstration
const API_KEYS: Record<string, ApiKey> = {
  'test-api-key-123': { name: 'Test Agent', permissions: ['read', 'write'] },
  'read-only-key-456': { name: 'Read Only Agent', permissions: ['read'] }
};

/**
 * Validates the API key from the request
 */
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || !API_KEYS[apiKey]) {
    return false;
  }
  return true;
};

/**
 * Checks if the API key has the required permission
 */
export const hasPermission = (apiKey: string, permission: 'read' | 'write'): boolean => {
  if (!validateApiKey(apiKey)) return false;
  return API_KEYS[apiKey].permissions.includes(permission);
};

/**
 * Get API key name
 */
export const getApiKeyName = (apiKey: string): string | null => {
  if (!validateApiKey(apiKey)) return null;
  return API_KEYS[apiKey].name;
};

/**
 * Error response helper
 */
export const errorResponse = (message: string, status = 403): ApiErrorResponse => {
  return {
    status,
    error: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle unauthorized access attempt
 */
export const handleUnauthorizedAccess = (apiKey: string, message: string = 'Invalid API key'): ApiErrorResponse => {
  logger.warn('Unauthorized API access attempt', { apiKey });
  securityUtils.recordSecurityEvent(
    securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
    `Invalid API key used: ${apiKey || 'undefined'}`,
    'medium'
  );
  return errorResponse(message);
};

/**
 * Handle insufficient permissions
 */
export const handleInsufficientPermissions = (apiKey: string): ApiErrorResponse => {
  logger.warn('Insufficient permissions for API access', { apiKey });
  securityUtils.recordSecurityEvent(
    securityUtils.SecurityEventType.UNAUTHORIZED_ACCESS,
    `API key doesn't have sufficient permissions: ${apiKey}`,
    'medium'
  );
  return errorResponse('Insufficient permissions');
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

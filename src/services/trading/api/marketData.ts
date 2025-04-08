
/**
 * Market Data API
 * Handles market data requests via the API
 */

import logger from '@/utils/logger';
import { fetchMarketData } from '../marketService';
import { validateApiKey, errorResponse, handleUnauthorizedAccess } from './auth';
import { Asset } from '@/types/trading';
import { ApiErrorResponse } from './types';

/**
 * Get market data
 */
export const getMarketData = async (apiKey: string): Promise<Asset[] | ApiErrorResponse> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return handleUnauthorizedAccess(apiKey);
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

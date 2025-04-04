
import { Asset } from '../../types/trading';
import { marketAssets } from '../mockData';
import logger from '@/utils/logger';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { marketDataValidator } from '@/utils/dataValidator';
import { withRetry } from './utils';

/**
 * Fetches market data
 */
export const fetchMarketData = async (): Promise<Asset[]> => {
  try {
    logger.info("Fetching market data...");
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker('market-data');
      return await circuitBreaker.execute(async () => {
        return await withRetry(() => new Promise((resolve) => {
          setTimeout(() => {
            logger.info("Market data fetched successfully");
            
            // Validate market data
            const validAssets = marketAssets.filter(asset => {
              const validationResults = marketDataValidator.validate(asset);
              if (validationResults.length > 0) {
                logger.warn(`Asset validation warnings for ${asset.symbol}`, { validationResults });
              }
              return marketDataValidator.isValid(asset);
            });
            
            resolve(validAssets);
          }, 800);
        }));
      });
    } else {
      return await withRetry(() => new Promise((resolve) => {
        setTimeout(() => {
          logger.info("Market data fetched successfully");
          resolve(marketAssets);
        }, 800);
      }));
    }
  } catch (error) {
    logger.error("Error fetching market data:", error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.HIGH,
      "Market Data Error",
      "Failed to fetch market data"
    );
    return [];
  }
};

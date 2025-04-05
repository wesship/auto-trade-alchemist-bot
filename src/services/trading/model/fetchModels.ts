
import { AITradingModel } from '../../../types/trading';
import { aiTradingModels } from '../../mockData';
import logger from '@/utils/logger';
import { withRetry } from '../utils';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { generateModelHealth } from './modelHealth';

/**
 * Fetches all AI trading models
 */
export const fetchModels = async (): Promise<AITradingModel[]> => {
  try {
    logger.info("Fetching AI models...");
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        logger.info("AI models fetched successfully");
        
        // Add health metrics to models
        const modelsWithHealth = aiTradingModels.map(model => ({
          ...model,
          health: generateModelHealth(model.config.id)
        }));
        
        resolve(modelsWithHealth);
      }, 1000);
    }));
  } catch (error) {
    logger.error("Error fetching models:", error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.MEDIUM,
      "Model Fetch Error",
      "Failed to fetch AI models"
    );
    return [];
  }
};

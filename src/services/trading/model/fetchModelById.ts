
import { AITradingModel } from '../../../types/trading';
import { aiTradingModels } from '../../mockData';
import logger from '@/utils/logger';
import { withRetry } from '../utils';
import securityUtils from '@/utils/security';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { toast } from 'sonner';
import { generateModelHealth } from './modelHealth';

/**
 * Fetches a specific AI model by ID
 */
export const fetchModelById = async (modelId: string): Promise<AITradingModel | null> => {
  try {
    if (!modelId) {
      logger.error("Invalid model ID provided");
      toast.error("Invalid model ID", {
        description: "Please provide a valid model ID",
      });
      return null;
    }
    
    // Input validation
    if (securityUtils.checkForSQLInjection(modelId) || securityUtils.checkForXSS(modelId)) {
      securityUtils.recordSecurityEvent(
        securityUtils.SecurityEventType.SUSPICIOUS_ACTIVITY,
        `Suspicious modelId provided: ${modelId}`,
        'high'
      );
      return null;
    }
    
    logger.info(`Fetching model with ID: ${modelId}`);
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        const model = aiTradingModels.find(m => m.config.id === modelId) || null;
        if (model) {
          logger.info(`Model ${modelId} fetched successfully`);
          
          // Add health metrics
          const modelWithHealth = {
            ...model,
            health: generateModelHealth(modelId)
          };
          
          resolve(modelWithHealth);
        } else {
          logger.warn(`Model ${modelId} not found`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.LOW,
            "Model Not Found",
            `The requested model ${modelId} could not be found`
          );
          resolve(null);
        }
      }, 800);
    }));
  } catch (error) {
    logger.error(`Error fetching model ${modelId}:`, error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.MEDIUM,
      "Model Fetch Error",
      `Failed to fetch model ${modelId}`
    );
    return null;
  }
};

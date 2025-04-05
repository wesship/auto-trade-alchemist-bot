
import { trainModel as mockTrainModel } from '../../mockData';
import logger from '@/utils/logger';
import { withRetry } from '../utils';
import securityUtils from '@/utils/securityUtils';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';

/**
 * Initiates training for a model
 */
export const trainModel = async (modelId: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!modelId) {
      return { success: false, message: "Invalid model ID provided" };
    }
    
    // Security validation
    if (securityUtils.checkForSQLInjection(modelId) || securityUtils.checkForXSS(modelId)) {
      securityUtils.recordSecurityEvent(
        securityUtils.SecurityEventType.SUSPICIOUS_ACTIVITY,
        `Suspicious modelId for training: ${modelId}`,
        'high'
      );
      return { success: false, message: "Invalid model ID format" };
    }
    
    logger.info(`Training model: ${modelId}`);
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker('model-training');
      const result = await circuitBreaker.execute(() => mockTrainModel(modelId));
      
      if (result.success) {
        logger.info(`Model ${modelId} training initiated successfully`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.MEDIUM,
          "Model Training Started",
          `Training initiated for model ${modelId}`
        );
      } else {
        logger.warn(`Model ${modelId} training failed: ${result.message}`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.HIGH,
          "Model Training Failed",
          result.message
        );
      }
      
      return result;
    } else {
      const result = await withRetry(() => mockTrainModel(modelId));
      
      if (result.success) {
        logger.info(`Model ${modelId} training initiated successfully`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.MEDIUM,
          "Model Training Started",
          `Training initiated for model ${modelId}`
        );
      } else {
        logger.warn(`Model ${modelId} training failed: ${result.message}`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.HIGH,
          "Model Training Failed",
          result.message
        );
      }
      
      return result;
    }
  } catch (error) {
    logger.error(`Error training model ${modelId}:`, error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.HIGH,
      "Model Training Error",
      "An unexpected error occurred during model training"
    );
    return { success: false, message: "An unexpected error occurred" };
  }
};

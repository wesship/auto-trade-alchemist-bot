
import { ModelRetrainingConfig } from '../../../types/trading';
import logger from '@/utils/logger';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { trainModel } from './trainModel';

/**
 * Configure automated retraining for a model
 */
export const configureModelRetraining = (
  modelId: string,
  schedule: 'daily' | 'weekly' | 'monthly' | 'onDemand',
  enabled: boolean = true
): void => {
  logger.info(`Configuring retraining for model ${modelId} (${schedule}, enabled=${enabled})`);
  
  const config: ModelRetrainingConfig = {
    modelId,
    schedule,
    enabled,
    trainingWindow: 90, // 90 days of data
    dataSource: 'default',
    lastTrainingDate: new Date().toISOString()
  };
  
  if (enabled && schedule !== 'onDemand') {
    scheduleModelRetraining(config);
  }
  
  notificationManager.send(
    NotificationType.MODEL_ALERT,
    NotificationPriority.LOW,
    "Retraining Configured",
    `Model ${modelId} retraining configured (${schedule}, ${enabled ? 'enabled' : 'disabled'})`
  );
};

/**
 * Schedule model retraining based on configuration
 */
export const scheduleModelRetraining = (config: ModelRetrainingConfig): void => {
  if (!config.enabled) {
    logger.info(`Automated retraining is disabled for model ${config.modelId}`);
    return;
  }
  
  logger.info(`Scheduling retraining for model ${config.modelId} (${config.schedule})`);
  
  // In a real application, this would set up actual scheduled jobs
  // For this demo, we'll simulate it with a setTimeout
  const now = new Date();
  let nextRun: Date;
  
  switch (config.schedule) {
    case 'daily':
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0); // 1 AM tomorrow
      break;
    case 'weekly':
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()), 1, 0, 0); // 1 AM next Sunday
      break;
    case 'monthly':
      nextRun = new Date(now.getFullYear(), now.getMonth() + 1, 1, 1, 0, 0); // 1 AM on the 1st of next month
      break;
    default:
      logger.warn(`Invalid schedule '${config.schedule}' for model ${config.modelId}`);
      return;
  }
  
  const delay = nextRun.getTime() - now.getTime();
  
  logger.info(`Model ${config.modelId} scheduled for retraining at ${nextRun.toISOString()}`);
  
  // This is just for demonstration - in a real app, you'd use a proper job scheduler
  setTimeout(() => {
    logger.info(`Initiating scheduled retraining for model ${config.modelId}`);
    trainModel(config.modelId)
      .then(result => {
        if (result.success) {
          logger.info(`Scheduled retraining completed for model ${config.modelId}`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.MEDIUM,
            "Scheduled Retraining Completed",
            `Model ${config.modelId} has been successfully retrained`
          );
          
          // Schedule the next run
          setTimeout(() => {
            scheduleModelRetraining({
              ...config,
              lastTrainingDate: new Date().toISOString()
            });
          }, 5000); // Just for demo purposes, schedule the next check soon
        } else {
          logger.error(`Scheduled retraining failed for model ${config.modelId}: ${result.message}`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.HIGH,
            "Scheduled Retraining Failed",
            `Model ${config.modelId} retraining failed: ${result.message}`
          );
        }
      })
      .catch(error => {
        logger.error(`Error during scheduled retraining for model ${config.modelId}:`, error);
      });
  }, Math.min(delay, 30000)); // Use a shorter delay for demo purposes (max 30 seconds)
};

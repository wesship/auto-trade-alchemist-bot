
import { AITradingModel, ModelHealth, ModelRetrainingConfig, ModelDriftStatus } from '../../types/trading';
import { aiTradingModels, trainModel as mockTrainModel } from '../mockData';
import logger from '@/utils/logger';
import { withRetry } from './utils';
import securityUtils from '@/utils/securityUtils';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';
import modelMonitoring from '@/utils/modelMonitoring';
import { toast } from 'sonner';

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

/**
 * Generate sample model health data
 */
const generateModelHealth = (modelId: string): ModelHealth => {
  // In a real application, this would be based on actual metrics
  return {
    accuracy: 0.75 + (Math.random() * 0.2 - 0.1), // 65-85% accuracy
    drift: Math.random() > 0.8 ? ModelDriftStatus.WARNING : ModelDriftStatus.NORMAL,
    lastEvaluationDate: new Date().toISOString(),
    trainingStatus: Math.random() > 0.7 ? 'NEEDS_TRAINING' : 'READY',
    errorRate: Math.random() * 0.15, // 0-15% error rate
    latency: 100 + Math.random() * 200 // 100-300ms latency
  };
};

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

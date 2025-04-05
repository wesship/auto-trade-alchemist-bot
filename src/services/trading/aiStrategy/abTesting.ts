
import logger from '@/utils/logger';
import { ABTestConfig, StrategyGenerationParams, AIStrategyGenerationResult } from './types';
import { compareAIModels } from './generation';
import { notifyUser } from '@/utils/notificationManager';

// In-memory storage for A/B tests
// In a real app, this would be stored in a database
const abTests: ABTestConfig[] = [];
const abTestResults: Record<string, any> = {};

/**
 * Create a new A/B test
 */
export const createABTest = (config: Omit<ABTestConfig, 'id' | 'status'>): ABTestConfig => {
  const id = `abtest-${Date.now()}`;
  const newTest: ABTestConfig = {
    ...config,
    id,
    status: 'scheduled'
  };
  
  abTests.push(newTest);
  logger.info(`Created new A/B test: ${id}`);
  
  return newTest;
};

/**
 * Get all A/B tests
 */
export const getAllABTests = (): ABTestConfig[] => {
  return [...abTests];
};

/**
 * Get a specific A/B test by ID
 */
export const getABTest = (id: string): ABTestConfig | undefined => {
  return abTests.find(test => test.id === id);
};

/**
 * Start an A/B test
 */
export const startABTest = async (id: string): Promise<void> => {
  const test = getABTest(id);
  if (!test) {
    throw new Error(`A/B test with ID ${id} not found`);
  }
  
  if (test.status !== 'scheduled') {
    throw new Error(`A/B test ${id} is already ${test.status}`);
  }
  
  // Update status
  test.status = 'running';
  logger.info(`Starting A/B test: ${id}`);
  
  try {
    // Run the comparison
    const results = await compareAIModels(test.promptId, test.modelIds);
    
    // Store results
    abTestResults[id] = {
      timestamp: new Date().toISOString(),
      results,
      test
    };
    
    // Mark as completed
    test.status = 'completed';
    test.endDate = new Date().toISOString();
    
    logger.info(`A/B test ${id} completed successfully`);
    notifyUser('A/B Test Completed', `Test ${test.name} has completed successfully`, 'success');
  } catch (error) {
    logger.error(`Error running A/B test ${id}:`, error);
    test.status = 'cancelled';
    notifyUser('A/B Test Failed', `Test ${test.name} failed to complete`, 'error');
  }
};

/**
 * Get results for an A/B test
 */
export const getABTestResults = (id: string): any => {
  return abTestResults[id] || null;
};

/**
 * Cancel an A/B test
 */
export const cancelABTest = (id: string): void => {
  const test = getABTest(id);
  if (!test) {
    throw new Error(`A/B test with ID ${id} not found`);
  }
  
  if (test.status !== 'scheduled' && test.status !== 'running') {
    throw new Error(`A/B test ${id} cannot be cancelled in ${test.status} state`);
  }
  
  test.status = 'cancelled';
  logger.info(`Cancelled A/B test: ${id}`);
};

/**
 * Schedule an A/B test to run at a specific time
 */
export const scheduleABTest = (
  config: Omit<ABTestConfig, 'id' | 'status'>, 
  scheduleTime: Date
): ABTestConfig => {
  const test = createABTest(config);
  
  // Schedule test to run at the specified time
  const now = new Date();
  const delay = scheduleTime.getTime() - now.getTime();
  
  if (delay <= 0) {
    // If time is in the past, run immediately
    startABTest(test.id).catch(error => {
      logger.error(`Failed to run scheduled A/B test ${test.id}:`, error);
    });
  } else {
    // Schedule for future
    setTimeout(() => {
      startABTest(test.id).catch(error => {
        logger.error(`Failed to run scheduled A/B test ${test.id}:`, error);
      });
    }, delay);
    
    logger.info(`Scheduled A/B test ${test.id} to run in ${Math.floor(delay / 1000 / 60)} minutes`);
  }
  
  return test;
};

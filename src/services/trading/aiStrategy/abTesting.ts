
// AB Testing implementation for AI models
import logger from '@/utils/logger';
import { toast } from "sonner";
import { withRetry } from '../utils';
import { ABTestConfig } from './types';
import { generateStrategy } from './generation';
import { recordModelComparison } from './evaluation';

// Store active A/B tests 
const activeTests: ABTestConfig[] = [];
const completedTests: ABTestConfig[] = [];

/**
 * Create a new A/B test configuration
 */
export const createABTest = (config: Omit<ABTestConfig, 'status'>): ABTestConfig => {
  const newTest: ABTestConfig = {
    ...config,
    status: 'scheduled'
  };
  
  activeTests.push(newTest);
  logger.info(`Created new A/B test: ${newTest.name}`, newTest);
  
  return newTest;
};

/**
 * Start an A/B test
 */
export const startABTest = async (testId: string): Promise<void> => {
  const test = activeTests.find(t => t.id === testId);
  
  if (!test) {
    throw new Error(`A/B test with ID ${testId} not found`);
  }
  
  if (test.status !== 'scheduled') {
    throw new Error(`A/B test with ID ${testId} is already ${test.status}`);
  }
  
  try {
    // Update status
    test.status = 'running';
    logger.info(`Starting A/B test: ${test.name}`);
    
    // Compare all models in the test
    await withRetry(() => Promise.all(
      test.modelIds.map(modelId => generateStrategy(modelId, test.promptId))
    ));
    
    // Update status to completed
    test.status = 'completed';
    test.endDate = new Date().toISOString();
    
    // Move to completed tests
    const index = activeTests.findIndex(t => t.id === testId);
    if (index > -1) {
      const removedTest = activeTests.splice(index, 1)[0];
      completedTests.push(removedTest);
    }
    
    // Notify completion
    toast.success(`A/B test "${test.name}" has completed.`);
    logger.info(`Completed A/B test: ${test.name}`);
  } catch (error) {
    // Update status to error
    test.status = 'cancelled';
    logger.error(`Error in A/B test: ${test.name}`, error);
    toast.error(`A/B test "${test.name}" has failed.`);
    throw error;
  }
};

/**
 * Get an A/B test by ID
 */
export const getABTest = (testId: string): ABTestConfig | undefined => {
  return [...activeTests, ...completedTests].find(t => t.id === testId);
};

/**
 * Get all active A/B tests
 */
export const getActiveABTests = (): ABTestConfig[] => {
  return [...activeTests];
};

/**
 * Get all completed A/B tests
 */
export const getCompletedABTests = (): ABTestConfig[] => {
  return [...completedTests];
};

/**
 * Cancel an A/B test
 */
export const cancelABTest = (testId: string): boolean => {
  const index = activeTests.findIndex(t => t.id === testId);
  
  if (index === -1) {
    return false;
  }
  
  const test = activeTests[index];
  
  if (test.status === 'running') {
    // If test is running, just mark as cancelled
    test.status = 'cancelled';
    test.endDate = new Date().toISOString();
    logger.info(`Cancelled running A/B test: ${test.name}`);
  } else if (test.status === 'scheduled') {
    // If test is scheduled, remove it from active tests
    activeTests.splice(index, 1);
    completedTests.push({
      ...test,
      status: 'cancelled',
      endDate: new Date().toISOString()
    });
    logger.info(`Cancelled scheduled A/B test: ${test.name}`);
  }
  
  toast.info(`A/B test "${test.name}" has been cancelled.`);
  return true;
};

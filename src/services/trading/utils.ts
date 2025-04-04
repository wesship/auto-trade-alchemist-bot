
import logger from '@/utils/logger';

// Maximum number of API call retries
const MAX_RETRIES = 3;

/**
 * Retry a function with exponential backoff
 */
export const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    const delay = 1000 * Math.pow(2, MAX_RETRIES - retries); // Exponential backoff
    logger.warn(`Retrying after ${delay}ms, ${retries} retries left`, { error, retries });
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(withRetry(fn, retries - 1));
      }, delay);
    });
  }
};

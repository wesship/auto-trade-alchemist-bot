
/**
 * API Service
 * Main export file for API functionality
 */

import { registerApiKey } from './auth';
import { getMarketData } from './marketData';
import { executeTrade } from './trade';
import { generateTradingStrategy, compareModels } from './strategy';
import { getAvailableModels, getAvailablePrompts } from './modelInfo';

// Export all API functions
export {
  getMarketData,
  executeTrade,
  generateTradingStrategy,
  compareModels,
  getAvailableModels,
  getAvailablePrompts,
  registerApiKey
};

// Export default object with all API utilities
export default {
  getMarketData,
  executeTrade,
  generateTradingStrategy,
  compareModels,
  getAvailableModels,
  getAvailablePrompts,
  registerApiKey
};


import { MarketDataValidator } from './validator';
import { 
  createPriceRule, 
  createVolumeRule, 
  createSymbolRule, 
  createTimestampRule 
} from './rules/marketRules';

/**
 * Create default market data validator with common rules
 */
export const createMarketDataValidator = (): MarketDataValidator => {
  const validator = new MarketDataValidator();
  
  // Add price validation rule
  validator.addRule(createPriceRule());
  
  // Add volume validation rule
  validator.addRule(createVolumeRule());
  
  // Add symbol validation rule
  validator.addRule(createSymbolRule());
  
  // Add timestamp validation rule
  validator.addRule(createTimestampRule());
  
  return validator;
};

// Default validator instance
export const marketDataValidator = createMarketDataValidator();

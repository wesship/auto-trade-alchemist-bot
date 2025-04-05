
import { MarketDataValidator } from './validator';
import { 
  createModelIdRule, 
  createModelNameRule, 
  createModelAccuracyRule 
} from './rules/modelRules';

/**
 * Create a model data validator
 */
export const createModelValidator = (): MarketDataValidator => {
  const validator = new MarketDataValidator();
  
  // Add model config validation rules
  validator.addRule(createModelIdRule());
  validator.addRule(createModelNameRule());
  validator.addRule(createModelAccuracyRule());
  
  return validator;
};

// Default model validator instance
export const modelValidator = createModelValidator();

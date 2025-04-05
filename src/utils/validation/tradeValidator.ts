
import { ValidationLevel, ValidationResult } from './types';

/**
 * Validate a trade execution
 */
export const validateTradeExecution = (
  symbol: string,
  action: string,
  quantity: number,
  price?: number
): ValidationResult[] => {
  const results: ValidationResult[] = [];
  
  // Validate symbol
  if (!symbol || typeof symbol !== 'string' || symbol.length === 0) {
    results.push({
      isValid: false,
      level: ValidationLevel.ERROR,
      message: 'Symbol must be a non-empty string'
    });
  }
  
  // Validate action
  if (!action || (action !== 'BUY' && action !== 'SELL')) {
    results.push({
      isValid: false,
      level: ValidationLevel.ERROR,
      message: "Action must be either 'BUY' or 'SELL'"
    });
  }
  
  // Validate quantity
  if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
    results.push({
      isValid: false,
      level: ValidationLevel.ERROR,
      message: 'Quantity must be a positive integer'
    });
  }
  
  // Validate price if provided
  if (price !== undefined && (isNaN(price) || price <= 0)) {
    results.push({
      isValid: false,
      level: ValidationLevel.ERROR,
      message: 'Price must be a positive number'
    });
  }
  
  return results;
};

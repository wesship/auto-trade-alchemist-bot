
/**
 * Data Validation Pipeline
 * 
 * This utility provides a robust data validation system for market data
 * and trading operations.
 */

// Types of validation
export enum ValidationLevel {
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export interface ValidationResult {
  isValid: boolean;
  level: ValidationLevel;
  message: string;
}

export interface ValidationRule<T> {
  name: string;
  validate: (data: T) => ValidationResult;
  level: ValidationLevel;
}

/**
 * Basic validator for market data
 */
export class MarketDataValidator {
  private rules: ValidationRule<any>[] = [];
  
  /**
   * Add a validation rule
   */
  public addRule<T>(rule: ValidationRule<T>): void {
    this.rules.push(rule);
  }
  
  /**
   * Validate data against all rules
   */
  public validate<T>(data: T): ValidationResult[] {
    return this.rules.map(rule => {
      try {
        return rule.validate(data);
      } catch (error) {
        return {
          isValid: false,
          level: ValidationLevel.ERROR,
          message: `Validation rule '${rule.name}' failed with exception: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }).filter(result => !result.isValid);
  }
  
  /**
   * Check if data passes all validation rules
   */
  public isValid<T>(data: T): boolean {
    const errors = this.validate(data).filter(result => result.level === ValidationLevel.ERROR);
    return errors.length === 0;
  }
}

// Create default market data validator with common rules
export const createMarketDataValidator = (): MarketDataValidator => {
  const validator = new MarketDataValidator();
  
  // Add price validation rule
  validator.addRule({
    name: 'price-range',
    level: ValidationLevel.ERROR,
    validate: (data: any) => {
      const price = parseFloat(data?.price);
      const isValid = !isNaN(price) && price > 0 && price < 1000000;
      return {
        isValid,
        level: ValidationLevel.ERROR,
        message: 'Asset price must be a positive number less than 1,000,000'
      };
    }
  });
  
  // Add volume validation rule
  validator.addRule({
    name: 'volume-range',
    level: ValidationLevel.ERROR,
    validate: (data: any) => {
      const volume = parseFloat(data?.volume);
      const isValid = !isNaN(volume) && volume >= 0;
      return {
        isValid,
        level: ValidationLevel.ERROR,
        message: 'Trading volume must be a non-negative number'
      };
    }
  });
  
  // Add symbol validation rule
  validator.addRule({
    name: 'symbol-format',
    level: ValidationLevel.ERROR,
    validate: (data: any) => {
      const symbol = data?.symbol;
      const isValid = typeof symbol === 'string' && symbol.length > 0 && symbol.length <= 10;
      return {
        isValid,
        level: ValidationLevel.ERROR,
        message: 'Symbol must be a non-empty string with 10 or fewer characters'
      };
    }
  });
  
  // Add timestamp validation rule
  validator.addRule({
    name: 'timestamp-valid',
    level: ValidationLevel.WARNING,
    validate: (data: any) => {
      const timestamp = data?.timestamp;
      const isValid = timestamp && !isNaN(Date.parse(timestamp));
      return {
        isValid,
        level: ValidationLevel.WARNING,
        message: 'Timestamp must be a valid date string'
      };
    }
  });
  
  return validator;
};

// Default validator instance
export const marketDataValidator = createMarketDataValidator();

/**
 * Create a model data validator
 */
export const createModelValidator = (): MarketDataValidator => {
  const validator = new MarketDataValidator();
  
  // Add model config validation rules
  validator.addRule({
    name: 'model-id',
    level: ValidationLevel.ERROR,
    validate: (data: any) => {
      const id = data?.config?.id;
      const isValid = typeof id === 'string' && id.length > 0;
      return {
        isValid,
        level: ValidationLevel.ERROR,
        message: 'Model ID must be a non-empty string'
      };
    }
  });
  
  validator.addRule({
    name: 'model-name',
    level: ValidationLevel.ERROR,
    validate: (data: any) => {
      const name = data?.config?.name;
      const isValid = typeof name === 'string' && name.length > 0;
      return {
        isValid,
        level: ValidationLevel.ERROR,
        message: 'Model name must be a non-empty string'
      };
    }
  });
  
  validator.addRule({
    name: 'model-accuracy',
    level: ValidationLevel.WARNING,
    validate: (data: any) => {
      const accuracy = parseFloat(data?.config?.accuracy);
      const isValid = !isNaN(accuracy) && accuracy >= 0 && accuracy <= 1;
      return {
        isValid,
        level: ValidationLevel.WARNING,
        message: 'Model accuracy should be a number between 0 and 1'
      };
    }
  });
  
  return validator;
};

// Default model validator instance
export const modelValidator = createModelValidator();

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

export default {
  MarketDataValidator,
  createMarketDataValidator,
  createModelValidator,
  validateTradeExecution,
  marketDataValidator,
  modelValidator
};

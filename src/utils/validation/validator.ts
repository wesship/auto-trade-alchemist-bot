
import { ValidationLevel, ValidationResult, ValidationRule } from './types';

/**
 * Base validator class for market data
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


// Types for data validation

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

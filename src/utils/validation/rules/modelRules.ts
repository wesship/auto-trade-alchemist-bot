
import { ValidationLevel, ValidationRule } from '../types';

/**
 * Model validation rules
 */
export const createModelIdRule = (): ValidationRule<any> => ({
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

export const createModelNameRule = (): ValidationRule<any> => ({
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

export const createModelAccuracyRule = (): ValidationRule<any> => ({
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

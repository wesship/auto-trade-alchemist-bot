
import { ValidationLevel, ValidationRule } from '../types';

/**
 * Market data validation rules
 */
export const createPriceRule = (): ValidationRule<any> => ({
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

export const createVolumeRule = (): ValidationRule<any> => ({
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

export const createSymbolRule = (): ValidationRule<any> => ({
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

export const createTimestampRule = (): ValidationRule<any> => ({
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

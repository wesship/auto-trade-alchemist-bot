
/**
 * Input Validation
 * Utilities for validating and sanitizing user input
 */

import { recordSecurityEvent } from "./events";
import { SecurityEventType } from "./types";

/**
 * Validate input to prevent injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters 
  // This is a basic implementation - in a real app you'd want more robust sanitization
  return input
    .replace(/[<>&"']/g, '')  // Remove HTML/script characters
    .trim();
};

/**
 * Validate a trading symbol 
 */
export const validateSymbol = (symbol: string): boolean => {
  if (!symbol) return false;
  
  // Only allow alphanumeric characters, -, . and $ in stock symbols
  const validPattern = /^[A-Z0-9\-\.$]{1,20}$/i;
  const isValid = validPattern.test(symbol);
  
  if (!isValid) {
    recordSecurityEvent(
      SecurityEventType.INVALID_INPUT,
      `Invalid symbol format: ${symbol}`,
      'medium'
    );
  }
  
  return isValid;
};

/**
 * Validate quantity to prevent unreasonable values
 */
export const validateQuantity = (quantity: number): boolean => {
  const isValid = Number.isInteger(quantity) && quantity > 0 && quantity <= 1000000;
  
  if (!isValid) {
    recordSecurityEvent(
      SecurityEventType.INVALID_INPUT,
      `Invalid trade quantity: ${quantity}`,
      'medium'
    );
  }
  
  return isValid;
};

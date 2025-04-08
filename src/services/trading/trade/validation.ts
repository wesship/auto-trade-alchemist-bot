
import { validateTradeExecution } from '@/utils/validation';
import securityUtils from '@/utils/security';
import logger from '@/utils/logger';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';

/**
 * Validate trade parameters
 */
export const validateTrade = (
  modelId: string,
  symbol: string,
  action: 'BUY' | 'SELL',
  quantity: number
): { valid: boolean; errorMessage?: string } => {
  // Input validation using the data validation pipeline
  const validationResults = validateTradeExecution(symbol, action, quantity);
  if (validationResults.length > 0) {
    const errorMessage = validationResults.map(r => r.message).join('; ');
    logger.error(`Trade validation failed: ${errorMessage}`, { modelId, symbol, action, quantity });
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "Trade Validation Failed",
      errorMessage
    );
    return { valid: false, errorMessage };
  }
  
  // Security validation
  if (!securityUtils.validateSymbol(symbol) || !securityUtils.validateQuantity(quantity)) {
    const errorMessage = "Invalid trade parameters";
    logger.error(errorMessage, { modelId, symbol, action, quantity });
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "Trade Validation Failed",
      errorMessage
    );
    return { valid: false, errorMessage };
  }
  
  return { valid: true };
};

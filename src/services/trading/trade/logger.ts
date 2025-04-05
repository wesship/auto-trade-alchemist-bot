import { TradeLog } from '@/types';
import logger from '@/utils/logger';

// Trading logs for audit purposes
const tradeLogs: TradeLog[] = [];

/**
 * Record a trade log
 */
export const recordTradeLog = (
  modelId: string,
  action: 'BUY' | 'SELL',
  symbol: string,
  quantity: number,
  price: number,
  executed: boolean,
  error?: string
): void => {
  const tradeLog: TradeLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    modelId,
    action,
    symbol,
    timestamp: new Date().toISOString(),
    quantity,
    price,
    executed,
    error
  };
  
  tradeLogs.push(tradeLog);
  
  // Keep trade logs at a reasonable size
  if (tradeLogs.length > 1000) {
    tradeLogs.shift();
  }

  // Log the trade
  logger.trade(`${action} ${quantity} ${symbol} at $${price}`, { modelId, executed });
};

/**
 * Get trade logs for auditing
 */
export const getTradeLogs = (): TradeLog[] => {
  return [...tradeLogs];
};

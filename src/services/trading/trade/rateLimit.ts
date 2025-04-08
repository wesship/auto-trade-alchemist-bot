
import logger from '@/utils/logger';
import securityUtils from '@/utils/security';

// Maximum trades per symbol per minute
const MAX_TRADES_PER_MINUTE = 5;
// Tracking recent trade executions to implement rate limiting
const recentTradeExecutions: { timestamp: number; symbol: string }[] = [];

/**
 * Check if we're exceeding rate limits for a symbol
 */
export const checkRateLimit = (symbol: string): boolean => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Clean up old executions
  while (recentTradeExecutions.length > 0 && recentTradeExecutions[0].timestamp < oneMinuteAgo) {
    recentTradeExecutions.shift();
  }
  
  // Count recent trades for this symbol
  const recentTradesForSymbol = recentTradeExecutions.filter(
    execution => execution.symbol === symbol
  ).length;
  
  if (recentTradesForSymbol >= MAX_TRADES_PER_MINUTE) {
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded for symbol: ${symbol}`,
      'medium'
    );
    return false;
  }
  
  return true;
};

/**
 * Record a trade execution for rate limiting
 */
export const recordTradeExecution = (symbol: string): void => {
  recentTradeExecutions.push({
    timestamp: Date.now(),
    symbol
  });
};

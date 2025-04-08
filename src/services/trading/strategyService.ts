
import { marketAssets } from '../mockData';
import logger from '@/utils/logger';
import securityUtils from '@/utils/security';
import { withRetry } from './utils';

/**
 * Generate trading strategies based on asset and timeframe
 */
export const getTradeStrategy = async (
  symbol: string,
  timeframe: string,
  strategyType: string
): Promise<any[]> => {
  try {
    if (!symbol) {
      logger.error("Invalid symbol for strategy generation");
      return [];
    }
    
    // Security validation
    if (!securityUtils.validateSymbol(symbol)) {
      return [];
    }
    
    logger.info(`Generating trading strategies for ${symbol} on ${timeframe} timeframe with ${strategyType} approach`);
    
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        const asset = marketAssets.find(a => a.symbol === symbol);
        if (!asset) {
          logger.error(`Asset with symbol ${symbol} not found`);
          resolve([]);
          return;
        }
        
        const basePrice = asset.price;
        const strategies = [];
        const isBullish = Math.random() > 0.4; // Slightly biased toward bullish
        
        // Strategy 1: Trend-following
        if (strategyType === 'momentum' || strategyType === 'balanced' || strategyType === 'aggressive') {
          const direction = isBullish ? 'BUY' : 'SELL';
          const priceChange = (isBullish ? 1 : -1) * (Math.random() * 0.1 + 0.05); // 5-15%
          const targetPrice = basePrice * (1 + priceChange);
          const stopLoss = basePrice * (1 - (priceChange * 0.5 * (isBullish ? 1 : -1)));
          
          strategies.push({
            name: "Trend Following Strategy",
            type: strategyType,
            direction,
            description: `${direction} ${symbol} based on strong ${isBullish ? 'upward' : 'downward'} momentum and technical indicators.`,
            confidence: Math.round(65 + Math.random() * 20),
            entryPrice: basePrice,
            targetPrice: parseFloat(targetPrice.toFixed(2)),
            stopLoss: parseFloat(stopLoss.toFixed(2)),
            timeframe,
            potentialReturn: parseFloat((priceChange * 100).toFixed(2)),
            riskRewardRatio: parseFloat((Math.abs(priceChange) / (Math.abs(basePrice - stopLoss) / basePrice)).toFixed(2))
          });
        }
        
        // Strategy 2: Counter-trend
        if (strategyType === 'contrarian' || strategyType === 'balanced') {
          const direction = isBullish ? 'SELL' : 'BUY';
          const priceChange = (isBullish ? -1 : 1) * (Math.random() * 0.08 + 0.03); // 3-11%
          const targetPrice = basePrice * (1 + priceChange);
          const stopLoss = basePrice * (1 - (priceChange * 0.6 * (isBullish ? -1 : 1)));
          
          strategies.push({
            name: "Counter-Trend Strategy",
            type: "contrarian",
            direction,
            description: `${direction} ${symbol} based on overbought/oversold conditions and potential trend reversal.`,
            confidence: Math.round(55 + Math.random() * 20),
            entryPrice: basePrice,
            targetPrice: parseFloat(targetPrice.toFixed(2)),
            stopLoss: parseFloat(stopLoss.toFixed(2)),
            timeframe,
            potentialReturn: parseFloat((priceChange * 100).toFixed(2)),
            riskRewardRatio: parseFloat((Math.abs(priceChange) / (Math.abs(basePrice - stopLoss) / basePrice)).toFixed(2))
          });
        }
        
        // Strategy 3: Breakout
        if (strategyType === 'aggressive' || strategyType === 'momentum') {
          const direction = 'BUY';
          const priceChange = Math.random() * 0.15 + 0.08; // 8-23%
          const targetPrice = basePrice * (1 + priceChange);
          const stopLoss = basePrice * 0.95; // 5% stop loss
          
          strategies.push({
            name: "Breakout Strategy",
            type: "aggressive",
            direction,
            description: `${direction} ${symbol} on breakout above resistance level with increased volume.`,
            confidence: Math.round(60 + Math.random() * 25),
            entryPrice: basePrice,
            targetPrice: parseFloat(targetPrice.toFixed(2)),
            stopLoss: parseFloat(stopLoss.toFixed(2)),
            timeframe,
            potentialReturn: parseFloat((priceChange * 100).toFixed(2)),
            riskRewardRatio: parseFloat((priceChange / 0.05).toFixed(2))
          });
        }
        
        // Strategy 4: Range-bound
        if (strategyType === 'conservative' || strategyType === 'balanced') {
          const upperBound = basePrice * (1 + (Math.random() * 0.05 + 0.02));
          const lowerBound = basePrice * (1 - (Math.random() * 0.05 + 0.02));
          const direction = Math.random() > 0.5 ? 'BUY' : 'SELL';
          const entryPrice = direction === 'BUY' ? lowerBound : upperBound;
          const targetPrice = direction === 'BUY' ? upperBound : lowerBound;
          const stopLoss = direction === 'BUY' 
            ? lowerBound * 0.98 
            : upperBound * 1.02;
          const potentialReturn = direction === 'BUY'
            ? ((upperBound - lowerBound) / lowerBound) * 100
            : ((upperBound - lowerBound) / upperBound) * 100;
          
          strategies.push({
            name: "Range Trading Strategy",
            type: "conservative",
            direction,
            description: `${direction} ${symbol} at range ${direction === 'BUY' ? 'support' : 'resistance'} levels with tight stop loss.`,
            confidence: Math.round(70 + Math.random() * 15),
            entryPrice: parseFloat(entryPrice.toFixed(2)),
            targetPrice: parseFloat(targetPrice.toFixed(2)),
            stopLoss: parseFloat(stopLoss.toFixed(2)),
            timeframe,
            potentialReturn: parseFloat(potentialReturn.toFixed(2)),
            riskRewardRatio: parseFloat(((Math.abs(targetPrice - entryPrice) / Math.abs(entryPrice - stopLoss))).toFixed(2))
          });
        }
        
        // Strategy 5: Hedging strategy
        if (strategyType === 'conservative') {
          const direction = 'BUY';
          const priceChange = Math.random() * 0.04 + 0.02; // 2-6%
          const targetPrice = basePrice * (1 + priceChange);
          const stopLoss = basePrice * 0.97; // 3% stop loss
          
          strategies.push({
            name: "Hedged Position Strategy",
            type: "conservative",
            direction,
            description: `Limited exposure ${direction} position on ${symbol} with additional hedge to minimize downside risk.`,
            confidence: Math.round(75 + Math.random() * 15),
            entryPrice: basePrice,
            targetPrice: parseFloat(targetPrice.toFixed(2)),
            stopLoss: parseFloat(stopLoss.toFixed(2)),
            timeframe,
            potentialReturn: parseFloat((priceChange * 100).toFixed(2)),
            riskRewardRatio: parseFloat((priceChange / 0.03).toFixed(2))
          });
        }
        
        // Log the generation of strategies
        logger.info(`Generated ${strategies.length} trading strategies for ${symbol}`);
        
        // Filter strategies by type if needed
        let filteredStrategies = strategies;
        if (strategyType !== 'balanced') {
          filteredStrategies = strategies.filter(s => 
            s.type === strategyType || 
            (strategyType === 'aggressive' && s.type === 'momentum') ||
            (strategyType === 'momentum' && s.type === 'aggressive')
          );
        }
        
        resolve(filteredStrategies);
      }, 1200);
    }));
  } catch (error) {
    logger.error(`Error generating trading strategies:`, error);
    return [];
  }
};


import { StrategyPrompts } from '../types';

/**
 * Base strategy prompts organized by complexity level
 */
export const strategyPrompts: StrategyPrompts = {
  easy: [
    {
      id: 'simple-ma-cross',
      name: 'Simple Moving Average Crossover',
      description: 'Basic strategy using two moving averages',
      prompt: `Create a Pine Script strategy using a simple moving average crossover system.
      Use a fast MA (10 periods) and a slow MA (30 periods).
      Buy when fast crosses above slow, sell when fast crosses below slow.
      Include appropriate risk management.`,
      tags: ['moving-average', 'crossover', 'trend', 'beginner'],
      complexity: 'easy',
      lastModified: '2025-03-01',
      version: '1.0'
    },
    {
      id: 'rsi-basic',
      name: 'Basic RSI Strategy',
      description: 'Simple strategy based on RSI overbought/oversold conditions',
      prompt: `Create a Pine Script strategy that trades based on RSI (Relative Strength Index).
      Use a 14-period RSI.
      Buy when RSI crosses above 30 (oversold), sell when RSI crosses below 70 (overbought).
      Include appropriate position sizing and risk management.`,
      tags: ['rsi', 'oscillator', 'overbought', 'oversold', 'beginner'],
      complexity: 'easy',
      lastModified: '2025-03-02',
      version: '1.0'
    }
  ],
  
  medium: [
    {
      id: 'macd-stoch',
      name: 'MACD with Stochastic Filter',
      description: 'Strategy combining MACD with Stochastic as a filter',
      prompt: `Create a Pine Script strategy that uses MACD as the primary signal and Stochastic as a filter.
      Use standard MACD settings (12, 26, 9) and Stochastic (14, 3, 3).
      Buy when MACD histogram turns positive AND Stochastic K line is below 20 and rising.
      Sell when MACD histogram turns negative AND Stochastic K line is above 80 and falling.
      Include risk management with a 2% risk per trade.`,
      tags: ['macd', 'stochastic', 'filter', 'intermediate'],
      complexity: 'medium',
      lastModified: '2025-03-05',
      version: '1.0'
    },
    {
      id: 'bollinger-breakout',
      name: 'Bollinger Band Breakout',
      description: 'Strategy based on price breakouts from Bollinger Bands',
      prompt: `Create a Pine Script strategy that trades breakouts from Bollinger Bands.
      Use 20-period Bollinger Bands with 2 standard deviations.
      Buy when price closes above the upper band after being inside the bands.
      Sell when price closes below the lower band after being inside the bands.
      Use a trailing stop of 1.5 ATR (14).
      Implement a volatility filter to avoid trading when ATR is below its 20-period average.`,
      tags: ['bollinger', 'breakout', 'volatility', 'intermediate'],
      complexity: 'medium',
      lastModified: '2025-03-07',
      version: '1.0'
    }
  ],
  
  hard: [
    {
      id: 'adaptive-rsi-channels',
      name: 'Adaptive RSI with Volatility Channels',
      description: 'Advanced strategy that adapts RSI parameters based on market volatility',
      prompt: `Create a Pine Script strategy that uses an adaptive RSI system with volatility-based channels.
      Calculate market volatility using ATR (14) relative to its 100-period average.
      Dynamically adjust RSI period (between 7-21) based on current volatility.
      Generate dynamic overbought/oversold thresholds using Bollinger Bands (2 stdev) on the RSI.
      Buy when RSI crosses above its lower Bollinger Band during low-medium volatility periods.
      Sell when RSI crosses below its upper Bollinger Band during medium-high volatility periods.
      Implement position sizing based on current volatility (larger size in lower volatility).
      Use a time-based filter to avoid trading during the first and last 30 minutes of the session.`,
      tags: ['adaptive', 'rsi', 'volatility', 'advanced'],
      complexity: 'hard',
      lastModified: '2025-03-10',
      version: '1.0'
    },
    {
      id: 'ml-ensemble',
      name: 'ML-Based Ensemble Strategy',
      description: 'Complex strategy that simulates an ensemble of machine learning models',
      prompt: `Create a Pine Script strategy that simulates an ensemble of multiple techniques to identify trade setups.
      Implement the following "models" and combine their signals:
      1. Trend model: Use Hull Moving Average (HMA) direction and slope
      2. Mean reversion model: Connors RSI with custom settings
      3. Breakout model: Donchian Channels with ATR-based extensions
      4. Volume model: On-Balance Volume (OBV) rate of change
      5. Volatility model: Bollinger Bandwidth with percentile ranking
      
      Weight each model's signal based on recent historical performance (custom lookback parameter).
      Generate a combined signal score (0-100) from the weighted models.
      Enter long positions when the combined score exceeds 75.
      Exit long positions when the combined score falls below 30.
      Implement dynamic position sizing based on the strength of the combined signal.
      Include a market regime filter that detects trending vs ranging conditions.
      Only trade in the direction aligned with the detected market regime.`,
      tags: ['ml', 'ensemble', 'adaptive', 'advanced'],
      complexity: 'hard',
      lastModified: '2025-03-15',
      version: '1.0'
    }
  ]
};

// Export default for backward compatibility
export default strategyPrompts;

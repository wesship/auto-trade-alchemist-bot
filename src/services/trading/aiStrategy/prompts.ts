
import { StrategyPrompts } from './types';

/**
 * Predefined strategy prompts by complexity
 */
export const strategyPrompts: StrategyPrompts = {
  easy: [
    {
      id: 'easy-gaussian-crossover',
      name: 'Gaussian Channel Crossover',
      description: 'Simple strategy going long when price crosses above upper Gaussian channel',
      prompt: 'Create a Pine Script trading strategy that uses Gaussian Channels. Go long when close price crosses above upper channel. Exit when price crosses below lower channel. Only long trades, no shorts.'
    },
    {
      id: 'easy-stoch-rsi',
      name: 'Stochastic RSI Strategy',
      description: 'Enter long when Stochastic RSI K-line crosses above D-line',
      prompt: 'Create a Pine Script strategy that uses Stochastic RSI. Go long when K line crosses above D line. Exit when K crosses below D. Length=14, smoothK=3, smoothD=3.'
    }
  ],
  medium: [
    {
      id: 'medium-gaussian-stoch-rsi',
      name: 'Gaussian Channel + Stoch RSI',
      description: 'Combined strategy using both Gaussian Channel and Stochastic RSI',
      prompt: 'Create a Pine Script strategy that uses both Gaussian Channels and Stochastic RSI. Go long when price is above the upper Gaussian channel AND Stochastic RSI K-line is greater than 60. Exit when price is below lower channel OR Stochastic RSI K-line is below 40.'
    },
    {
      id: 'medium-triple-ema-cross',
      name: 'Triple EMA Crossover',
      description: 'Strategy using three EMAs of different lengths',
      prompt: 'Create a Pine Script strategy that uses three EMAs (8, 21, 55). Go long when 8 EMA crosses above 21 EMA AND both are above 55 EMA. Exit when 8 EMA crosses below 21 EMA. Use 100% equity, 0.1% commission.'
    }
  ],
  hard: [
    {
      id: 'hard-custom-gaussian',
      name: 'Custom Gaussian Function',
      description: 'Strategy that implements a custom Gaussian-based indicator',
      prompt: 'Create a Pine Script strategy that implements a custom Gaussian-based moving average function. The function should apply Gaussian weights to price data using standard deviation of 3 and a lookback period of 20. Go long when this custom Gaussian MA turns upward (current value > previous value) AND price is above the Gaussian MA. Exit when the Gaussian MA turns downward.'
    },
    {
      id: 'hard-multi-timeframe',
      name: 'Multi-Timeframe Strategy',
      description: 'Strategy analyzing multiple timeframes using Stochastic RSI and volume profile',
      prompt: "Create a Pine Script strategy that uses Stochastic RSI on two timeframes (current and higher) plus volume profile. Go long when Stochastic RSI on both timeframes show K line above D line AND price is near a high volume node from the volume profile. Exit when either timeframe's Stochastic RSI K line crosses below its D line."
    }
  ]
};


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

export const pineScriptPrompts = {
  basic: {
    id: 'pine-basic',
    name: 'Basic PineScript Strategy',
    description: 'Generate a simple PineScript strategy using standard indicators',
    prompt: `You are a professional PineScript v6 developer.
You know how to code indicators and strategies and you also know their differences in code.
I need your help to create a simple trading strategy.

When to buy and when to sell:
- Go long when the 20-period EMA crosses above the 50-period EMA.
- Close long when the 20-period EMA crosses below the 50-period EMA.

Respect these instructions:
- Use Strategy specific code for TradingView.
- Don't trigger a short. Simply go Long and Flat.
- Always use 100% of capital.
- Set commission to 0.1%.
- Set slippage to 0.`
  },
  bollinger: {
    id: 'pine-bollinger',
    name: 'Bollinger Bands Strategy',
    description: 'Convert a Bollinger Bands indicator to a trading strategy',
    prompt: `You are a professional PineScript v6 developer.
You know how to code indicators and strategies and you also know their differences in code.
I need your help to turn a TradingView indicator into a strategy please.

When to buy and when to sell:
- Go long when price closes above the upper Bollinger Band.
- Close long when price closed below the lower Bollinger Band.

Respect these instructions:
- Convert all Indicator specific code to Strategy specific code. Don't use any code that a TradingView Strategy won't support.
- If the indicator is plotting something, the strategy code shall plot the same thing as well.
- Don't trigger a short. Simply go Long and Flat.
- Always use 100% of capital.
- Set commission to 0.1%.
- Set slippage to 0.`
  },
  modification: {
    id: 'pine-modification',
    name: 'Strategy Modification',
    description: 'Modify an existing PineScript strategy',
    prompt: `This is a Pine Script trading strategy. Can you modify it to make it open a long trade when price comes from below the band and closes above the lower Bollinger Band instead of the current entry condition?`,
    requiresExistingCode: true
  },
  advanced: {
    id: 'pine-advanced',
    name: 'Advanced Strategy Creation',
    description: 'Generate a more complex strategy with multiple indicators and risk management',
    prompt: `You are a professional PineScript v6 developer.
Create a trading strategy that combines RSI, MACD, and volume for entry and exit signals.
The strategy should include proper risk management with stop losses and take profit levels.
Please add comments explaining the key parts of the strategy.`
  },
  fullFeaturedBollinger: {
    id: 'pine-full-bollinger',
    name: 'Complete Bollinger Bands Strategy',
    description: 'Generate a fully featured Bollinger Bands strategy with detailed parameters',
    prompt: `You are a professional PineScript v6 developer.
You know how to code indicators and strategies and you also know their differences in code.
I need your help to turn a TradingView indicator into a strategy please.

When to buy and when to sell:
- Go long when price closes above the upper Bollinger Band.
- Close long when price closed below the lower Bollinger Band.

Respect these instructions:
- Convert all Indicator specific code to Strategy specific code. Don't use any code that a TradingView Strategy won't support. Especially timeframes and gaps. Define those in code so they are semantically the same as before.
- Preserve the timeframe logic if there is one. Fill gaps.
- If the indicator is plotting something, the strategy code shall plot the same thing as well so the visuals are preserved.
- Don't trigger a short. Simply go Long and Flat.
- Always use 100% of capital.
- Set commission to 0.1%.
- Set slippage to 0.
- strategy.commission.percent and strategy.slippage don't exist in PineScript. Please avoid this mistake. Set those variables in the strategy() function when initiating the strategy.
- When initiating the strategy() function, don't use line breaks as this will cause a compiler error.
- Leave all other strategy settings to default values (aka. don't set them at all).
- Never use lookahead_on because that's cheating. 
- Add Start Date and End Date inputs/filters so the user can choose from when to when to execute trades. Start with 1st January 2018 and go to 31st December 2069.
- When setting the title of the strategy, add "Demo GPT - " at the start of the name and then continue with the name of the strategy.`
  }
};

export default {
  strategyPrompts,
  pineScriptPrompts
};

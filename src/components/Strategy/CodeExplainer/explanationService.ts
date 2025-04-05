
import pineScriptExamples from './pineScriptExamples';
import { ExplanationData } from './types';

// Generate explanation data for a given code snippet
export const getExplanationData = (code: string): ExplanationData => {
  // Determine if we're dealing with the original or modified Bollinger bands strategy
  const isModifiedBollinger = code.includes("enterLong = ta.crossover(close, lower)");
  
  // In a real app, this would call an AI service
  return {
    summary: isModifiedBollinger 
      ? "This strategy uses Bollinger Bands to identify potential entries when price crosses above the lower band, indicating a potential bounce from oversold conditions. It exits when price crosses back below the lower band."
      : "This strategy uses Bollinger Bands to identify potential breakout opportunities. It enters a long position when price closes above the upper band (indicating strong momentum) and exits when price falls below the lower band.",
    keyComponents: [
      {
        name: "Indicators Used",
        description: "Bollinger Bands with customizable length and standard deviation multiplier"
      },
      {
        name: "Entry Conditions",
        description: isModifiedBollinger 
          ? "Buys when price crosses above the lower Bollinger Band, indicating a potential bounce."
          : "Buys when price crosses above the upper Bollinger Band, indicating a potential breakout."
      },
      {
        name: "Exit Conditions",
        description: "Sells when price crosses below the lower Bollinger Band."
      },
      {
        name: "Risk Management",
        description: "Uses 100% of available equity for each trade with a 0.1% commission."
      }
    ],
    lineByLine: code.split('\n').map((line, index) => {
      // Simple rule-based explanations
      const explanation = line.includes('//') 
        ? "Comment explaining the code"
        : line.includes('strategy(') 
        ? "Defines the strategy name and settings" 
        : line.includes('input.') 
        ? "User-configurable parameter for the strategy"
        : line.includes('ta.crossover') 
        ? "Checks if price has crossed above a threshold"
        : line.includes('ta.crossunder') 
        ? "Checks if price has crossed below a threshold"
        : line.includes('strategy.entry') 
        ? "Executes a buy order"
        : line.includes('strategy.close') 
        ? "Closes an existing position"
        : line.includes('plot(') 
        ? "Displays indicator on the chart"
        : line.includes('ma(') 
        ? "Custom function to calculate moving averages of different types"
        : line.includes('basis =') 
        ? "Calculates the middle band (moving average)"
        : line.includes('upper =') 
        ? "Calculates the upper band (MA + standard deviation)"
        : line.includes('lower =') 
        ? "Calculates the lower band (MA - standard deviation)"
        : line.trim() === "" 
        ? "Empty line for readability"
        : "Code statement";
      
      return {
        line,
        explanation,
        important: line.includes('enterLong') || line.includes('exitLong') || line.includes('strategy.entry') || line.includes('strategy.close')
      };
    }),
    suggestions: [
      "Consider adding a filter based on overall market trend",
      "Experiment with different standard deviation multipliers for tighter or wider bands",
      "Test adding a volume filter to reduce false signals",
      "Try adding a trailing stop-loss to lock in profits",
      "Consider adjusting position sizing based on volatility"
    ],
    aiPromptUsed: isModifiedBollinger
      ? "This is a Pine Script code. Can you modify it to make it open a long trade when price comes from below the band and closes above. By band I mean Bollinger band."
      : "You are a professional PineScript v6 developer. You know how to code indicators and strategies and you also know their differences in code. I need your help to turn a TradingView indicator into a strategy please.\n\nWhen to buy and when to sell:\n- Go long when price closes above the upper Bollinger Band.\n- Close long when price closed below the lower Bollinger Band."
  };
};

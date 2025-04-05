
export const advancedPineScriptPrompts = {
  macdStrategy: {
    id: 'pine-macd',
    name: 'MACD Crossover Strategy',
    description: 'Generate a strategy based on MACD crossovers with money management',
    prompt: `You are a professional PineScript v6 developer.
Create a Pine Script strategy that trades MACD crossovers with the following rules:

Entry conditions:
- Go long when the MACD line crosses above the signal line AND the histogram is increasing
- Only enter when the close price is above the 200 EMA

Exit conditions:
- Exit when MACD line crosses below the signal line OR
- Use a trailing stop of 2 ATR (Average True Range)

Money management:
- Use 2% risk per trade based on the ATR for position sizing
- Add a take profit at 3x the initial risk

Include detailed comments and make sure to use proper strategy settings including:
- Set commission to 0.1%
- Use strategy.percent_of_equity for position sizing
- Add input parameters to allow users to adjust key variables
- Add date range filtering for backtesting`
  },
  rsiDivergence: {
    id: 'pine-rsi-divergence',
    name: 'RSI Divergence Strategy',
    description: 'Generate a strategy that detects and trades RSI divergences',
    prompt: `You are a professional PineScript v6 developer.
Create a Pine Script strategy that detects and trades RSI divergences with these specifications:

Divergence detection:
- Identify bullish divergences when price makes a lower low but RSI makes a higher low
- Use a 14-period RSI and look back 5 bars for divergence patterns

Entry and exit:
- Go long when a bullish divergence is detected AND RSI is below 40 (oversold)
- Exit when RSI crosses above 70 (overbought) OR after holding for 10 bars

Visualization:
- Plot divergence points on the chart
- Display the RSI indicator in a separate pane
- Use color coding to highlight entry and exit points

Configuration:
- Add customizable length parameters for RSI and lookback period
- Include risk management with fixed 2% risk per trade
- Set commission to 0.1%
- Allow date range filtering for backtesting

Add detailed comments explaining the divergence detection algorithm and strategy logic.`
  },
  volatilityBreakout: {
    id: 'pine-volatility-breakout',
    name: 'Volatility Breakout Strategy',
    description: 'Generate a volatility-based breakout strategy with ATR',
    prompt: `You are a professional PineScript v6 developer.
Create a Pine Script volatility breakout strategy with these specifications:

Volatility measurement:
- Use Average True Range (ATR) with a 14-period length
- Calculate a volatility threshold as 1.5 times the ATR

Entry conditions:
- Go long when the current bar's range (high-low) exceeds the volatility threshold
- AND the close price is greater than the open price (bullish candle)
- AND volume is above its 20-period moving average

Exit conditions:
- Trail a stop loss at 2 times ATR below the entry price
- Take profit at 3 times the initial risk
- Use a maximum holding period of 5 bars

Risk management:
- Risk 1% of equity per trade
- Scale position size based on ATR (higher ATR = smaller position)
- Add an optional time-based filter to only trade during specific hours

Visualization:
- Highlight breakout bars on the chart
- Plot the ATR and volatility threshold
- Show entry and exit signals with arrows

Add custom inputs for all major parameters and include detailed comments explaining the volatility-based entry logic.`
  }
};

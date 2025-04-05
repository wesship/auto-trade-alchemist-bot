
// Sample PineScript strategies
export const pineScriptExamples = {
  bollinger: `//@version=5
strategy(shorttitle="BB Strategy", title="Demo GPT - Bollinger Bands Strategy", overlay=true, commission_type=strategy.commission.percent, commission_value=0.1, slippage=0, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// Inputs
length = input.int(20, minval=1, title="Length")
maType = input.string("SMA", "Basis MA Type", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA"])
src = input(close, title="Source")
mult = input.float(2.0, minval=0.001, maxval=50, title="StdDev")
offset = input.int(0, "Offset", minval = -500, maxval = 500)

// Date Range Filter
startDate = input.time(title="Start Date", defval=timestamp("2018-01-01"), confirm=false)
endDate = input.time(title="End Date", defval=timestamp("2069-12-31"), confirm=false)
timeAllowed = time >= startDate and time <= endDate

// MA Type Selector
ma(source, length, _type) =>
    switch _type
        "SMA" => ta.sma(source, length)
        "EMA" => ta.ema(source, length)
        "SMMA (RMA)" => ta.rma(source, length)
        "WMA" => ta.wma(source, length)
        "VWMA" => ta.vwma(source, length)

// Calculations
basis = ma(src, length, maType)
dev = mult * ta.stdev(src, length)
upper = basis + dev
lower = basis - dev

// Preserve Indicator Plots
plot(basis, "Basis", color=#2962FF, offset=offset)
p1 = plot(upper, "Upper", color=#F23645, offset=offset)
p2 = plot(lower, "Lower", color=#089981, offset=offset)
fill(p1, p2, title="Background", color=color.rgb(33, 150, 243, 95))

// Strategy Logic
enterLong = ta.crossover(close, upper) and timeAllowed
exitLong = ta.crossunder(close, lower) and timeAllowed

if enterLong
    strategy.entry("Long", strategy.long)
if exitLong
    strategy.close("Long")`,
  bollingerModified: `//@version=5
strategy(shorttitle="BB Strategy", title="Demo GPT - Bollinger Bands Strategy", overlay=true, commission_type=strategy.commission.percent, commission_value=0.1, slippage=0, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// Inputs
length = input.int(20, minval=1, title="Length")
maType = input.string("SMA", "Basis MA Type", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA"])
src = input(close, title="Source")
mult = input.float(2.0, minval=0.001, maxval=50, title="StdDev")
offset = input.int(0, "Offset", minval = -500, maxval = 500)

// Date Range Filter
startDate = input.time(title="Start Date", defval=timestamp("2018-01-01"), confirm=false)
endDate = input.time(title="End Date", defval=timestamp("2069-12-31"), confirm=false)
timeAllowed = time >= startDate and time <= endDate

// MA Type Selector
ma(source, length, _type) =>
    switch _type
        "SMA" => ta.sma(source, length)
        "EMA" => ta.ema(source, length)
        "SMMA (RMA)" => ta.rma(source, length)
        "WMA" => ta.wma(source, length)
        "VWMA" => ta.vwma(source, length)

// Calculations
basis = ma(src, length, maType)
dev = mult * ta.stdev(src, length)
upper = basis + dev
lower = basis - dev

// Preserve Indicator Plots
plot(basis, "Basis", color=#2962FF, offset=offset)
p1 = plot(upper, "Upper", color=#F23645, offset=offset)
p2 = plot(lower, "Lower", color=#089981, offset=offset)
fill(p1, p2, title="Background", color=color.rgb(33, 150, 243, 95))

// Strategy Logic
enterLong = ta.crossover(close, lower) and timeAllowed // Modified: Price crosses above lower band
exitLong = ta.crossunder(close, lower) and timeAllowed // Exit when price crosses back below lower band

if enterLong
    strategy.entry("Long", strategy.long)
if exitLong
    strategy.close("Long")`
};

export default pineScriptExamples;


import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { fetchMarketData, getTradeStrategy } from '@/services/tradingService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { 
  BarChart4, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  BarChart,
  Brain,
  Target,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { TradeSignal, Asset } from '@/types/trading';

const Forecast = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1w');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [strategyType, setStrategyType] = useState('balanced');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);

  // Query for market data
  const { data: marketData, isLoading: isLoadingMarket } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
  });

  // Get trading strategies
  const { data: tradingStrategies, isLoading: isLoadingStrategies, refetch: refetchStrategies } = useQuery({
    queryKey: ['tradingStrategies', selectedAsset, timeframe, strategyType],
    queryFn: () => getTradeStrategy(selectedAsset, timeframe, strategyType),
  });

  // Generate forecast data when asset or timeframe changes
  useEffect(() => {
    if (marketData) {
      generateForecastData();
    }
  }, [selectedAsset, timeframe, marketData]);

  // Update strategies when trading strategies are loaded
  useEffect(() => {
    if (tradingStrategies) {
      setStrategies(tradingStrategies);
    }
  }, [tradingStrategies]);

  // Generate mock forecast data
  const generateForecastData = () => {
    const asset = marketData?.find(a => a.symbol === selectedAsset);
    if (!asset) return;

    const currentPrice = asset.price;
    const volatility = asset.symbol.includes('BTC') ? 0.04 : asset.symbol.includes('ETH') ? 0.035 : 0.02;
    
    // Generate forecast points
    const days = timeframe === '1d' ? 24 : timeframe === '1w' ? 7 : 30;
    const points = timeframe === '1d' ? 24 : timeframe === '1w' ? 7 : 30;
    const interval = days / points;
    
    const trendBias = Math.random() > 0.5 ? 1 : -1;
    const forecastPoints = Array.from({ length: points + 1 }, (_, i) => {
      const time = new Date();
      time.setHours(time.getHours() + (i * interval * 24));
      
      // Calculate price with random walk + trend
      const randomFactor = (Math.random() - 0.5) * 2 * volatility;
      const trendFactor = (i / points) * trendBias * volatility * 2;
      const priceFactor = 1 + randomFactor + trendFactor;
      const forecastPrice = currentPrice * priceFactor;
      
      // Calculate confidence based on time distance
      const confidence = Math.max(30, Math.round(95 - (i / points) * 65));
      
      return {
        time: time.toISOString(),
        price: parseFloat(forecastPrice.toFixed(2)),
        confidence,
        lower: parseFloat((forecastPrice * (1 - (1 - confidence/100) * 0.5)).toFixed(2)),
        upper: parseFloat((forecastPrice * (1 + (1 - confidence/100) * 0.5)).toFixed(2)),
      };
    });
    
    setForecastData(forecastPoints);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Calculate overall forecast direction and confidence
  const getForecastSummary = () => {
    if (forecastData.length < 2) return { direction: 'neutral', confidence: 0, change: 0 };
    
    const startPrice = forecastData[0].price;
    const endPrice = forecastData[forecastData.length - 1].price;
    const change = ((endPrice - startPrice) / startPrice) * 100;
    const direction = change > 1 ? 'bullish' : change < -1 ? 'bearish' : 'neutral';
    
    // Average confidence weighted by time (more recent predictions have higher weight)
    const weightedConfidence = forecastData.reduce((acc, point, index) => {
      const weight = 1 + index / forecastData.length;
      return acc + (point.confidence * weight);
    }, 0);
    
    const totalWeight = forecastData.reduce((acc, _, index) => {
      return acc + (1 + index / forecastData.length);
    }, 0);
    
    return { 
      direction, 
      confidence: Math.round(weightedConfidence / totalWeight), 
      change: parseFloat(change.toFixed(2))
    };
  };

  const summary = getForecastSummary();

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Forecasting</h1>
          <p className="text-muted-foreground">
            Generate predictions, analyze trends, and optimize trading strategies
          </p>
        </div>
        
        <Button className="mt-4 lg:mt-0" onClick={() => refetchStrategies()}>
          <Zap className="mr-2 h-4 w-4" />
          Generate New Strategies
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Price Forecast
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                    <SelectItem value="AAPL">Apple</SelectItem>
                    <SelectItem value="NVDA">NVIDIA</SelectItem>
                    <SelectItem value="MSFT">Microsoft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mb-6">
              {isLoadingMarket ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatDate} 
                      tickMargin={10} 
                    />
                    <YAxis 
                      yAxisId="left"
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'price') return [`$${value}`, 'Price'];
                        if (name === 'confidence') return [`${value}%`, 'Confidence'];
                        if (name === 'upper') return [`$${value}`, 'Upper Bound'];
                        if (name === 'lower') return [`$${value}`, 'Lower Bound'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="lower" 
                      stroke="#8884d8" 
                      fillOpacity={0.2}
                      fill="#8884d8" 
                      name="Lower Bound"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      fillOpacity={0.5}
                      fill="url(#colorPrice)" 
                      name="Price"
                      strokeWidth={2}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="upper" 
                      stroke="#8884d8" 
                      fillOpacity={0.2}
                      fill="#8884d8" 
                      name="Upper Bound"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#82ca9d" 
                      name="Confidence"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm mb-1">Forecast Direction</div>
                <div className="text-xl font-semibold flex items-center">
                  {summary.direction === 'bullish' ? (
                    <>
                      <ArrowUpRight className="mr-1 h-5 w-5 text-tradingGreen-500" />
                      <span className="text-tradingGreen-500 capitalize">{summary.direction}</span>
                    </>
                  ) : summary.direction === 'bearish' ? (
                    <>
                      <ArrowDownRight className="mr-1 h-5 w-5 text-tradingRed-500" />
                      <span className="text-tradingRed-500 capitalize">{summary.direction}</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-1 h-5 w-5 text-muted-foreground" />
                      <span className="capitalize">{summary.direction}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm mb-1">Confidence Level</div>
                <div className="text-xl font-semibold terminal-value">{summary.confidence}%</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm mb-1">Price Change</div>
                <div className={`text-xl font-semibold ${
                  summary.change > 0 
                    ? 'text-tradingGreen-500' 
                    : summary.change < 0 
                    ? 'text-tradingRed-500' 
                    : ''
                }`}>
                  {summary.change > 0 ? '+' : ''}{summary.change}%
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm mb-1">Forecast Period</div>
                <div className="text-xl font-semibold flex items-center">
                  <Calendar className="mr-1 h-5 w-5 text-muted-foreground" />
                  <span>
                    {timeframe === '1d' ? '24 Hours' : timeframe === '1w' ? '7 Days' : '30 Days'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Strategy Optimizer
            </CardTitle>
            <CardDescription>
              Adjust parameters to optimize trading strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Confidence Threshold</label>
                  <span className="text-sm text-muted-foreground">{confidenceThreshold}%</span>
                </div>
                <Slider
                  value={[confidenceThreshold]} 
                  min={30} 
                  max={95} 
                  step={5}
                  onValueChange={(value) => setConfidenceThreshold(value[0])}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Strategy Type</label>
                <Select value={strategyType} onValueChange={setStrategyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="momentum">Momentum-Based</SelectItem>
                    <SelectItem value="contrarian">Contrarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => refetchStrategies()}
              >
                <Target className="mr-2 h-4 w-4" />
                Optimize Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            Recommended Trading Strategies
          </CardTitle>
          <CardDescription>
            AI-generated trading strategies based on forecast data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStrategies ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : strategies && strategies.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {strategies.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg flex items-center">
                        {strategy.name}
                        <Badge 
                          className="ml-2" 
                          variant={
                            strategy.type === 'aggressive' ? 'destructive' : 
                            strategy.type === 'conservative' ? 'outline' :
                            'secondary'
                          }
                        >
                          {strategy.type}
                        </Badge>
                      </h3>
                      <div className="flex items-center">
                        <Badge 
                          variant={strategy.direction === 'BUY' ? 'success' : 'destructive'} 
                          className="mr-2"
                        >
                          {strategy.direction}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {strategy.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {strategy.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground block">Entry Price</span>
                        <span className="font-medium">${strategy.entryPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground block">Target Price</span>
                        <span className="font-medium">${strategy.targetPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground block">Stop Loss</span>
                        <span className="font-medium">${strategy.stopLoss.toLocaleString()}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground block">Potential Return</span>
                        <span className={`font-medium ${
                          strategy.potentialReturn > 0 
                            ? 'text-tradingGreen-500' 
                            : 'text-tradingRed-500'
                        }`}>
                          {strategy.potentialReturn > 0 ? '+' : ''}{strategy.potentialReturn}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 mr-2"
                      >
                        Apply Strategy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No strategies available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust your parameters and generate strategies
              </p>
              <Button onClick={() => refetchStrategies()}>
                Generate Strategies
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Forecast;


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, Line, Tooltip, Legend } from 'recharts';

interface ForecastChartProps {
  forecastData: any[];
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  summary: {
    direction: string;
    confidence: number;
    change: number;
  };
  isLoadingMarket: boolean;
  formatDate: (dateString: string) => string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
  forecastData,
  selectedAsset,
  setSelectedAsset,
  timeframe,
  setTimeframe,
  summary,
  isLoadingMarket,
  formatDate
}) => {
  return (
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
  );
};

export default ForecastChart;

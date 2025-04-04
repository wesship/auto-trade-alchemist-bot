
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Generate mock price data
const generatePriceData = (symbol: string, days: number) => {
  const data = [];
  const today = new Date();
  let basePrice;
  
  // Set realistic base prices for different assets
  switch(symbol) {
    case 'BTC': basePrice = 63000; break;
    case 'ETH': basePrice = 3400; break;
    case 'AAPL': basePrice = 180; break;
    case 'NVDA': basePrice = 900; break;
    default: basePrice = 100;
  }
  
  let price = basePrice;
  let volume = 0;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some trends and patterns in the data
    const trendFactor = Math.sin(i / (days / 6)) * 0.03; // Cyclical trend
    const randomFactor = (Math.random() - 0.5) * 0.04; // Random noise
    
    // Combine trend and random factors
    const changeFactor = trendFactor + randomFactor;
    
    // Calculate new price with change
    price = price * (1 + changeFactor);
    volume = Math.round(50000 + Math.random() * 150000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume
    });
  }
  
  return data;
};

interface PriceChartProps {
  defaultSymbol?: string;
}

const PriceChart = ({ defaultSymbol = 'BTC' }: PriceChartProps) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [timeframe, setTimeframe] = useState('30d');
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    setData(generatePriceData(symbol, days));
  }, [symbol, timeframe]);
  
  const formatYAxis = (value: number) => {
    if (symbol === 'BTC' && value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-md shadow-md">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm terminal-text">${payload[0].value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Volume: {payload[0].payload.volume.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Price Chart</CardTitle>
          <div className="flex space-x-2">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={symbol} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="NVDA">NVDA</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs defaultValue="30d" value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="90d">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => {
                const date = new Date(tick);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={['dataMin', 'dataMax']}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;

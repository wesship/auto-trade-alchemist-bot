
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ComposedChart } from 'recharts';

interface BacktestResult {
  equity: number[];
  trades: {
    date: string;
    type: 'buy' | 'sell';
    price: number;
    profit: number;
    size: number;
  }[];
  metrics: {
    netProfit: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    avgTradeProfit: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
  };
  equityData: {
    date: string;
    equity: number;
    drawdown: number;
    price: number;
  }[];
  monthlyReturns: {
    month: string;
    return: number;
  }[];
}

interface BacktestVisualizationProps {
  backtestResult: BacktestResult;
  strategyName: string;
}

const BacktestVisualization: React.FC<BacktestVisualizationProps> = ({
  backtestResult,
  strategyName
}) => {
  const { metrics, equityData, monthlyReturns } = backtestResult;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2
    }).format(value / 100);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{strategyName} Backtest Results</CardTitle>
            <CardDescription>Historical performance analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={metrics.netProfit > 0 ? "success" : "destructive"}>
              {metrics.netProfit > 0 ? "Profitable" : "Unprofitable"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
              <div className={`text-lg font-bold ${metrics.netProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(metrics.netProfit)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
              <div className="text-lg font-bold">
                {formatPercent(metrics.winRate)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Profit Factor</div>
              <div className="text-lg font-bold">
                {metrics.profitFactor.toFixed(2)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Sharpe Ratio</div>
              <div className="text-lg font-bold">
                {metrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Max Drawdown</div>
              <div className="text-lg font-bold text-red-500">
                {formatPercent(metrics.maxDrawdown)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Total Trades</div>
              <div className="text-lg font-bold">
                {metrics.totalTrades} ({metrics.winningTrades}/{metrics.losingTrades})
              </div>
            </div>
          </div>

          <Tabs defaultValue="equity" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="equity">Equity Curve</TabsTrigger>
              <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="equity" className="mt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === "Equity") return [`$${value.toLocaleString()}`, name];
                        if (name === "Price") return [`$${value.toLocaleString()}`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="equity" 
                      name="Equity" 
                      fill="#8884d8" 
                      stroke="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="price" 
                      name="Price" 
                      stroke="#ffc658" 
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="drawdown" className="mt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)}%`, "Drawdown"]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      name="Drawdown" 
                      fill="#ff5252" 
                      stroke="#ff5252"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)}%`, "Return"]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="return" 
                      name="Monthly Return" 
                      fill={(data) => data.return >= 0 ? "#4caf50" : "#ff5252"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BacktestVisualization;


import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketData, fetchModels } from "@/services/tradingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketTicker from "@/components/Dashboard/MarketTicker";
import PriceChart from "@/components/Dashboard/PriceChart";
import PerformanceStats from "@/components/Dashboard/PerformanceStats";
import ModelPerformanceTable from "@/components/Dashboard/ModelPerformanceTable";
import { AITradingModel } from "@/types/trading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, ArrowDownIcon, ArrowUpIcon, BarChart4, Cpu, LineChart, Loader2 } from "lucide-react";

const Dashboard = () => {
  // Mock overall performance data
  const [performanceData, setPerformanceData] = useState({
    totalPnl: 12452.87,
    dailyPnl: 387.42,
    weeklyPnl: 1243.56,
    winRate: 0.67,
    totalTrades: 231,
    pnlHistory: Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return {
        date: date.toISOString().split('T')[0],
        pnl: Math.round((Math.random() * 2 - 0.6) * 500), // Random values between -300 and 700
      };
    }),
  });

  // Market data query
  const { data: marketData, isLoading: isLoadingMarket } = useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketData,
  });

  // Models query
  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
  });

  // Summary card with the latest model predictions
  const renderPredictionSummary = () => {
    if (!models || models.length === 0) return null;
    
    // Get recent predictions from all models
    const recentSignals = models.flatMap(model => 
      model.recentSignals.slice(0, 1).map(signal => ({
        modelName: model.config.name,
        modelType: model.config.modelType,
        ...signal
      }))
    ).slice(0, 4);
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Cpu className="mr-2 h-5 w-5 text-primary" />
            Latest AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSignals.map((signal, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex flex-col">
                  <div className="font-medium">{signal.modelName}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span className="mr-2">{signal.symbol}</span>
                    <span>•</span>
                    <span className="ml-2">{new Date(signal.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-medium">{(signal.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    signal.action === 'BUY' 
                      ? 'bg-tradingGreen-500/10 text-tradingGreen-500' 
                      : signal.action === 'SELL' 
                      ? 'bg-tradingRed-500/10 text-tradingRed-500' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {signal.action === 'BUY' ? (
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                    ) : signal.action === 'SELL' ? (
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                    ) : null}
                    {signal.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor performance, analyze markets, and review AI trading predictions
          </p>
        </div>
        
        <Tabs defaultValue="all" className="mt-4 lg:mt-0">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <BarChart4 className="h-4 w-4 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center">
              <LineChart className="h-4 w-4 mr-1" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center">
              <AreaChart className="h-4 w-4 mr-1" />
              Stocks
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <MarketTicker />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          {renderPredictionSummary()}
        </div>
      </div>
      
      <PerformanceStats data={performanceData} />
      
      {isLoadingModels ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : models ? (
        <ModelPerformanceTable models={models} />
      ) : null}
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, BookmarkCheck, Share, Code } from "lucide-react";
import { toast } from "sonner";
import BacktestHeader from './Backtest/BacktestHeader';
import StrategyParameters from './Backtest/StrategyParameters';
import PerformanceSummary from './Backtest/PerformanceSummary';
import TradesTable from './Backtest/TradesTable';
import EquityAnalysis from './Backtest/EquityAnalysis';
import MetricsCards from './Backtest/MetricsCards';
import { formatCurrency } from './Backtest/utils';

// Mock data imports and type definitions stay the same
const backtestData = {
  performance: {
    netProfit: 8742.50,
    winRate: 0.67,
    profitFactor: 2.3,
    maxDrawdown: 12.4,
    sharpRatio: 1.8,
    totalTrades: 73,
    winningTrades: 49,
    losingTrades: 24,
  },
  trades: [
    { id: 1, date: '2025-01-05', type: 'LONG', entry: 105.20, exit: 112.45, profit: 7.25, profitPercent: 6.89 },
    { id: 2, date: '2025-01-12', type: 'LONG', entry: 113.80, exit: 118.30, profit: 4.50, profitPercent: 3.95 },
    { id: 3, date: '2025-01-20', type: 'LONG', entry: 116.70, exit: 113.20, profit: -3.50, profitPercent: -3.00 },
    { id: 4, date: '2025-02-03', type: 'LONG', entry: 110.40, exit: 117.85, profit: 7.45, profitPercent: 6.75 },
    { id: 5, date: '2025-02-15', type: 'LONG', entry: 119.30, exit: 115.60, profit: -3.70, profitPercent: -3.10 },
    { id: 6, date: '2025-02-27', type: 'LONG', entry: 114.80, exit: 122.35, profit: 7.55, profitPercent: 6.58 },
    { id: 7, date: '2025-03-10', type: 'LONG', entry: 124.50, exit: 130.75, profit: 6.25, profitPercent: 5.02 },
    { id: 8, date: '2025-03-22', type: 'LONG', entry: 129.40, exit: 125.60, profit: -3.80, profitPercent: -2.94 },
  ],
  equityCurve: [
    { date: '2025-01-01', equity: 10000 },
    { date: '2025-01-05', equity: 10689 },
    { date: '2025-01-12', equity: 11111 },
    { date: '2025-01-20', equity: 10778 },
    { date: '2025-02-03', equity: 11505 },
    { date: '2025-02-15', equity: 11149 },
    { date: '2025-02-27', equity: 11882 },
    { date: '2025-03-10', equity: 12478 },
    { date: '2025-03-22', equity: 12112 },
    { date: '2025-04-01', equity: 12743 },
  ],
  monthlyReturns: [
    { month: 'Jan 2025', return: 7.78 },
    { month: 'Feb 2025', return: 3.44 },
    { month: 'Mar 2025', return: 5.31 },
    { month: 'Apr 2025', return: 2.73 },
  ],
  drawdowns: [
    { date: '2025-01-01', drawdown: 0 },
    { date: '2025-01-05', drawdown: 0 },
    { date: '2025-01-12', drawdown: 0 },
    { date: '2025-01-20', drawdown: -3.00 },
    { date: '2025-02-03', drawdown: 0 },
    { date: '2025-02-15', drawdown: -3.10 },
    { date: '2025-02-27', drawdown: 0 },
    { date: '2025-03-10', drawdown: 0 },
    { date: '2025-03-22', drawdown: -2.94 },
    { date: '2025-04-01', drawdown: 0 },
  ],
};

const timeframeOptions = [
  { label: "1 Month", value: "1M" },
  { label: "3 Months", value: "3M" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
  { label: "All Time", value: "ALL" },
];

const strategyParams = {
  entryCondition: "RSI < 30",
  exitCondition: "RSI > 70",
  stopLoss: "2%",
  takeProfit: "4%",
  timeframe: "1 Hour",
  lookbackPeriod: "20 days",
  instrument: "BTC/USD",
  startingCapital: "$10,000",
};

const BacktestVisualization = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("ALL");
  const [showStrategyParams, setShowStrategyParams] = useState(false);
  
  const handleRunBacktest = () => {
    setIsRunning(true);
    toast.info("Starting backtest...");
    
    setTimeout(() => {
      setIsRunning(false);
      toast.success("Backtest completed successfully!");
    }, 2500);
  };
  
  const handleSaveStrategy = () => {
    toast.success("Strategy saved to library", {
      description: "You can access it anytime from your Strategy Library",
    });
  };
  
  const handleExportResults = () => {
    toast.success("Backtest results exported");
  };
  
  const handleShareStrategy = () => {
    toast.success("Strategy shared", {
      description: "Link copied to clipboard",
    });
  };
  
  return (
    <div className="space-y-6">
      <BacktestHeader 
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        showStrategyParams={showStrategyParams}
        setShowStrategyParams={setShowStrategyParams}
        isRunning={isRunning}
        handleRunBacktest={handleRunBacktest}
      />
      
      <StrategyParameters 
        strategyParams={strategyParams}
        show={showStrategyParams}
      />
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="equity">Equity Curve</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceSummary performance={backtestData.performance} />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Returns</CardTitle>
                <CardDescription>Return by month</CardDescription>
              </CardHeader>
              <CardContent className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={backtestData.monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Return']} />
                    <Bar dataKey="return" fill="#4caf50">
                      {backtestData.monthlyReturns.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={parseFloat(entry.return.toString()) >= 0 ? "#4caf50" : "#ff5252"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Equity Curve</CardTitle>
              <CardDescription>Account equity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={backtestData.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Equity']} />
                  <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleSaveStrategy}>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Save Strategy
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareStrategy}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-4">
          <TradesTable 
            trades={backtestData.trades} 
            performance={backtestData.performance}
          />
        </TabsContent>
        
        <TabsContent value="equity" className="space-y-4">
          <EquityAnalysis 
            equityCurve={backtestData.equityCurve}
            drawdowns={backtestData.drawdowns}
          />
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <MetricsCards performance={backtestData.performance} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestVisualization;

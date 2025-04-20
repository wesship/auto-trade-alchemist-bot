
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Bar, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, ArrowDown, Download, RefreshCw, Filter, Plus, Wallet,
  PieChart as PieChartIcon, BarChart3, TrendingUp, ChevronDown 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock portfolio data
const portfolioData = {
  totalValue: 58642.75,
  dailyChange: 982.45,
  dailyChangePercent: 1.7,
  cashBalance: 12350.80,
  assets: [
    { name: "BTC", value: 18250.50, allocation: 31.1, quantity: 0.28, price: 65180.36, change: 2.4 },
    { name: "ETH", value: 12480.25, allocation: 21.3, quantity: 3.85, price: 3241.62, change: 1.1 },
    { name: "AAPL", value: 8920.40, allocation: 15.2, quantity: 42, price: 212.39, change: -0.7 },
    { name: "MSFT", value: 6540.80, allocation: 11.2, quantity: 15, price: 436.05, change: 0.9 },
    { name: "GOOGL", value: 4850.30, allocation: 8.3, quantity: 25, price: 194.01, change: 1.5 },
    { name: "AMZN", value: 3750.20, allocation: 6.4, quantity: 18, price: 208.34, change: -1.2 },
    { name: "TSLA", value: 3850.00, allocation: 6.5, quantity: 12, price: 320.83, change: 3.2 },
  ],
  trades: [
    { id: 1, date: '2025-04-12', asset: 'BTC', type: 'BUY', quantity: 0.15, price: 64250.25, value: 9637.54, status: 'COMPLETED' },
    { id: 2, date: '2025-04-10', asset: 'AAPL', type: 'SELL', quantity: 10, price: 214.35, value: 2143.50, status: 'COMPLETED' },
    { id: 3, date: '2025-04-05', asset: 'ETH', type: 'BUY', quantity: 1.5, price: 3120.80, value: 4681.20, status: 'COMPLETED' },
    { id: 4, date: '2025-03-28', asset: 'MSFT', type: 'BUY', quantity: 5, price: 428.90, value: 2144.50, status: 'COMPLETED' },
    { id: 5, date: '2025-03-22', asset: 'TSLA', type: 'BUY', quantity: 8, price: 305.40, value: 2443.20, status: 'COMPLETED' },
  ],
  performance: [
    { date: '2025-01-01', value: 45000 },
    { date: '2025-01-15', value: 46200 },
    { date: '2025-02-01', value: 47800 },
    { date: '2025-02-15', value: 47200 },
    { date: '2025-03-01', value: 49500 },
    { date: '2025-03-15', value: 52400 },
    { date: '2025-04-01', value: 56800 },
    { date: '2025-04-15', value: 58642 },
  ],
  monthlyPerformance: [
    { month: 'Jan', return: 4.9 },
    { month: 'Feb', return: 2.1 },
    { month: 'Mar', return: 6.8 },
    { month: 'Apr', return: 4.2 },
  ],
  aiStrategies: [
    { id: 1, name: 'Bitcoin Momentum', allocation: 12.5, return: 8.4, risk: 'High', status: 'Active' },
    { id: 2, name: 'Tech Growth', allocation: 18.2, return: 5.7, risk: 'Medium', status: 'Active' },
    { id: 3, name: 'ETF Balanced', allocation: 9.7, return: 3.2, risk: 'Low', status: 'Paused' },
  ]
};

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Portfolio = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  const handleRefreshPortfolio = () => {
    setIsRefreshing(true);
    toast.info("Refreshing portfolio data...");
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Portfolio data updated");
    }, 1500);
  };
  
  const handleAddFunds = () => {
    toast.success("Funds added successfully");
  };
  
  const handleWithdraw = () => {
    toast.success("Withdrawal initiated");
  };
  
  const handleAddAsset = () => {
    toast.info("Add Asset feature coming soon!");
  };
  
  const handleExportPortfolio = () => {
    toast.success("Portfolio data exported");
  };
  
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your assets and track performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshPortfolio}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleAddAsset}>
                Add Asset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddFunds}>
                Add Funds
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
              <div className={`flex items-center ${portfolioData.dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioData.dailyChangePercent >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">
                  {formatCurrency(portfolioData.dailyChange)} ({portfolioData.dailyChangePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-muted-foreground ml-1">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-3xl font-bold">{formatCurrency(portfolioData.cashBalance)}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleAddFunds}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Funds
                </Button>
                <Button size="sm" variant="outline" onClick={handleWithdraw}>
                  <Wallet className="h-4 w-4 mr-1" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData.performance}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">All Time</p>
                <p className="font-medium text-green-500">+30.3%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">YTD</p>
                <p className="font-medium text-green-500">+19.2%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">30D</p>
                <p className="font-medium text-green-500">+11.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trades" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Trades
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Asset Allocation</CardTitle>
                <CardDescription>Portfolio distribution by asset</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData.assets}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Returns</CardTitle>
                <CardDescription>Performance by month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioData.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Return']} />
                    <Bar dataKey="return" fill="#3b82f6">
                      {portfolioData.monthlyPerformance.map((entry, index) => (
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
              <CardTitle className="text-lg">AI Trading Strategies</CardTitle>
              <CardDescription>AI-powered automated strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                  <div>Strategy Name</div>
                  <div>Allocation</div>
                  <div>Return</div>
                  <div>Risk Level</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {portfolioData.aiStrategies.map((strategy) => (
                    <div key={strategy.id} className="grid grid-cols-5 p-3 text-sm">
                      <div className="font-medium">{strategy.name}</div>
                      <div>{strategy.allocation.toFixed(1)}%</div>
                      <div className="text-green-500">+{strategy.return.toFixed(1)}%</div>
                      <div>
                        <Badge variant="outline" className={
                          strategy.risk === 'High' 
                            ? 'border-red-500/50 text-red-500' 
                            : strategy.risk === 'Medium'
                            ? 'border-yellow-500/50 text-yellow-500'
                            : 'border-green-500/50 text-green-500'
                        }>
                          {strategy.risk}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={strategy.status === 'Active' ? 'default' : 'secondary'}>
                          {strategy.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" onClick={() => toast.info("Add AI Strategy feature coming soon!")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Asset Holdings</CardTitle>
                  <CardDescription>All assets in your portfolio</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAddAsset}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 bg-muted p-3 text-sm font-medium">
                  <div>Asset</div>
                  <div>Price</div>
                  <div>Change</div>
                  <div>Quantity</div>
                  <div>Value</div>
                  <div>Allocation</div>
                  <div></div>
                </div>
                <div className="divide-y">
                  {portfolioData.assets.map((asset, index) => (
                    <div key={index} className="grid grid-cols-7 p-3 text-sm">
                      <div className="font-medium">{asset.name}</div>
                      <div>{formatCurrency(asset.price)}</div>
                      <div className={asset.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </div>
                      <div>{asset.quantity}</div>
                      <div>{formatCurrency(asset.value)}</div>
                      <div>{asset.allocation.toFixed(1)}%</div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info(`Buy more ${asset.name}`)}
                        >
                          Buy
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info(`Sell ${asset.name}`)}
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Portfolio Growth</CardTitle>
              <CardDescription>Historical portfolio value</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Portfolio Value']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Returns</CardTitle>
                <CardDescription>Performance by month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioData.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Return']} />
                    <Bar dataKey="return" fill="#3b82f6" name="Monthly Return">
                      {portfolioData.monthlyPerformance.map((entry, index) => (
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Key portfolio metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-medium text-green-500">+30.32%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Year-to-Date</span>
                    <span className="font-medium text-green-500">+19.21%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">30-Day Return</span>
                    <span className="font-medium text-green-500">+11.83%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Annualized Return</span>
                    <span className="font-medium text-green-500">+24.18%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium">1.92</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium text-red-500">-8.40%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Recent Trades</CardTitle>
                  <CardDescription>Latest trading activity</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 bg-muted p-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Asset</div>
                  <div>Type</div>
                  <div>Quantity</div>
                  <div>Price</div>
                  <div>Value</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {portfolioData.trades.map((trade) => (
                    <div key={trade.id} className="grid grid-cols-7 p-3 text-sm">
                      <div>{trade.date}</div>
                      <div className="font-medium">{trade.asset}</div>
                      <div className={trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                        {trade.type}
                      </div>
                      <div>{trade.quantity}</div>
                      <div>{formatCurrency(trade.price)}</div>
                      <div>{formatCurrency(trade.value)}</div>
                      <div>
                        <Badge variant={trade.status === 'COMPLETED' ? 'outline' : 'secondary'}>
                          {trade.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExportPortfolio}>
          <Download className="h-4 w-4 mr-2" />
          Export Portfolio Data
        </Button>
      </div>
    </div>
  );
};

export default Portfolio;

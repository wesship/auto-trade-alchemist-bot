
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchModelById, generateTradeSignals, executeTradeAction } from "@/services/tradingService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftIcon, Brain, BarChart3, TrendingUp, Activity, Clock, ArrowUpIcon, ArrowDownIcon, DollarSign } from "lucide-react";
import { TradeSignal, TradeExecution } from "@/types/trading";
import { toast } from "sonner";
import PriceChart from "@/components/Dashboard/PriceChart";

const ModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("10");
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [generatedSignals, setGeneratedSignals] = useState<TradeSignal[]>([]);

  const { data: model, isLoading, error } = useQuery({
    queryKey: ["model", modelId],
    queryFn: () => fetchModelById(modelId || ""),
    enabled: !!modelId,
  });

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-6 flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-80 bg-card rounded-lg border border-border mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-60 bg-card rounded-lg border border-border"></div>
            <div className="h-60 bg-card rounded-lg border border-border"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="container max-w-7xl mx-auto p-6 flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold">Error loading model</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Model not found"}
        </p>
        <Button onClick={() => navigate("/models")}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>
    );
  }

  const handleGenerateSignals = async () => {
    setIsGeneratingSignals(true);
    try {
      const signals = await generateTradeSignals(model.config.id, selectedSymbol);
      setGeneratedSignals(signals);
      toast.success(`Generated ${signals.length} trading signals for ${selectedSymbol}`);
    } catch (error) {
      toast.error(`Failed to generate signals: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGeneratingSignals(false);
    }
  };

  const handleExecuteTrade = async (action: 'BUY' | 'SELL') => {
    setIsExecutingTrade(true);
    try {
      const trade = await executeTradeAction(
        model.config.id,
        selectedSymbol,
        action,
        parseInt(quantity)
      );
      toast.success(`Successfully executed ${action} trade for ${trade.quantity} ${trade.symbol} at $${trade.price}`);
    } catch (error) {
      toast.error(`Failed to execute trade: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsExecutingTrade(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => navigate("/models")} className="mr-4">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Brain className="mr-2 h-6 w-6 text-primary" />
              {model.config.name}
            </h1>
            <p className="text-muted-foreground">{model.config.description}</p>
          </div>
        </div>
        <Badge variant={model.config.status === "ready" ? "outline" : "default"} className="capitalize">
          {model.config.status === "training" ? (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-primary mr-1.5 animate-pulse-glow"></span>
              Training
            </span>
          ) : model.config.status}
        </Badge>
      </div>

      <PriceChart defaultSymbol={selectedSymbol} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Model Performance
            </CardTitle>
            <CardDescription>
              Trading performance metrics and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {model.performance ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Total Trades</div>
                  <div className="text-2xl font-semibold terminal-value">{model.performance.totalTrades}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Win Rate</div>
                  <div className="text-2xl font-semibold terminal-value">{(model.performance.winRate * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Profit Factor</div>
                  <div className="text-2xl font-semibold terminal-value">{model.performance.profitFactor}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Avg Return</div>
                  <div className="text-2xl font-semibold terminal-value">{model.performance.averageReturn}%</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Sharpe Ratio</div>
                  <div className="text-2xl font-semibold terminal-value">{model.performance.sharpeRatio}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="text-muted-foreground text-sm mb-1">Max Drawdown</div>
                  <div className="text-2xl font-semibold terminal-value text-tradingRed-500">{model.performance.maxDrawdown}%</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No performance data available. Train the model to generate performance metrics.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Generate Signals
            </CardTitle>
            <CardDescription>
              Create new trading signals using this model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Select Asset</label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                    <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                    <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                    <SelectItem value="NVDA">NVDA - NVIDIA Corp</SelectItem>
                    <SelectItem value="MSFT">MSFT - Microsoft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Trade Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleExecuteTrade('BUY')} 
                  className="flex-1 bg-tradingGreen-600 hover:bg-tradingGreen-700"
                  disabled={isExecutingTrade || model.config.status !== "ready"}
                >
                  <ArrowUpIcon className="mr-1.5 h-4 w-4" />
                  Buy
                </Button>
                <Button 
                  onClick={() => handleExecuteTrade('SELL')} 
                  className="flex-1 bg-tradingRed-600 hover:bg-tradingRed-700"
                  disabled={isExecutingTrade || model.config.status !== "ready"}
                >
                  <ArrowDownIcon className="mr-1.5 h-4 w-4" />
                  Sell
                </Button>
              </div>
              
              <Button 
                onClick={handleGenerateSignals} 
                disabled={isGeneratingSignals || model.config.status !== "ready"}
                className="w-full"
              >
                <TrendingUp className="mr-1.5 h-4 w-4" />
                Generate Signals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="signals" className="w-full">
        <TabsList>
          <TabsTrigger value="signals">Trade Signals</TabsTrigger>
          <TabsTrigger value="executions">Trade Executions</TabsTrigger>
          <TabsTrigger value="config">Model Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Signals</CardTitle>
              <CardDescription>
                Trading signals generated by this model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Symbol</th>
                      <th className="text-left py-3 px-4">Timestamp</th>
                      <th className="text-left py-3 px-4">Action</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Confidence</th>
                      <th className="text-left py-3 px-4">Reasoning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(generatedSignals.length > 0 ? generatedSignals : model.recentSignals).map((signal, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{signal.symbol}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDate(signal.timestamp)}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={`${
                              signal.action === 'BUY' 
                                ? 'text-tradingGreen-500 border-tradingGreen-500/30' 
                                : signal.action === 'SELL' 
                                ? 'text-tradingRed-500 border-tradingRed-500/30' 
                                : ''
                            }`}
                          >
                            {signal.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 terminal-value">${signal.price.toLocaleString()}</td>
                        <td className="py-3 px-4">{(signal.confidence * 100).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{signal.reasoning}</td>
                      </tr>
                    ))}
                    {model.recentSignals.length === 0 && generatedSignals.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No signals available. Generate signals using the panel on the right.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="executions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Executions</CardTitle>
              <CardDescription>
                Trades executed using this model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Symbol</th>
                      <th className="text-left py-3 px-4">Timestamp</th>
                      <th className="text-left py-3 px-4">Action</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.recentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{trade.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDate(trade.timestamp)}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={`${
                              trade.action === 'BUY' 
                                ? 'text-tradingGreen-500 border-tradingGreen-500/30' 
                                : 'text-tradingRed-500 border-tradingRed-500/30'
                            }`}
                          >
                            {trade.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 terminal-value">${trade.price.toLocaleString()}</td>
                        <td className="py-3 px-4">{trade.quantity}</td>
                        <td className="py-3 px-4 terminal-value">${trade.value.toLocaleString()}</td>
                      </tr>
                    ))}
                    {model.recentTrades.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No trades have been executed with this model yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Technical specifications and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Model Type</h3>
                  <p className="flex items-center">
                    <Brain className="mr-2 h-4 w-4 text-primary" />
                    {model.config.modelType}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeframe</h3>
                  <p className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {model.config.timeframe}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Lookback Period</h3>
                  <p>{model.config.lookbackPeriod} periods</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Prediction Horizon</h3>
                  <p>{model.config.predictionHorizon} periods</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Trained</h3>
                  <p>{model.config.lastTrained ? new Date(model.config.lastTrained).toLocaleString() : "Never"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Accuracy</h3>
                  <p>{model.config.accuracy ? `${(model.config.accuracy * 100).toFixed(1)}%` : "N/A"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {model.config.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="capitalize">
                        {feature.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelDetail;


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookmarkCheck, Export, Code, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategyExporter } from "@/components/Strategy/StrategyExporter";

// Mock data for saved strategies
const savedStrategies = [
  {
    id: "s1",
    name: "Golden Cross EMA",
    description: "A classic golden cross strategy using exponential moving averages",
    code: "//@version=5\nstrategy(\"Golden Cross EMA\", overlay=true)\n\n// Parameters\nfastLength = 20\nslowLength = 50\n\n// Calculations\nfastEMA = ta.ema(close, fastLength)\nslowEMA = ta.ema(close, slowLength)\n\n// Entry conditions\nlongCondition = ta.crossover(fastEMA, slowEMA)\nshortCondition = ta.crossunder(fastEMA, slowEMA)\n\n// Execute strategy\nif (longCondition)\n    strategy.entry(\"Long\", strategy.long)\n\nif (shortCondition)\n    strategy.close(\"Long\")\n\n// Plot indicators\nplot(fastEMA, \"Fast EMA\", color=color.blue)\nplot(slowEMA, \"Slow EMA\", color=color.red)",
    complexity: "medium",
    type: "Trend Following",
    createdAt: "2025-03-28T14:30:00Z",
    performanceMetrics: {
      winRate: 0.68,
      profitFactor: 1.85,
      sharpRatio: 1.42
    },
    tags: ["EMA", "Cross", "Trend"]
  },
  {
    id: "s2",
    name: "RSI Reversal Strategy",
    description: "Buys on oversold conditions and sells on overbought",
    code: "//@version=5\nstrategy(\"RSI Reversal\", overlay=true)\n\n// Parameters\nrsiLength = 14\noversold = 30\noverbought = 70\n\n// Calculations\nrsiValue = ta.rsi(close, rsiLength)\n\n// Entry conditions\nlongCondition = ta.crossover(rsiValue, oversold)\nshortCondition = ta.crossunder(rsiValue, overbought)\n\n// Execute strategy\nif (longCondition)\n    strategy.entry(\"Long\", strategy.long)\n\nif (shortCondition)\n    strategy.close(\"Long\")\n\n// Plot indicator\nhline(oversold, \"Oversold\", color=color.green)\nhline(overbought, \"Overbought\", color=color.red)",
    complexity: "easy",
    type: "Mean Reversion",
    createdAt: "2025-04-01T09:12:00Z",
    performanceMetrics: {
      winRate: 0.52,
      profitFactor: 1.3,
      sharpRatio: 0.98
    },
    tags: ["RSI", "Oscillator", "Reversal"]
  },
  {
    id: "s3",
    name: "MACD Histogram Strategy",
    description: "Uses MACD histogram to identify momentum shifts",
    code: "//@version=5\nstrategy(\"MACD Histogram\", overlay=false)\n\n// Parameters\nfastLength = 12\nslowLength = 26\nsignalLength = 9\n\n// Calculations\n[macdLine, signalLine, histLine] = ta.macd(close, fastLength, slowLength, signalLength)\n\n// Entry conditions\nlongCondition = ta.crossover(histLine, 0)\nshortCondition = ta.crossunder(histLine, 0)\n\n// Execute strategy\nif (longCondition)\n    strategy.entry(\"Long\", strategy.long)\n\nif (shortCondition)\n    strategy.close(\"Long\")\n\n// Plot indicators\nplot(macdLine, \"MACD Line\", color=color.blue)\nplot(signalLine, \"Signal Line\", color=color.red)\nplot(histLine, \"Histogram\", color=histLine >= 0 ? color.green : color.red, style=plot.style_histogram)",
    complexity: "medium",
    type: "Momentum",
    createdAt: "2025-04-02T17:45:00Z",
    performanceMetrics: {
      winRate: 0.61,
      profitFactor: 1.56,
      sharpRatio: 1.12
    },
    tags: ["MACD", "Momentum", "Histogram"]
  }
];

const StrategyLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: "",
    description: "",
    type: "Trend Following",
    complexity: "medium",
    code: ""
  });

  // Filter strategies based on search query and category
  const filteredStrategies = savedStrategies.filter(strategy => {
    const matchesSearch = 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === "all" || strategy.type.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleExportStrategy = (strategy) => {
    setIsExporting(true);
    
    // Simulate exporting
    setTimeout(() => {
      setIsExporting(false);
      
      // Create a Blob containing the strategy code
      const blob = new Blob([strategy.code], { type: 'text/plain' });
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${strategy.name.replace(/\s+/g, '_')}.pine`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Strategy exported successfully", {
        description: `${strategy.name} has been exported as a Pine Script file`
      });
    }, 1000);
  };
  
  const handleAddStrategy = () => {
    // Validate fields
    if (!newStrategy.name || !newStrategy.code) {
      toast.error("Required fields missing", {
        description: "Strategy name and code are required"
      });
      return;
    }
    
    // In a real app, we would save this to a database
    toast.success("Strategy saved successfully", {
      description: "Your strategy has been added to the library"
    });
    
    setShowAddDialog(false);
    
    // Reset form
    setNewStrategy({
      name: "",
      description: "",
      type: "Trend Following",
      complexity: "medium",
      code: ""
    });
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BookmarkCheck className="mr-2 h-6 w-6 text-primary" />
            Strategy Library
          </h1>
          <p className="text-muted-foreground">
            Save and manage your favorite trading strategies
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Strategy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Strategy</DialogTitle>
              <DialogDescription>
                Create a new trading strategy to add to your library
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newStrategy.type}
                  onValueChange={(value) => setNewStrategy({...newStrategy, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trend Following">Trend Following</SelectItem>
                    <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                    <SelectItem value="Momentum">Momentum</SelectItem>
                    <SelectItem value="Breakout">Breakout</SelectItem>
                    <SelectItem value="Volatility">Volatility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complexity" className="text-right">
                  Complexity
                </Label>
                <Select 
                  value={newStrategy.complexity}
                  onValueChange={(value) => setNewStrategy({...newStrategy, complexity: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="code" className="text-right pt-2">
                  Pine Script
                </Label>
                <Textarea
                  id="code"
                  value={newStrategy.code}
                  onChange={(e) => setNewStrategy({...newStrategy, code: e.target.value})}
                  className="col-span-3 font-mono text-sm h-64"
                  placeholder="//@version=5\nstrategy(\"My Strategy\", overlay=true)\n\n// Add your strategy code here"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddStrategy}>Save Strategy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="trend following">Trend Following</SelectItem>
              <SelectItem value="mean reversion">Mean Reversion</SelectItem>
              <SelectItem value="momentum">Momentum</SelectItem>
              <SelectItem value="breakout">Breakout</SelectItem>
              <SelectItem value="volatility">Volatility</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <p className="text-sm text-muted-foreground">
            {filteredStrategies.length} strategies found
          </p>
        </div>
        
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{strategy.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {strategy.description}
                      </CardDescription>
                    </div>
                    <Badge className="capitalize">
                      {strategy.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-0 flex-grow">
                  <div className="text-xs font-mono bg-muted/50 p-3 rounded-md overflow-hidden h-36 relative">
                    <pre className="text-xs leading-relaxed overflow-hidden">
                      {strategy.code.slice(0, 350)}
                      {strategy.code.length > 350 && "..."}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {strategy.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-5">
                  <Button variant="outline" onClick={() => handleExportStrategy(strategy)}>
                    <Export className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Code className="h-4 w-4 mr-2" />
                    View Code
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredStrategies.map((strategy) => (
              <div key={strategy.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{strategy.name}</h3>
                      <Badge className="capitalize">{strategy.complexity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {strategy.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {strategy.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 md:self-end">
                    <Button variant="outline" onClick={() => handleExportStrategy(strategy)}>
                      <Export className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <Code className="h-4 w-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyLibrary;

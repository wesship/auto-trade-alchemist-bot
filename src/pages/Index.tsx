
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, BarChart3, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl text-center">
        <div className="flex justify-center mb-6">
          <div className="relative size-16 flex items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Trading Algorithmic Platform</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Advanced machine learning algorithms for market prediction and automated trading strategies
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button asChild size="lg" className="gap-2">
            <Link to="/dashboard">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/models">
              <Brain className="h-5 w-5" />
              AI Models
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-medium mb-2">Predictive Analysis</h3>
            <p className="text-sm text-muted-foreground">Advanced market forecasting with ML algorithms</p>
          </div>
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-medium mb-2">Strategy Optimization</h3>
            <p className="text-sm text-muted-foreground">Auto-tuning of trade parameters for optimal returns</p>
          </div>
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-medium mb-2">Risk Management</h3>
            <p className="text-sm text-muted-foreground">Intelligent stop-loss and position sizing</p>
          </div>
        </div>
        
        <div className="mt-12 text-muted-foreground">
          <p className="text-sm">
            2025 © AI Trading Platform - All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

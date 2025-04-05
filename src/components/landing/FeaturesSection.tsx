
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3, Brain } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const FeaturesSection = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-12 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Powered by Advanced AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] hover:bg-primary/5">
                <CardContent className="p-0">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Predictive Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">Advanced market forecasting with ML algorithms</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Predictive Analysis</h4>
                <p className="text-sm">
                  Our predictive models use time-series analysis, sentiment analysis, and pattern recognition to forecast market movements with up to 78% accuracy.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] hover:bg-primary/5">
                <CardContent className="p-0">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Strategy Optimization
                  </h3>
                  <p className="text-sm text-muted-foreground">Auto-tuning of trade parameters for optimal returns</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Strategy Optimization</h4>
                <p className="text-sm">
                  Our platform continuously optimizes your trading strategies based on market conditions, using reinforcement learning to improve performance over time.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] hover:bg-primary/5">
                <CardContent className="p-0">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Risk Management
                  </h3>
                  <p className="text-sm text-muted-foreground">Intelligent stop-loss and position sizing</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Risk Management</h4>
                <p className="text-sm">
                  Protect your investments with dynamic risk management that adapts to market volatility and adjusts position sizes automatically.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Brain,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Mail,
  MoonStar,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Hedge Fund Manager",
    content: "The predictive algorithms have given us a significant edge in the market. Our returns have increased by 28% since implementation.",
    avatar: "AT"
  },
  {
    name: "Sarah Chen",
    role: "Day Trader",
    content: "The risk management features alone are worth the investment. I've been able to minimize losses while maximizing gains.",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Financial Analyst",
    content: "The accuracy of the market predictions continues to impress me. This platform is revolutionizing how we approach algorithmic trading.",
    avatar: "MR"
  }
];

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center bg-background p-4 md:p-8 lg:p-12 relative overflow-hidden">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </Button>
        </div>

        <div className="max-w-3xl text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="relative size-16 flex items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Trading Algorithmic Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Advanced machine learning algorithms for market prediction and automated trading strategies
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild size="lg" className="gap-2 transition-transform hover:scale-105">
              <Link to="/dashboard">
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 transition-transform hover:scale-105">
              <Link to="/models">
                <Brain className="h-5 w-5" />
                AI Models
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-4 md:px-8 lg:px-12 py-12 bg-accent/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Powered by Advanced AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
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
                <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
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
                <Card className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
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

      {/* Testimonials Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          
          <div className="relative mx-auto max-w-3xl px-8">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-card p-6 rounded-lg border text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {testimonial.avatar}
                        </div>
                      </div>
                      <p className="mb-4 italic text-card-foreground">"{testimonial.content}"</p>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12 bg-accent/5">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">Get the latest trading insights and platform updates</p>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input type="email" placeholder="Enter your email" className="w-full" />
            </div>
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 text-muted-foreground">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            2025 © AI Trading Platform - All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

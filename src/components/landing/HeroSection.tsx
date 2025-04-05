
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Brain, MoonStar, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const HeroSection = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Make sure the component is mounted before rendering theme-dependent elements
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
      
      {/* Floating elements animation */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              opacity: 0.1 + Math.random() * 0.1,
            }}
          />
        ))}
      </div>

      {/* Theme Toggle with improved button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="transition-all duration-300 hover:scale-110"
        >
          {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>

      <div className="max-w-3xl text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="relative size-16 flex items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in">
          AI Trading Algorithmic Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Advanced machine learning algorithms for market prediction and automated trading strategies
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button asChild size="lg" className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link to="/dashboard">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link to="/models">
              <Brain className="h-5 w-5" />
              AI Models
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

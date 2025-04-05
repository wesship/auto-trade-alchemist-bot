
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/components/theme-provider';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 1450 },
  { name: 'Wed', value: 1330 },
  { name: 'Thu', value: 1600 },
  { name: 'Fri', value: 1700 },
];

const backgroundStyle = {
  backgroundImage: "url('/images/trading-floor.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen font-mono ${theme === 'dark' ? 'bg-background' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="glass-morphism p-10 rounded-2xl text-center relative z-10 mx-4 max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative size-16 flex items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Auto-Trade Alchemist Bot
          </h1>
          <p className="text-lg mb-6 text-white">Wall Street AI Power In Your Pocket</p>
          <Button asChild size="lg" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl">
            <Link to="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Performance Dashboard */}
      <section className="px-4 py-12 md:p-10 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Bot Performance Overview</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'hsl(var(--background))' : 'white', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What Our Traders Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "This bot transformed my trading — I went from guessing to gaining!",
                user: "Alex Thompson, Hedge Fund Manager"
              },
              {
                text: "The predictive algorithms have given us a significant edge in the market. Our returns have increased by 28% since implementation.",
                user: "Sarah Chen, Day Trader"
              },
              {
                text: "The accuracy of the market predictions continues to impress me. This platform is revolutionizing how we approach algorithmic trading.",
                user: "Michael Rodriguez, Financial Analyst"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-card border-border h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <p className="text-md flex-grow">{`"${testimonial.text}"`}</p>
                  <span className="block text-sm text-muted-foreground mt-4">— {testimonial.user}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground text-center py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Automating Your Trades Now</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of traders who are leveraging AI to optimize their investments
          </p>
          <Button asChild size="lg" variant="secondary" className="px-8 py-4 text-lg rounded-xl hover:bg-secondary/90">
            <Link to="/dashboard">
              Join The Revolution
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-foreground font-bold mb-4">Auto-Trade Alchemist</h3>
              <p className="text-sm">
                Advanced machine learning algorithms for market prediction and automated trading strategies
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-bold mb-4">Important Links</h3>
              <ul className="text-sm space-y-2">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/models" className="hover:text-primary transition-colors">AI Models</Link></li>
                <li><Link to="/chatbot" className="hover:text-primary transition-colors">Trading Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground font-bold mb-4">Legal</h3>
              <p className="text-sm">
                Disclaimer: Trading involves risk. Past performance is not indicative of future results.
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-sm text-center">
            <p>© 2025 Auto-Trade Alchemist Bot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

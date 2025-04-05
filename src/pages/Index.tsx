
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/components/theme-provider';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const performanceData = [
  { month: 'Sep', value: 42 },
  { month: 'Oct', value: 47 },
  { month: 'Nov', value: 43 },
  { month: 'Dec', value: 49 },
  { month: 'Jan', value: 52 },
  { month: 'Feb', value: 56 },
  { month: 'Mar', value: 60 },
  { month: 'Apr', value: 59 },
  { month: 'May', value: 62 },
  { month: 'Jun', value: 68 },
];

const backgroundStyle = {
  backgroundImage: "url('/lovable-uploads/848586d2-ddcf-44fd-8ebe-fe94e2e8bd4e.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen font-mono ${theme === 'dark' ? 'bg-black' : 'bg-gray-900'}`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white">
            AUTOMATE YOUR FINANCIAL <br />JOURNEY LIKE WALL STREET PRO
          </h1>
          <p className="text-xl text-emerald-400 mb-10">
            Tap into AI-powered trading & market intelligence
          </p>
          
          <Button 
            asChild 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-6 rounded-full text-lg"
          >
            <Link to="/dashboard">
              GET STARTED
            </Link>
          </Button>

          <div className="mt-16 p-4 border border-emerald-600/50 rounded-full bg-black/50 backdrop-blur-sm text-emerald-400 max-w-2xl mx-auto flex items-center">
            <span>Dow hits new high, tech stocks down, oil prices up</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </div>

        {/* Recent Performance Section */}
        <div className="w-full max-w-6xl mx-auto mt-24 px-4 z-10 relative">
          <h2 className="text-3xl font-bold text-emerald-400 mb-8">Recent Performance</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/60 border-emerald-600/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-2 text-gray-400">Past month</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <XAxis 
                      dataKey="month" 
                      stroke="#4ade80" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#4ade80" 
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                      hide
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4ade80" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-emerald-600/30 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">+17.5%</p>
                    <p className="text-gray-400">Total Return</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">105</p>
                    <p className="text-gray-400">Trades</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">72%</p>
                    <p className="text-gray-400">Win Rate</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-emerald-400 font-medium">WHAT MAKES OUR TRADING BOT SMART?</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Makes Our Trading Bot Smart Section */}
        <div className="w-full max-w-6xl mx-auto mt-16 px-4 pb-16 z-10 relative">
          <h2 className="text-3xl font-bold text-emerald-400 mb-8">WHAT MAKES OUR TRADING BOT SMART?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Richard F.",
                image: "/placeholder.svg",
                text: "The bot has significantly improved my trading results. Highly recommend.",
              },
              {
                name: "Sarah M.",
                image: "/placeholder.svg",
                text: "I've been impressed with the consistent returns. Great tool!",
              },
              {
                name: "James T.",
                image: "/placeholder.svg",
                text: "A game changer for my investment strategy. Reliable and efficient.",
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-black/60 border-emerald-600/30 backdrop-blur-sm h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white">{testimonial.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 flex-grow">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-6 rounded-full text-lg"
            >
              <Link to="/dashboard">
                START AUTO-TRADING NOW
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 text-center text-gray-500">
            © 2025 Auto-Trade Alchemist Bot. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

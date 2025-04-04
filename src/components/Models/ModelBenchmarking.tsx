
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ModelBenchmarkingProps {
  modelId: string;
  modelName: string;
}

// Mock data for model vs benchmarks
const mockTimeseriesData = [
  { month: 'Jan', model: 2.3, sp500: 1.8, buyhold: 1.5, randomForest: 1.9 },
  { month: 'Feb', model: 1.7, sp500: 0.9, buyhold: 0.7, randomForest: 1.2 },
  { month: 'Mar', model: 3.4, sp500: 2.1, buyhold: 1.8, randomForest: 2.6 },
  { month: 'Apr', model: -0.8, sp500: -1.2, buyhold: -1.5, randomForest: -1.1 },
  { month: 'May', model: 2.1, sp500: 1.5, buyhold: 1.2, randomForest: 1.6 },
  { month: 'Jun', model: 4.3, sp500: 2.4, buyhold: 2.0, randomForest: 3.1 },
  { month: 'Jul', model: 3.2, sp500: 2.2, buyhold: 1.8, randomForest: 2.4 },
  { month: 'Aug', model: 1.9, sp500: 1.3, buyhold: 1.1, randomForest: 1.4 },
  { month: 'Sep', model: 4.8, sp500: 2.7, buyhold: 2.2, randomForest: 3.5 },
  { month: 'Oct', model: 5.2, sp500: 3.1, buyhold: 2.5, randomForest: 3.8 },
  { month: 'Nov', model: 3.7, sp500: 2.3, buyhold: 1.9, randomForest: 2.8 },
  { month: 'Dec', model: 4.9, sp500: 2.9, buyhold: 2.4, randomForest: 3.6 },
];

const mockKeyMetrics = [
  { name: 'Annual Return', model: 36.7, sp500: 22.2, buyhold: 18.4, randomForest: 26.9 },
  { name: 'Sharpe Ratio', model: 1.95, sp500: 1.45, buyhold: 1.22, randomForest: 1.58 },
  { name: 'Max Drawdown', model: -8.2, sp500: -12.6, buyhold: -14.8, randomForest: -10.3 },
  { name: 'Win Rate', model: 67.5, sp500: 58.3, buyhold: 54.2, randomForest: 61.7 },
];

const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const ModelBenchmarking: React.FC<ModelBenchmarkingProps> = ({ modelId, modelName }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{modelName} Benchmarking</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Performance vs. Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeseriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="model" 
                  name={modelName} 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  name="S&P 500" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="buyhold" 
                  name="Buy & Hold" 
                  stroke="#ffc658" 
                />
                <Line 
                  type="monotone" 
                  dataKey="randomForest" 
                  name="Random Forest" 
                  stroke="#ff8042" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Key Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={mockKeyMetrics} 
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}${value === mockKeyMetrics[2].model ? '%' : ''}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "Max Drawdown") return [`${value}%`, name];
                      if (name === "Win Rate") return [`${value}%`, name];
                      return [value, name];
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="model" name={modelName} fill={COLORS[0]} />
                  <Bar dataKey="sp500" name="S&P 500" fill={COLORS[1]} />
                  <Bar dataKey="buyhold" name="Buy & Hold" fill={COLORS[2]} />
                  <Bar dataKey="randomForest" name="Random Forest" fill={COLORS[3]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="text-base font-medium flex items-center">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                Overall Performance
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {modelName} outperforms all benchmarks with a {mockKeyMetrics[0].model}% annual return, 
                {' '}{mockKeyMetrics[0].model - mockKeyMetrics[0].sp500}% higher than the S&P 500.
              </p>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="text-base font-medium flex items-center">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                Risk-Adjusted Return (Sharpe Ratio)
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {modelName} achieves a Sharpe Ratio of {mockKeyMetrics[1].model.toFixed(2)}, showing superior 
                risk-adjusted returns compared to all benchmark strategies.
              </p>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="text-base font-medium flex items-center">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                Drawdown & Win Rate
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {modelName} maintains the lowest maximum drawdown ({mockKeyMetrics[2].model}%) and highest win rate ({mockKeyMetrics[3].model}%),
                indicating better risk management and trade consistency.
              </p>
            </div>
            
            <div className="rounded-md border p-4 bg-primary/5">
              <div className="text-base font-medium">Conclusion</div>
              <p className="text-sm mt-2">
                {modelName} consistently outperforms traditional benchmarks and other machine learning models
                across all key performance metrics, demonstrating its superior market prediction capabilities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelBenchmarking;

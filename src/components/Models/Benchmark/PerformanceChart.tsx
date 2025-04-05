
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { MetricDataPoint } from './types';

interface PerformanceChartProps {
  data: MetricDataPoint[];
  modelName: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, modelName }) => {
  return (
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
            <LineChart data={data}>
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
  );
};

export default PerformanceChart;

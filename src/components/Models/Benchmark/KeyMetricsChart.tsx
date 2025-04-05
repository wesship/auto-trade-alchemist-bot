
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KeyMetric } from './types';

interface KeyMetricsChartProps {
  data: KeyMetric[];
  modelName: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const KeyMetricsChart: React.FC<KeyMetricsChartProps> = ({ data, modelName }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Key Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `${value}${value === data[2].model ? '%' : ''}`} />
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
  );
};

export default KeyMetricsChart;

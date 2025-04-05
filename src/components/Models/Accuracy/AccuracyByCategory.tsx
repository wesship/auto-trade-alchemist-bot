
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, ResponsiveContainer } from 'recharts';
import { AccuracyByCategory as AccuracyByCategoryType } from './types';

// Mock data - in a real app this would be passed as props or fetched
const mockAccuracyByMarket: AccuracyByCategoryType[] = [
  { name: 'S&P 500', value: 87 },
  { name: 'NASDAQ', value: 83 },
  { name: 'Forex', value: 78 },
  { name: 'Crypto', value: 72 },
  { name: 'Commodities', value: 81 },
];

const mockAccuracyByStrategyType: AccuracyByCategoryType[] = [
  { name: 'Trend Following', value: 85 },
  { name: 'Mean Reversion', value: 78 },
  { name: 'Breakout', value: 82 },
  { name: 'Momentum', value: 79 },
  { name: 'Volatility', value: 76 },
];

const mockAccuracyByVolatility: AccuracyByCategoryType[] = [
  { name: 'Low', value: 89 },
  { name: 'Medium', value: 82 },
  { name: 'High', value: 71 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface CategoryVisualizationProps {
  data: AccuracyByCategoryType[];
}

export const CategoryVisualization: React.FC<CategoryVisualizationProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
            <Bar dataKey="value" name="Accuracy">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const AccuracyByMarket: React.FC = () => (
  <Card>
    <CardContent className="pt-6">
      <CategoryVisualization data={mockAccuracyByMarket} />
    </CardContent>
  </Card>
);

export const AccuracyByStrategy: React.FC = () => (
  <Card>
    <CardContent className="pt-6">
      <CategoryVisualization data={mockAccuracyByStrategyType} />
    </CardContent>
  </Card>
);

export const AccuracyByVolatility: React.FC = () => (
  <Card>
    <CardContent className="pt-6">
      <CategoryVisualization data={mockAccuracyByVolatility} />
    </CardContent>
  </Card>
);

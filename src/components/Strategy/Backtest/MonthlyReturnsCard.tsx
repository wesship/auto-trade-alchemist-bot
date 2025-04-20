
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MonthlyReturnsCardProps {
  monthlyReturns: Array<{
    month: string;
    return: number;
  }>;
}

const MonthlyReturnsCard: React.FC<MonthlyReturnsCardProps> = ({ monthlyReturns }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Returns</CardTitle>
        <CardDescription>Return by month</CardDescription>
      </CardHeader>
      <CardContent className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyReturns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Return']} />
            <Bar dataKey="return" fill="#4caf50">
              {monthlyReturns.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={parseFloat(entry.return.toString()) >= 0 ? "#4caf50" : "#ff5252"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyReturnsCard;

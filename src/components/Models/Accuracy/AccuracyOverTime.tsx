
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricOverTime } from './types';

// Mock data - in a real app this would be passed as props or fetched
const mockDataOverTime: MetricOverTime[] = [
  { month: 'Jan', accuracy: 62, precision: 58, recall: 65 },
  { month: 'Feb', accuracy: 65, precision: 60, recall: 63 },
  { month: 'Mar', accuracy: 67, precision: 63, recall: 67 },
  { month: 'Apr', accuracy: 70, precision: 65, recall: 72 },
  { month: 'May', accuracy: 71, precision: 68, recall: 70 },
  { month: 'Jun', accuracy: 75, precision: 72, recall: 76 },
  { month: 'Jul', accuracy: 78, precision: 75, recall: 74 },
  { month: 'Aug', accuracy: 76, precision: 73, recall: 77 },
  { month: 'Sep', accuracy: 80, precision: 77, recall: 80 },
  { month: 'Oct', accuracy: 82, precision: 80, recall: 81 },
  { month: 'Nov', accuracy: 85, precision: 83, recall: 84 },
  { month: 'Dec', accuracy: 87, precision: 84, recall: 85 },
];

export const AccuracyOverTime: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Accuracy Metrics Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockDataOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                name="Accuracy" 
                stroke="#8884d8" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="precision" 
                name="Precision" 
                stroke="#82ca9d" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="recall" 
                name="Recall" 
                stroke="#ffc658" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

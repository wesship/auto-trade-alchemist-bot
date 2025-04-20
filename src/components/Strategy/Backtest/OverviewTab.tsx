
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookmarkCheck, Download, Share } from "lucide-react";
import PerformanceSummary from './PerformanceSummary';
import MonthlyReturnsCard from './MonthlyReturnsCard';
import { formatCurrency } from './utils';

interface OverviewTabProps {
  performance: {
    netProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
  };
  monthlyReturns: Array<{ month: string; return: number }>;
  equityCurve: Array<{ date: string; equity: number }>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  performance,
  monthlyReturns,
  equityCurve
}) => {
  const handleSaveStrategy = () => {
    console.log("Strategy saved");
  };
  
  const handleExportResults = () => {
    console.log("Results exported");
  };
  
  const handleShareStrategy = () => {
    console.log("Strategy shared");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceSummary performance={performance} />
        <MonthlyReturnsCard monthlyReturns={monthlyReturns} />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Equity Curve</CardTitle>
          <CardDescription>Account equity over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Equity']} />
              <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveStrategy}
          className="hover:bg-primary/10"
        >
          <BookmarkCheck className="h-4 w-4 mr-2" />
          Save Strategy
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShareStrategy}
          className="hover:bg-primary/10"
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportResults}
          className="hover:bg-primary/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>
    </div>
  );
};

export default OverviewTab;

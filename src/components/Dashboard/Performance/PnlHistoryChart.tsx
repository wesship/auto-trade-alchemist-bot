
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { PnlHistoryChartProps } from "./types";
import { useMemo } from "react";

const PnlHistoryChart = ({ data }: PnlHistoryChartProps) => {
  const hasPnlHistory = data && data.length > 0;

  // Ensure PnL history is sorted by date
  const sortedPnlHistory = useMemo(() => {
    if (!hasPnlHistory) return [];
    
    try {
      return [...data].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Error sorting PnL history:', error);
      return data;
    }
  }, [data, hasPnlHistory]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const date = new Date(label);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        return (
          <div className="bg-card p-3 border border-border rounded-md shadow-md">
            <p className="text-sm font-semibold">{formattedDate}</p>
            <p className={`text-sm ${payload[0].value >= 0 ? 'text-tradingGreen-500' : 'text-tradingRed-500'}`}>
              ${payload[0].value.toLocaleString()}
            </p>
          </div>
        );
      } catch (error) {
        console.error('Error rendering tooltip:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>P&L History</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPnlHistory ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedPnlHistory}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => {
                    try {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    } catch (error) {
                      console.error("Error formatting date:", error);
                      return value;
                    }
                  }}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="pnl" 
                  radius={[4, 4, 0, 0]}
                >
                  {sortedPnlHistory.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.pnl >= 0 ? 'hsl(150, 100%, 45%)' : 'hsl(0, 100%, 45%)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>No performance history data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PnlHistoryChart;

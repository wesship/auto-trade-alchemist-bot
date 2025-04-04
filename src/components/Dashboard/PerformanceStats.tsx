
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, BarChart3, Activity, AlertCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

interface PerformanceStatsProps {
  data: {
    totalPnl: number;
    dailyPnl: number;
    weeklyPnl: number;
    winRate: number;
    totalTrades: number;
    pnlHistory: { date: string; pnl: number }[];
  };
  isLoading?: boolean;
}

const PerformanceStats = ({ data, isLoading = false }: PerformanceStatsProps) => {
  // Data validation
  const isDataValid = useMemo(() => {
    if (!data) return false;
    
    const requiredFields = [
      typeof data.totalPnl === 'number',
      typeof data.dailyPnl === 'number',
      typeof data.winRate === 'number',
      typeof data.totalTrades === 'number',
      Array.isArray(data.pnlHistory)
    ];
    
    // Check if all required fields are available
    const allFieldsAvailable = requiredFields.every(Boolean);
    
    // Additional validation for history data
    const validHistory = data.pnlHistory?.every(item => 
      item && 
      typeof item.date === 'string' && 
      typeof item.pnl === 'number' &&
      !isNaN(item.pnl) && 
      new Date(item.date).toString() !== 'Invalid Date'
    );
    
    return allFieldsAvailable && validHistory;
  }, [data]);

  // Debug info
  useEffect(() => {
    if (!isDataValid && data) {
      console.error('Invalid performance data:', data);
      console.debug('Data validation checks:', {
        hasTotalPnl: typeof data.totalPnl === 'number',
        hasDailyPnl: typeof data.dailyPnl === 'number',
        hasWinRate: typeof data.winRate === 'number',
        hasTotalTrades: typeof data.totalTrades === 'number',
        hasHistory: Array.isArray(data.pnlHistory),
        historyValid: data.pnlHistory?.every(item => 
          item && 
          typeof item.date === 'string' && 
          typeof item.pnl === 'number' &&
          !isNaN(item.pnl) && 
          new Date(item.date).toString() !== 'Invalid Date'
        )
      });
    }
  }, [data, isDataValid]);

  // Notify on significant P&L changes
  useEffect(() => {
    if (isDataValid && Math.abs(data.dailyPnl) > 1000) {
      const isProfitable = data.dailyPnl > 0;
      toast(
        isProfitable ? "Significant profit detected" : "Significant loss detected", 
        { 
          description: `Daily P&L change of $${Math.abs(data.dailyPnl).toLocaleString()}`, 
          duration: 5000,
          icon: isProfitable ? "📈" : "📉",
        }
      );
      
      // Log details for debugging
      console.log("Significant P&L change:", {
        dailyPnl: data.dailyPnl,
        totalPnl: data.totalPnl,
        timestamp: new Date().toISOString()
      });
    }
  }, [data?.dailyPnl, isDataValid]);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isDataValid) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid performance data detected. Please refresh or contact support if this issue persists.
        </AlertDescription>
      </Alert>
    );
  }

  // Check if we have any performance history data
  const hasPnlHistory = data.pnlHistory && data.pnlHistory.length > 0;

  // Ensure PnL history is sorted by date
  const sortedPnlHistory = useMemo(() => {
    if (!hasPnlHistory) return [];
    
    try {
      return [...data.pnlHistory].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Error sorting PnL history:', error);
      return data.pnlHistory;
    }
  }, [data.pnlHistory, hasPnlHistory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${data.totalPnl >= 0 ? 'text-tradingGreen-500' : 'text-tradingRed-500'}`}>
              ${data.totalPnl.toLocaleString()}
            </div>
            {data.totalPnl >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-tradingGreen-500 ml-2" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-tradingRed-500 ml-2" />
            )}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Overall performance
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${data.dailyPnl >= 0 ? 'text-tradingGreen-500' : 'text-tradingRed-500'}`}>
              ${data.dailyPnl.toLocaleString()}
            </div>
            {data.dailyPnl >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-tradingGreen-500 ml-2" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-tradingRed-500 ml-2" />
            )}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Today's performance
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(data.winRate * 100).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground pt-1">
            Success percentage
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTrades}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Trading activity
          </p>
        </CardContent>
      </Card>
      
      {hasPnlHistory ? (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>P&L History</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ) : (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>P&L History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>No performance history data available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceStats;

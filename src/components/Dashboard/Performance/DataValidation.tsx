
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PerformanceStatData } from "./types";

interface DataValidationProps {
  data: PerformanceStatData;
}

const DataValidation = ({ data }: DataValidationProps) => {
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

  return null;
};

export default DataValidation;


import { DollarSign, BarChart3, Activity, TrendingUp } from "lucide-react";
import { PerformanceStatsProps } from "./types";
import StatCard from "./StatCard";
import PnlHistoryChart from "./PnlHistoryChart";
import DataValidation from "./DataValidation";
import LoadingSkeleton from "./LoadingSkeleton";

const PerformanceStats = ({ data, isLoading = false }: PerformanceStatsProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <DataValidation data={data} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total P&L"
          value={data.totalPnl}
          icon={<DollarSign />}
          subtitle="Overall performance"
          isMonetary={true}
        />
        
        <StatCard 
          title="Daily P&L"
          value={data.dailyPnl}
          icon={<TrendingUp />}
          subtitle="Today's performance"
          isMonetary={true}
        />
        
        <StatCard 
          title="Win Rate"
          value={data.winRate}
          icon={<BarChart3 />}
          subtitle="Success percentage"
          isPercentage={true}
        />
        
        <StatCard 
          title="Total Trades"
          value={data.totalTrades}
          icon={<Activity />}
          subtitle="Trading activity"
        />
        
        <PnlHistoryChart data={data.pnlHistory} />
      </div>
    </>
  );
};

export default PerformanceStats;

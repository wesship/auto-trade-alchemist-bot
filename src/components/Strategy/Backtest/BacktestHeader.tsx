
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Play, RefreshCw, ChevronDown } from "lucide-react";

interface BacktestHeaderProps {
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  showStrategyParams: boolean;
  setShowStrategyParams: (show: boolean) => void;
  isRunning: boolean;
  handleRunBacktest: () => void;
}

const timeframeOptions = [
  { label: "1 Month", value: "1M" },
  { label: "3 Months", value: "3M" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
  { label: "All Time", value: "ALL" },
];

const BacktestHeader: React.FC<BacktestHeaderProps> = ({
  selectedTimeframe,
  setSelectedTimeframe,
  showStrategyParams,
  setShowStrategyParams,
  isRunning,
  handleRunBacktest,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Backtest Results</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {selectedTimeframe === "ALL" ? "All Time" : selectedTimeframe}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {timeframeOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => setSelectedTimeframe(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowStrategyParams(!showStrategyParams)}
        >
          {showStrategyParams ? "Hide Parameters" : "Show Parameters"}
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleRunBacktest}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BacktestHeader;

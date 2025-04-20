
import React from "react";
import BacktestVisualization from "@/components/Strategy/BacktestVisualization";

const Backtesting = () => {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Backtesting</h1>
          <p className="text-muted-foreground">
            Test and analyze your trading strategies using historical data
          </p>
        </div>
      </div>
      
      <BacktestVisualization />
    </div>
  );
};

export default Backtesting;

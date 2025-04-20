
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from './utils';

interface Trade {
  id: number;
  date: string;
  type: string;
  entry: number;
  exit: number;
  profit: number;
  profitPercent: number;
}

interface TradesTableProps {
  trades: Trade[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
  };
}

const TradesTable: React.FC<TradesTableProps> = ({ trades, performance }) => {
  const handleShowDetails = (tradeId: number) => {
    console.log(`Details for trade #${tradeId}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trade Statistics</CardTitle>
          <CardDescription>Summary of all trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Trades</p>
              <p className="text-xl font-bold">{performance.totalTrades}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Winning Trades</p>
              <p className="text-xl font-bold text-green-500">{performance.winningTrades}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Losing Trades</p>
              <p className="text-xl font-bold text-red-500">{performance.losingTrades}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Win Rate</p>
              <p className="text-xl font-bold">{(performance.winRate * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trade List</CardTitle>
          <CardDescription>Individual trade details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-7 bg-muted p-3 text-sm font-medium">
              <div>Date</div>
              <div>Type</div>
              <div>Entry</div>
              <div>Exit</div>
              <div>P/L</div>
              <div>P/L %</div>
              <div></div>
            </div>
            <div className="divide-y">
              {trades.map((trade) => (
                <div key={trade.id} className="grid grid-cols-7 p-3 text-sm">
                  <div>{trade.date}</div>
                  <div className={trade.type === 'LONG' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type}
                  </div>
                  <div>${trade.entry.toFixed(2)}</div>
                  <div>${trade.exit.toFixed(2)}</div>
                  <div className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${trade.profit.toFixed(2)}
                  </div>
                  <div className={trade.profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {trade.profitPercent.toFixed(2)}%
                  </div>
                  <div className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShowDetails(trade.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TradesTable;


import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardTitle } from '@/components/ui/card';
import { ChartControlsProps } from './types';

const ChartControls: React.FC<ChartControlsProps> = ({ 
  symbol, 
  setSymbol, 
  timeframe, 
  setTimeframe 
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-xl">Price Chart</CardTitle>
      <div className="flex space-x-2">
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={symbol} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">BTC</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
            <SelectItem value="AAPL">AAPL</SelectItem>
            <SelectItem value="NVDA">NVDA</SelectItem>
          </SelectContent>
        </Select>
        
        <Tabs defaultValue="30d" value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ChartControls;

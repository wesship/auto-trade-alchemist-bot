
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ChartControls from './ChartControls';
import ChartComponent from './ChartComponent';
import { generatePriceData } from './utils';
import { PriceChartProps, PriceDataPoint } from './types';

const PriceChart: React.FC<PriceChartProps> = ({ defaultSymbol = 'BTC' }) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [timeframe, setTimeframe] = useState('30d');
  const [data, setData] = useState<PriceDataPoint[]>([]);
  
  useEffect(() => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    setData(generatePriceData(symbol, days));
  }, [symbol, timeframe]);
  
  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-0">
        <ChartControls 
          symbol={symbol}
          setSymbol={setSymbol}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </CardHeader>
      <CardContent className="p-0 h-[330px]">
        <ChartComponent data={data} symbol={symbol} />
      </CardContent>
    </Card>
  );
};

export default PriceChart;


import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { formatYAxis } from './utils';
import { PriceDataPoint } from './types';

interface ChartComponentProps {
  data: PriceDataPoint[];
  symbol: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, symbol }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickFormatter={(tick) => {
            const date = new Date(tick);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tickFormatter={(value) => formatYAxis(value, symbol)} 
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          domain={['dataMin', 'dataMax']}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorPrice)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;

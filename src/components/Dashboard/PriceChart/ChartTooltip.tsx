
import React from 'react';
import { ChartTooltipProps } from './types';

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 border border-border rounded-md shadow-md">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm terminal-text">${payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Volume: {payload[0].payload.volume.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;

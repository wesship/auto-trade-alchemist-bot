
import React from 'react';
import { Brain } from "lucide-react";
import { MetricsSummaryCards } from './SummaryCards';
import { AccuracyOverTime } from './AccuracyOverTime';
import { AccuracyTabs } from './AccuracyTabs';
import { ModelAccuracyProps } from './types';

const ModelAccuracyDashboard: React.FC<ModelAccuracyProps> = ({ modelId, modelName }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Brain className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{modelName} Accuracy Metrics</h2>
      </div>
      
      <MetricsSummaryCards />
      <AccuracyOverTime />
      <AccuracyTabs />
    </div>
  );
};

export default ModelAccuracyDashboard;

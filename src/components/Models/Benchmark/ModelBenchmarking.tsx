
import React from 'react';
import { BarChart3 } from "lucide-react";
import { ModelBenchmarkingProps } from './types';
import PerformanceChart from './PerformanceChart';
import KeyMetricsChart from './KeyMetricsChart';
import PerformanceSummary from './PerformanceSummary';
import { mockTimeseriesData, mockKeyMetrics } from './mockData';

const ModelBenchmarking: React.FC<ModelBenchmarkingProps> = ({ modelId, modelName }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{modelName} Benchmarking</h2>
      </div>
      
      <PerformanceChart 
        data={mockTimeseriesData} 
        modelName={modelName} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyMetricsChart 
          data={mockKeyMetrics} 
          modelName={modelName} 
        />
        
        <PerformanceSummary 
          modelName={modelName} 
          metrics={mockKeyMetrics} 
        />
      </div>
    </div>
  );
};

export default ModelBenchmarking;

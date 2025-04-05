
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AccuracySummaryCardProps } from "./types";

export const AccuracySummaryCard: React.FC<AccuracySummaryCardProps> = ({ 
  title, value, subtitle, trend 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xl font-bold text-center">{value}</div>
        <div className="text-sm text-muted-foreground text-center">{title}</div>
        <div className="text-xs text-green-500 font-medium text-center mt-1">{trend}</div>
      </CardContent>
    </Card>
  );
};

export const MetricsSummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <AccuracySummaryCard
        title="Overall Accuracy"
        value="87%"
        subtitle="Model performance"
        trend="+5% vs last month"
      />
      <AccuracySummaryCard
        title="Precision"
        value="84%"
        subtitle="True positives"
        trend="+1% vs last month"
      />
      <AccuracySummaryCard
        title="Recall"
        value="85%"
        subtitle="Coverage"
        trend="+1% vs last month"
      />
      <AccuracySummaryCard
        title="Profit Generated"
        value="$4.2M"
        subtitle="Financial impact"
        trend="+$340K vs last month"
      />
    </div>
  );
};

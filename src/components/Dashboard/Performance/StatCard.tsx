
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { StatCardProps } from "./types";

const StatCard = ({ title, value, icon, subtitle, isMonetary = false, isPercentage = false }: StatCardProps) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
  const isPositive = !isNaN(numericValue) && numericValue >= 0;
  
  const formattedValue = isMonetary 
    ? `$${typeof value === 'number' ? value.toLocaleString() : value}`
    : isPercentage
    ? `${typeof value === 'number' ? (value * 100).toFixed(1) : value}%`
    : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className={`text-2xl font-bold ${isMonetary && isPositive ? 'text-tradingGreen-500' : isMonetary && !isPositive ? 'text-tradingRed-500' : ''}`}>
            {formattedValue}
          </div>
          {isMonetary && (
            isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-tradingGreen-500 ml-2" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-tradingRed-500 ml-2" />
            )
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;

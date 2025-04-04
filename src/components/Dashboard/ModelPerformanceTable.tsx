
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AITradingModel } from "@/types/trading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModelPerformanceTableProps {
  models: AITradingModel[];
}

const ModelPerformanceTable = ({ models }: ModelPerformanceTableProps) => {
  const navigate = useNavigate();

  const handleViewModel = (modelId: string) => {
    navigate(`/models/${modelId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead>Profit Factor</TableHead>
              <TableHead>Last Signal</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const recentSignal = model.recentSignals[0];
              const winRate = model.performance?.winRate || 0;
              const profitFactor = model.performance?.profitFactor || 0;

              return (
                <TableRow key={model.config.id}>
                  <TableCell className="font-medium">{model.config.name}</TableCell>
                  <TableCell>{model.config.modelType}</TableCell>
                  <TableCell>{model.recentSignals[0]?.symbol || "N/A"}</TableCell>
                  <TableCell>
                    <span className={winRate > 0.6 ? "text-tradingGreen-500" : winRate < 0.4 ? "text-tradingRed-500" : ""}>
                      {(winRate * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={profitFactor > 1.5 ? "text-tradingGreen-500" : profitFactor < 1 ? "text-tradingRed-500" : ""}>
                      {profitFactor.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {recentSignal ? (
                      <Badge 
                        variant="outline" 
                        className={`${
                          recentSignal.action === 'BUY' 
                            ? 'text-tradingGreen-500 border-tradingGreen-500/30' 
                            : recentSignal.action === 'SELL' 
                            ? 'text-tradingRed-500 border-tradingRed-500/30' 
                            : ''
                        }`}
                      >
                        {recentSignal.action}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleViewModel(model.config.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceTable;

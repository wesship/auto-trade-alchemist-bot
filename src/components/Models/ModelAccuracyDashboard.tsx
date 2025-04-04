
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface ModelAccuracyProps {
  modelId: string;
  modelName: string;
}

const mockDataOverTime = [
  { month: 'Jan', accuracy: 62, precision: 58, recall: 65 },
  { month: 'Feb', accuracy: 65, precision: 60, recall: 63 },
  { month: 'Mar', accuracy: 67, precision: 63, recall: 67 },
  { month: 'Apr', accuracy: 70, precision: 65, recall: 72 },
  { month: 'May', accuracy: 71, precision: 68, recall: 70 },
  { month: 'Jun', accuracy: 75, precision: 72, recall: 76 },
  { month: 'Jul', accuracy: 78, precision: 75, recall: 74 },
  { month: 'Aug', accuracy: 76, precision: 73, recall: 77 },
  { month: 'Sep', accuracy: 80, precision: 77, recall: 80 },
  { month: 'Oct', accuracy: 82, precision: 80, recall: 81 },
  { month: 'Nov', accuracy: 85, precision: 83, recall: 84 },
  { month: 'Dec', accuracy: 87, precision: 84, recall: 85 },
];

const mockAccuracyByMarket = [
  { name: 'S&P 500', value: 87 },
  { name: 'NASDAQ', value: 83 },
  { name: 'Forex', value: 78 },
  { name: 'Crypto', value: 72 },
  { name: 'Commodities', value: 81 },
];

const mockAccuracyByStrategyType = [
  { name: 'Trend Following', value: 85 },
  { name: 'Mean Reversion', value: 78 },
  { name: 'Breakout', value: 82 },
  { name: 'Momentum', value: 79 },
  { name: 'Volatility', value: 76 },
];

const mockAccuracyByVolatility = [
  { name: 'Low', value: 89 },
  { name: 'Medium', value: 82 },
  { name: 'High', value: 71 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ModelAccuracyDashboard: React.FC<ModelAccuracyProps> = ({ modelId, modelName }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Brain className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{modelName} Accuracy Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-center">87%</div>
            <div className="text-sm text-muted-foreground text-center">Overall Accuracy</div>
            <div className="text-xs text-green-500 font-medium text-center mt-1">+5% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-center">84%</div>
            <div className="text-sm text-muted-foreground text-center">Precision</div>
            <div className="text-xs text-green-500 font-medium text-center mt-1">+1% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-center">85%</div>
            <div className="text-sm text-muted-foreground text-center">Recall</div>
            <div className="text-xs text-green-500 font-medium text-center mt-1">+1% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-center">$4.2M</div>
            <div className="text-sm text-muted-foreground text-center">Profit Generated</div>
            <div className="text-xs text-green-500 font-medium text-center mt-1">+$340K vs last month</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Accuracy Metrics Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDataOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  name="Accuracy" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="precision" 
                  name="Precision" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="recall" 
                  name="Recall" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="market">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="market">By Market</TabsTrigger>
          <TabsTrigger value="strategy">By Strategy</TabsTrigger>
          <TabsTrigger value="volatility">By Volatility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAccuracyByMarket}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                      <Bar dataKey="value" name="Accuracy">
                        {mockAccuracyByMarket.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAccuracyByMarket}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAccuracyByMarket.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAccuracyByStrategyType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                      <Bar dataKey="value" name="Accuracy">
                        {mockAccuracyByStrategyType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAccuracyByStrategyType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAccuracyByStrategyType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volatility" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAccuracyByVolatility}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                      <Bar dataKey="value" name="Accuracy">
                        {mockAccuracyByVolatility.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAccuracyByVolatility}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAccuracyByVolatility.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelAccuracyDashboard;

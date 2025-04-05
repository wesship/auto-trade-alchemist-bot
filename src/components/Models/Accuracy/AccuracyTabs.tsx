
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccuracyByMarket, AccuracyByStrategy, AccuracyByVolatility } from './AccuracyByCategory';

export const AccuracyTabs: React.FC = () => {
  return (
    <Tabs defaultValue="market">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="market">By Market</TabsTrigger>
        <TabsTrigger value="strategy">By Strategy</TabsTrigger>
        <TabsTrigger value="volatility">By Volatility</TabsTrigger>
      </TabsList>
      
      <TabsContent value="market" className="mt-4">
        <AccuracyByMarket />
      </TabsContent>
      
      <TabsContent value="strategy" className="mt-4">
        <AccuracyByStrategy />
      </TabsContent>
      
      <TabsContent value="volatility" className="mt-4">
        <AccuracyByVolatility />
      </TabsContent>
    </Tabs>
  );
};

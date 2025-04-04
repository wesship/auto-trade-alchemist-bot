
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCcw, Shield, ShoppingCart } from 'lucide-react';
import { LogFilters } from '@/components/Logs/LogFilters';
import { LogList } from '@/components/Logs/LogList';
import { useLogs } from '@/hooks/use-logs';

const Logs = () => {
  const {
    logType,
    setLogType,
    logLevel,
    setLogLevel,
    searchTerm,
    setSearchTerm,
    filteredLogs,
    handleRefresh
  } = useLogs();

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Logs</h1>
          <p className="text-muted-foreground">
            View and analyze system logs, trade history, and security events
          </p>
        </div>
        
        <Button className="mt-4 lg:mt-0" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh Logs
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <CardTitle className="mb-2 md:mb-0">Log Explorer</CardTitle>
              
              <Tabs value={logType} onValueChange={setLogType} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="trade" className="flex items-center">
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Trade Logs
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="mr-1 h-4 w-4" />
                    Security Logs
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    System Logs
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            <LogFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              logType={logType}
              logLevel={logLevel}
              setLogLevel={setLogLevel}
            />
            
            <LogList 
              filteredLogs={filteredLogs}
              logType={logType}
              searchTerm={searchTerm}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;

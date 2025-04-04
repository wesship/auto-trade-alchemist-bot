
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTradeLogs } from '@/services/tradingService';
import { getSecurityEvents } from '@/utils/securityUtils';
import { getLogs, LogLevel } from '@/utils/logger';
import { AlertTriangle, Clock, FileText, Filter, RefreshCcw, Search, Shield, ShoppingCart } from 'lucide-react';
import { TradeLog } from '@/types/trading';

const Logs = () => {
  const [logType, setLogType] = useState('trade');
  const [logLevel, setLogLevel] = useState<LogLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  // Query for trade logs
  const { data: tradeLogs, isLoading: isLoadingTradeLogs, refetch: refetchTradeLogs } = useQuery({
    queryKey: ['tradeLogs'],
    queryFn: getTradeLogs,
  });

  // Query for security events
  const { data: securityEvents, isLoading: isLoadingSecurityEvents, refetch: refetchSecurityEvents } = useQuery({
    queryKey: ['securityEvents'],
    queryFn: getSecurityEvents,
  });

  // Query for system logs
  const { data: systemLogs, isLoading: isLoadingSystemLogs, refetch: refetchSystemLogs } = useQuery({
    queryKey: ['systemLogs'],
    queryFn: () => getLogs(),
  });

  useEffect(() => {
    let logs: any[] = [];
    
    switch (logType) {
      case 'trade':
        logs = tradeLogs || [];
        break;
      case 'security':
        logs = securityEvents || [];
        break;
      case 'system':
        logs = systemLogs || [];
        if (logLevel !== 'all') {
          logs = logs.filter(log => log.level === logLevel);
        }
        break;
      default:
        logs = [];
    }
    
    // Apply search filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(log => {
        const stringifiedLog = JSON.stringify(log).toLowerCase();
        return stringifiedLog.includes(term);
      });
    }
    
    setFilteredLogs(logs);
  }, [logType, logLevel, searchTerm, tradeLogs, securityEvents, systemLogs]);

  const renderLogBadge = (log: any) => {
    if (logType === 'trade') {
      return (
        <Badge variant={log.action === 'BUY' ? 'success' : 'destructive'} className="ml-2">
          {log.action}
        </Badge>
      );
    } else if (logType === 'security') {
      let variant: 'outline' | 'secondary' | 'destructive' = 'outline';
      
      if (log.severity === 'high') {
        variant = 'destructive';
      } else if (log.severity === 'medium') {
        variant = 'secondary';
      }
      
      return (
        <Badge variant={variant} className="ml-2">
          {log.type}
        </Badge>
      );
    } else if (logType === 'system') {
      let variant: 'outline' | 'secondary' | 'destructive' = 'outline';
      
      if (log.level === 'ERROR') {
        variant = 'destructive';
      } else if (log.level === 'WARN') {
        variant = 'secondary';
      }
      
      return (
        <Badge variant={variant} className="ml-2">
          {log.level}
        </Badge>
      );
    }
    
    return null;
  };

  const renderLogContent = (log: any) => {
    if (logType === 'trade') {
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium">{log.symbol}</span>
            {renderLogBadge(log)}
            <span className="ml-auto text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-sm">
            Quantity: {log.quantity} • Price: ${log.price?.toFixed(2) || 'N/A'} • 
            Value: ${(log.quantity * log.price)?.toFixed(2) || 'N/A'}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Model: {log.modelId} • Trade ID: {log.id}
          </div>
        </div>
      );
    } else if (logType === 'security') {
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium">{log.type}</span>
            {renderLogBadge(log)}
            <span className="ml-auto text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-sm">
            {log.details}
          </div>
          {log.ipAddress && (
            <div className="mt-1 text-xs text-muted-foreground">
              IP: {log.ipAddress}
            </div>
          )}
        </div>
      );
    } else if (logType === 'system') {
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium">{log.message}</span>
            {renderLogBadge(log)}
            <span className="ml-auto text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          {log.data && (
            <div className="mt-1 text-sm">
              {typeof log.data === 'object' 
                ? JSON.stringify(log.data) 
                : log.data.toString()}
            </div>
          )}
          {log.source && (
            <div className="mt-1 text-xs text-muted-foreground">
              Source: {log.source}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  const renderLogIcon = (log: any) => {
    if (logType === 'trade') {
      return log.action === 'BUY' 
        ? <ShoppingCart className="h-5 w-5 text-primary" /> 
        : <ShoppingCart className="h-5 w-5 text-destructive" />;
    } else if (logType === 'security') {
      return log.severity === 'high' 
        ? <Shield className="h-5 w-5 text-destructive" /> 
        : <Shield className="h-5 w-5 text-primary" />;
    } else if (logType === 'system') {
      if (log.level === 'ERROR') {
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      } else if (log.level === 'WARN') {
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      } else {
        return <FileText className="h-5 w-5 text-primary" />;
      }
    }
    
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const handleRefresh = () => {
    if (logType === 'trade') {
      refetchTradeLogs();
    } else if (logType === 'security') {
      refetchSecurityEvents();
    } else if (logType === 'system') {
      refetchSystemLogs();
    }
  };

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
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {logType === 'system' && (
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Select value={logLevel} onValueChange={(value: any) => setLogLevel(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="DEBUG">Debug</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARN">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                      <SelectItem value="TRADE">Trade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="border rounded-md">
              <ScrollArea className="h-[500px] w-full">
                {filteredLogs.length > 0 ? (
                  <div className="divide-y">
                    {filteredLogs.map((log, index) => (
                      <div key={index} className="p-4 flex items-start">
                        <div className="mr-3 mt-1">
                          {renderLogIcon(log)}
                        </div>
                        <div className="flex-1">
                          {renderLogContent(log)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No logs found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm
                        ? "No logs match your search criteria"
                        : `No ${logType} logs are available at this time`}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, FileText, Shield, ShoppingCart } from 'lucide-react';
import { TradeLog } from '@/types/trading';

interface LogItemProps {
  log: any;
  logType: 'trade' | 'security' | 'system';
}

export const LogItem: React.FC<LogItemProps> = ({ log, logType }) => {
  const renderLogBadge = () => {
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

  const renderLogContent = () => {
    if (logType === 'trade') {
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium">{log.symbol}</span>
            {renderLogBadge()}
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
            {renderLogBadge()}
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
            {renderLogBadge()}
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

  const renderLogIcon = () => {
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

  return (
    <div className="p-4 flex items-start">
      <div className="mr-3 mt-1">
        {renderLogIcon()}
      </div>
      <div className="flex-1">
        {renderLogContent()}
      </div>
    </div>
  );
};

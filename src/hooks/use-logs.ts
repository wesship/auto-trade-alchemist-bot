
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradeLogs } from '@/services/tradingService';
import { getSecurityEvents } from '@/utils/securityUtils';
import { getLogs, LogLevel } from '@/utils/logger';

export const useLogs = () => {
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

  const handleRefresh = () => {
    if (logType === 'trade') {
      refetchTradeLogs();
    } else if (logType === 'security') {
      refetchSecurityEvents();
    } else if (logType === 'system') {
      refetchSystemLogs();
    }
  };

  return {
    logType,
    setLogType,
    logLevel,
    setLogLevel,
    searchTerm,
    setSearchTerm,
    filteredLogs,
    handleRefresh,
    isLoading: isLoadingTradeLogs || isLoadingSecurityEvents || isLoadingSystemLogs
  };
};

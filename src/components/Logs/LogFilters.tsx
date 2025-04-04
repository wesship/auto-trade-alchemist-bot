
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { LogLevel } from '@/utils/logger';

interface LogFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  logType: string;
  logLevel: LogLevel | 'all';
  setLogLevel: (value: any) => void;
}

export const LogFilters: React.FC<LogFiltersProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  logType, 
  logLevel, 
  setLogLevel 
}) => {
  return (
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
          <Select value={logLevel} onValueChange={setLogLevel}>
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
  );
};

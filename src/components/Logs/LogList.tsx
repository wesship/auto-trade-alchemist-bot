
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogItem } from './LogItem';
import { EmptyLogs } from './EmptyLogs';

interface LogListProps {
  filteredLogs: any[];
  logType: string;
  searchTerm: string;
}

export const LogList: React.FC<LogListProps> = ({ filteredLogs, logType, searchTerm }) => {
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[500px] w-full">
        {filteredLogs.length > 0 ? (
          <div className="divide-y">
            {filteredLogs.map((log, index) => (
              <LogItem key={index} log={log} logType={logType as 'trade' | 'security' | 'system'} />
            ))}
          </div>
        ) : (
          <EmptyLogs searchTerm={searchTerm} logType={logType} />
        )}
      </ScrollArea>
    </div>
  );
};

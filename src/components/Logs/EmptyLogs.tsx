
import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyLogsProps {
  searchTerm: string;
  logType: string;
}

export const EmptyLogs: React.FC<EmptyLogsProps> = ({ searchTerm, logType }) => {
  return (
    <div className="p-8 text-center">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No logs found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {searchTerm
          ? "No logs match your search criteria"
          : `No ${logType} logs are available at this time`}
      </p>
    </div>
  );
};

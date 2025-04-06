
import React from 'react';
import { Bot } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import AIAgentRow from '@/components/Team/AIAgentRow';
import { TeamMember } from '@/utils/team/types';

interface AITeamTabProps {
  agents: TeamMember[];
  onEdit: (agent: TeamMember) => void;
  onDelete: (agent: TeamMember) => void;
  onToggleActive: (agent: TeamMember) => void;
}

export const AITeamTab: React.FC<AITeamTabProps> = ({
  agents,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  return (
    <>
      {agents.length === 0 ? (
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertTitle>No AI agents</AlertTitle>
          <AlertDescription>
            You haven't added any AI agents yet. Click the "Add AI Agent"
            button to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>A list of your AI trading agents</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <AIAgentRow
                key={agent.id}
                agent={agent}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

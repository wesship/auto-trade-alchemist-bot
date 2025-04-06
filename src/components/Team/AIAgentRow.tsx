
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  Bot, 
  Zap,
  AlertTriangle, 
  Circle,
  CheckCircle
} from 'lucide-react';
import {
  TableRow,
  TableCell
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TeamMember, 
  TeamMemberStatus,
  MemberType 
} from '@/utils/team/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface AIAgentRowProps {
  agent: TeamMember;
  onEdit: (agent: TeamMember) => void;
  onDelete: (agent: TeamMember) => void;
  onToggleActive: (agent: TeamMember) => void;
}

// Status badge component
const StatusBadge = ({ status, active }: { status: TeamMemberStatus, active: boolean }) => {
  if (status !== TeamMemberStatus.ACTIVE) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  }
  
  return active ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      <Zap className="h-3 w-3 mr-1" />
      Running
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <Circle className="h-3 w-3 mr-1" />
      Standby
    </Badge>
  );
};

const AIAgentRow: React.FC<AIAgentRowProps> = ({ 
  agent, 
  onEdit, 
  onDelete,
  onToggleActive
}) => {
  // For demo purposes, simulate some agents as active
  const isActive = agent.id.length % 2 === 0;
  
  const getAvatarColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
    const index = parseInt(agent.id.charAt(0), 10) % colors.length;
    return colors[index];
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback className={getAvatarColor() + " text-white"}>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{agent.name}</span>
            <span className="text-sm text-muted-foreground">{agent.aiModel}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger>
            <div className="max-w-[200px] truncate cursor-help">
              {agent.description || "No description provided"}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{agent.name}</h4>
              <p className="text-sm">{agent.description || "No description provided"}</p>
              {agent.specialties && agent.specialties.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold mb-1">Specialties:</h5>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <StatusBadge status={agent.status} active={isActive} />
      </TableCell>
      <TableCell>
        {format(new Date(agent.joinedAt), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        {agent.lastActive ? (
          <span title={format(new Date(agent.lastActive), 'MMM d, yyyy h:mm a')}>
            {formatDistanceToNow(new Date(agent.lastActive), { addSuffix: true })}
          </span>
        ) : (
          <span className="text-muted-foreground">Never</span>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onToggleActive(agent)}>
              {isActive ? "Pause agent" : "Start agent"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(agent)}>
              Edit agent
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(agent)}
              className="text-red-600"
            >
              Remove agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default AIAgentRow;


import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  User, 
  ShieldAlert, 
  BarChart, 
  LineChart, 
  Eye,
  CheckCircle,
  Clock,
  XCircle
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
  TeamMemberRole, 
  TeamMemberStatus 
} from '@/utils/team/types';

interface TeamMemberRowProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onResendInvite: (member: TeamMember) => void;
}

// Role icon mapping
const RoleIcon = ({ role }: { role: TeamMemberRole }) => {
  switch (role) {
    case TeamMemberRole.OWNER:
      return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    case TeamMemberRole.ADMIN:
      return <ShieldAlert className="h-4 w-4 text-blue-500" />;
    case TeamMemberRole.TRADER:
      return <BarChart className="h-4 w-4 text-green-500" />;
    case TeamMemberRole.ANALYST:
      return <LineChart className="h-4 w-4 text-purple-500" />;
    case TeamMemberRole.VIEWER:
      return <Eye className="h-4 w-4 text-gray-500" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: TeamMemberStatus }) => {
  switch (status) {
    case TeamMemberStatus.ACTIVE:
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case TeamMemberStatus.INVITED:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Invited
        </Badge>
      );
    case TeamMemberStatus.INACTIVE:
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ 
  member, 
  onEdit, 
  onDelete,
  onResendInvite
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-sm text-muted-foreground">{member.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <RoleIcon role={member.role} />
          <span>{member.role}</span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={member.status} />
      </TableCell>
      <TableCell>
        {format(new Date(member.joinedAt), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        {member.lastActive ? (
          <span title={format(new Date(member.lastActive), 'MMM d, yyyy h:mm a')}>
            {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
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
            <DropdownMenuItem onClick={() => onEdit(member)}>
              Edit team member
            </DropdownMenuItem>
            {member.status === TeamMemberStatus.INVITED && (
              <DropdownMenuItem onClick={() => onResendInvite(member)}>
                Resend invitation
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(member)}
              className="text-red-600"
            >
              Remove from team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default TeamMemberRow;

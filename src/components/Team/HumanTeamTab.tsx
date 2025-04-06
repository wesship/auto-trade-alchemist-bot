
import React from 'react';
import { Users } from 'lucide-react';
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
import TeamMemberRow from '@/components/Team/TeamMemberRow';
import { TeamMember } from '@/utils/team/types';

interface HumanTeamTabProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onResendInvite: (member: TeamMember) => void;
}

export const HumanTeamTab: React.FC<HumanTeamTabProps> = ({
  members,
  onEdit,
  onDelete,
  onResendInvite
}) => {
  return (
    <>
      {members.length === 0 ? (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle>No team members</AlertTitle>
          <AlertDescription>
            You haven't added any human team members yet. Click the "Add Team Member"
            button to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>A list of your human team members</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                onEdit={onEdit}
                onDelete={onDelete}
                onResendInvite={onResendInvite}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

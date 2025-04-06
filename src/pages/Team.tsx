
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle, RefreshCw, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import TeamMemberRow from '@/components/Team/TeamMemberRow';
import TeamMemberForm, { TeamMemberFormValues } from '@/components/Team/TeamMemberForm';
import {
  TeamMember,
  TeamMemberStatus,
} from '@/utils/team/types';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  resendInvitation,
} from '@/utils/team/teamManagement';

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getTeamMembers());
  const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Refresh team members list
  const refreshTeamMembers = () => {
    setTeamMembers(getTeamMembers());
    toast.success('Team members list refreshed');
  };

  // Open add member form
  const handleAddMember = () => {
    setSelectedMember(undefined);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Open edit member form
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Show delete confirmation
  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member);
  };

  // Confirm and process member deletion
  const confirmDeleteMember = () => {
    if (memberToDelete) {
      if (removeTeamMember(memberToDelete.id)) {
        toast.success(`${memberToDelete.name} has been removed from the team`);
        refreshTeamMembers();
      } else {
        toast.error('Failed to remove team member');
      }
      setMemberToDelete(null);
    }
  };

  // Resend invitation to a member
  const handleResendInvite = (member: TeamMember) => {
    if (resendInvitation(member.id)) {
      toast.success(`Invitation resent to ${member.email}`);
    } else {
      toast.error('Failed to resend invitation');
    }
  };

  // Handle form submission for add/edit
  const handleFormSubmit = (data: TeamMemberFormValues) => {
    if (isEditMode && selectedMember) {
      // Update existing member
      if (updateTeamMember(selectedMember.id, data)) {
        toast.success(`${data.name}'s information has been updated`);
        refreshTeamMembers();
      } else {
        toast.error('Failed to update team member');
      }
    } else {
      // Add new member
      try {
        const newMember = addTeamMember({
          name: data.name,
          email: data.email,
          role: data.role,
          status: TeamMemberStatus.INVITED,
        });
        toast.success(`${data.name} has been added to the team`);
        refreshTeamMembers();
      } catch (error) {
        toast.error('Failed to add team member');
        console.error(error);
      }
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your trading team members and their permissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTeamMembers}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleAddMember} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>No team members</AlertTitle>
            <AlertDescription>
              You haven't added any team members yet. Click the "Add Member"
              button to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableCaption>A list of your team members</TableCaption>
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
              {teamMembers.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  member={member}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onResendInvite={handleResendInvite}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Team Member Form */}
      <TeamMemberForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        member={selectedMember}
        isEdit={isEditMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberToDelete?.name} from your team. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember} className="bg-red-600">
              Yes, remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamPage;


import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PlusCircle, RefreshCw, Users, Bot, UserPlus, BrainCircuit } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TeamMemberRow from '@/components/Team/TeamMemberRow';
import TeamMemberForm, { TeamMemberFormValues } from '@/components/Team/TeamMemberForm';
import AIAgentRow from '@/components/Team/AIAgentRow';
import AIAgentForm, { AIAgentFormValues } from '@/components/Team/AIAgentForm';
import {
  TeamMember,
  TeamMemberStatus,
  TeamMemberRole,
  MemberType,
  AI_AGENT_PERMISSIONS
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
  const [isAIAgentFormOpen, setIsAIAgentFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("humans");

  // Get human team members
  const humanMembers = teamMembers.filter(member => member.type === MemberType.HUMAN || !member.type);
  
  // Get AI team members
  const aiMembers = teamMembers.filter(member => member.type === MemberType.AI);

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

  // Open add AI agent form
  const handleAddAIAgent = () => {
    setIsAIAgentFormOpen(true);
  };

  // Open edit member form
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Open edit AI agent form
  const handleEditAIAgent = (agent: TeamMember) => {
    // For now, we'll just show a toast since we haven't implemented editing
    toast.info(`Edit functionality for ${agent.name} coming soon`);
  };

  // Toggle AI agent active state
  const handleToggleAIAgentActive = (agent: TeamMember) => {
    // For demo purposes, we'll just show a toast
    toast.success(`${agent.name} status toggled`);
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
          type: MemberType.HUMAN
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

  // Handle AI agent form submission
  const handleAIAgentFormSubmit = (data: AIAgentFormValues) => {
    try {
      // Generate an email for the AI agent based on its name
      const email = `${data.name.toLowerCase().replace(/\s+/g, '.')}@ai-agent.trading`;
      
      // Add the AI agent to the team
      const newAgent = addTeamMember({
        name: data.name,
        email: email,
        role: TeamMemberRole.AI_AGENT,
        status: TeamMemberStatus.ACTIVE,
        type: MemberType.AI,
        aiModel: data.aiModel,
        specialties: data.specialties,
        description: data.description,
        // Use permissions based on the agent type
        permissions: AI_AGENT_PERMISSIONS[data.agentType]
      });
      
      toast.success(`${data.name} AI agent has been added to the team`);
      refreshTeamMembers();
      setActiveTab("ai"); // Switch to AI tab after adding
    } catch (error) {
      toast.error('Failed to add AI agent');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your trading team members and AI agents
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
          </div>
        </div>

        <Tabs defaultValue="humans" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="humans" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Human Team
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                AI Agents
              </TabsTrigger>
            </TabsList>
            
            <div>
              {activeTab === "humans" ? (
                <Button onClick={handleAddMember} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              ) : (
                <Button onClick={handleAddAIAgent} className="gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Add AI Agent
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="humans" className="mt-0">
            {humanMembers.length === 0 ? (
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
                  {humanMembers.map((member) => (
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
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            {aiMembers.length === 0 ? (
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
                  {aiMembers.map((agent) => (
                    <AIAgentRow
                      key={agent.id}
                      agent={agent}
                      onEdit={handleEditAIAgent}
                      onDelete={handleDeleteMember}
                      onToggleActive={handleToggleAIAgentActive}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Team Member Form */}
      <TeamMemberForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        member={selectedMember}
        isEdit={isEditMode}
      />

      {/* Add AI Agent Form */}
      <AIAgentForm
        open={isAIAgentFormOpen}
        onOpenChange={setIsAIAgentFormOpen}
        onSubmit={handleAIAgentFormSubmit}
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

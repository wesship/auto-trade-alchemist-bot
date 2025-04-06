
import React, { useState } from 'react';
import { Users, Bot, UserPlus, BrainCircuit } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { HumanTeamTab } from './HumanTeamTab';
import { AITeamTab } from './AITeamTab';
import TeamMemberForm, { TeamMemberFormValues } from './TeamMemberForm';
import AIAgentForm, { AIAgentFormValues } from './AIAgentForm';
import { 
  TeamMember, 
  TeamMemberStatus, 
  TeamMemberRole,
  MemberType,
  AI_AGENT_PERMISSIONS 
} from '@/utils/team/types';
import { 
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  resendInvitation,
} from '@/utils/team/teamManagement';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction 
} from '@/components/ui/alert-dialog';

interface TeamTabsProps {
  teamMembers: TeamMember[];
  refreshTeamMembers: () => void;
}

export const TeamTabs: React.FC<TeamTabsProps> = ({ 
  teamMembers, 
  refreshTeamMembers 
}) => {
  const [activeTab, setActiveTab] = useState("humans");
  const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAIAgentFormOpen, setIsAIAgentFormOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Get human team members
  const humanMembers = teamMembers.filter(member => member.type === MemberType.HUMAN || !member.type);
  
  // Get AI team members
  const aiMembers = teamMembers.filter(member => member.type === MemberType.AI);

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
    toast.info(`Edit functionality for ${agent.name} coming soon`);
  };

  // Toggle AI agent active state
  const handleToggleAIAgentActive = (agent: TeamMember) => {
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
          type: MemberType.HUMAN,
          permissions: [] // Add empty permissions array to fix the TypeScript error
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
    setIsAIAgentFormOpen(false);
  };

  return (
    <>
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
          <HumanTeamTab 
            members={humanMembers} 
            onEdit={handleEditMember} 
            onDelete={handleDeleteMember} 
            onResendInvite={handleResendInvite} 
          />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-0">
          <AITeamTab 
            agents={aiMembers} 
            onEdit={handleEditAIAgent} 
            onDelete={handleDeleteMember} 
            onToggleActive={handleToggleAIAgentActive} 
          />
        </TabsContent>
      </Tabs>

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
    </>
  );
};

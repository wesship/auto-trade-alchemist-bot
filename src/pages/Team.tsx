
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamTabs } from '@/components/Team/TeamTabs';
import { getTeamMembers } from '@/utils/team/teamMembers';
import { TeamMember } from '@/utils/team/types';

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getTeamMembers());
  
  // Refresh team members list
  const refreshTeamMembers = () => {
    setTeamMembers(getTeamMembers());
    toast.success('Team members list refreshed');
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

        <TeamTabs teamMembers={teamMembers} refreshTeamMembers={refreshTeamMembers} />
      </div>
    </div>
  );
};

export default TeamPage;

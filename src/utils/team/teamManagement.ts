
/**
 * Team Management Utility (Legacy Export File)
 * 
 * This file re-exports all team management functions from the new modular structure
 * for backward compatibility.
 * 
 * New code should import directly from the specific modules or from '@/utils/team'.
 */

import { 
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  hasPermission as memberHasPermission
} from './teamMembers';
import { inviteTeamMember, resendInvitation } from './invitations';
import { toggleAIAgentActive } from './aiAgents';

// Re-export everything for backward compatibility
export {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  inviteTeamMember,
  resendInvitation,
  toggleAIAgentActive
};

// For functions with the same names in different modules, create aliased exports
export const hasPermission = memberHasPermission;

// Export a default object for compatibility with default imports
export default {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  inviteTeamMember,
  resendInvitation,
  toggleAIAgentActive,
  hasPermission: memberHasPermission
};

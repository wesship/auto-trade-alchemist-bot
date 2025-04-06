
/**
 * Team Management Utility - Main Export File
 * 
 * This file exports all team management related functions and types.
 */

// Import specific exports from each module
import { 
  getTeamMembers, 
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
} from './teamMembers';

import {
  setCurrentUser,
  getCurrentUser,
  hasPermission,
  hasRole,
  isAdminOrOwner,
  isAiAgent,
  canManageAiAgents
} from './teamPermissions';

import {
  toggleAIAgentActive,
  getAIAgentPermissions
} from './aiAgents';

import {
  inviteTeamMember,
  resendInvitation
} from './invitations';

import {
  loadTeamMembers,
  saveTeamMembers
} from './storage';

// Export all the imported functions
export {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  setCurrentUser,
  getCurrentUser,
  hasPermission,
  hasRole,
  isAdminOrOwner,
  isAiAgent,
  canManageAiAgents,
  toggleAIAgentActive,
  getAIAgentPermissions,
  inviteTeamMember,
  resendInvitation,
  loadTeamMembers,
  saveTeamMembers
};

// Export all types
export * from './types';

// Re-export types needed by external components
import { TeamMember } from './types';
export type { TeamMember };

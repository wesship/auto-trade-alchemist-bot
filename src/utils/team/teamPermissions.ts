
/**
 * Team Permissions Utility
 * 
 * This utility provides functions for checking and managing team member permissions.
 */

import { 
  TeamMember, 
  TeamMemberRole, 
  TeamAction, 
  TeamResource,
  MemberType
} from './types';
import { getTeamMemberById } from './teamMembers';

// Current user ID - in a real app, this would come from authentication
// For demo purposes, we'll use the first member (owner) as the current user
let currentUserId = '1';

/**
 * Set the current user ID
 */
export const setCurrentUser = (userId: string): void => {
  currentUserId = userId;
};

/**
 * Get the current user
 */
export const getCurrentUser = (): TeamMember | undefined => {
  return getTeamMemberById(currentUserId);
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (
  resource: TeamResource,
  action: TeamAction
): boolean => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return false;
  }
  
  return currentUser.permissions.some(
    permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
  );
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: TeamMemberRole): boolean => {
  const currentUser = getCurrentUser();
  return currentUser ? currentUser.role === role : false;
};

/**
 * Check if the current user is an admin or owner
 */
export const isAdminOrOwner = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  return (
    currentUser.role === TeamMemberRole.ADMIN || 
    currentUser.role === TeamMemberRole.OWNER
  );
};

/**
 * Check if a team member is an AI agent
 */
export const isAiAgent = (member: TeamMember): boolean => {
  return member.type === MemberType.AI;
};

/**
 * Check if the current user can manage AI agents
 */
export const canManageAiAgents = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Only owners and admins can manage AI agents
  return isAdminOrOwner();
};

export default {
  setCurrentUser,
  getCurrentUser,
  hasPermission,
  hasRole,
  isAdminOrOwner,
  isAiAgent,
  canManageAiAgents
};

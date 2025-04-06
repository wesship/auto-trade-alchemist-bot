
/**
 * Team Members Management Utility
 * 
 * This utility provides core functions for managing team members.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  TeamMember, 
  TeamMemberRole, 
  TeamMemberStatus,
  DEFAULT_ROLE_PERMISSIONS,
  MemberType
} from './types';
import { loadTeamMembers, saveTeamMembers } from './storage';
import { initialTeamMembers } from './initialData';
import { sendNotification } from '@/utils/notifications/sender';
import { NotificationType, NotificationPriority } from '@/utils/notifications/types';

// Team members state
let teamMembers: TeamMember[] = [];

// Initialize team members from localStorage or use initial data
const initTeamMembers = (): void => {
  const loadedMembers = loadTeamMembers();
  teamMembers = loadedMembers.length > 0 ? loadedMembers : [...initialTeamMembers];
  
  if (loadedMembers.length === 0) {
    saveTeamMembers(teamMembers);
  }
};

// Initialize on module load
initTeamMembers();

/**
 * Get all team members
 */
export const getTeamMembers = (): TeamMember[] => {
  return [...teamMembers];
};

/**
 * Get a team member by ID
 */
export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return teamMembers.find(member => member.id === id);
};

/**
 * Add a new team member
 */
export const addTeamMember = (
  newMember: Omit<TeamMember, 'id' | 'joinedAt'> & Partial<Pick<TeamMember, 'permissions'>>
): TeamMember => {
  const isAI = newMember.type === MemberType.AI;
  
  const member: TeamMember = {
    id: uuidv4(),
    joinedAt: new Date().toISOString(),
    permissions: newMember.permissions || DEFAULT_ROLE_PERMISSIONS[newMember.role],
    ...newMember
  };
  
  teamMembers.push(member);
  saveTeamMembers(teamMembers);
  
  // Send notification about new team member or AI agent
  const notificationTitle = isAI ? 'New AI Agent Added' : 'New Team Member Added';
  const notificationMessage = isAI 
    ? `${member.name} (AI Agent) has been added to the team.`
    : `${member.name} (${member.role}) has been added to the team.`;
  
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.MEDIUM,
    notificationTitle,
    notificationMessage
  );
  
  return member;
};

/**
 * Update an existing team member
 */
export const updateTeamMember = (
  id: string, 
  updates: Partial<Omit<TeamMember, 'id' | 'joinedAt'>>
): boolean => {
  const index = teamMembers.findIndex(member => member.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const updatedMember = {
    ...teamMembers[index],
    ...updates
  };
  
  // If role changed, update permissions
  if (updates.role && updates.role !== teamMembers[index].role) {
    updatedMember.permissions = DEFAULT_ROLE_PERMISSIONS[updates.role];
  }
  
  teamMembers[index] = updatedMember;
  saveTeamMembers(teamMembers);
  
  // Send notification about team member update
  if (Object.keys(updates).length > 0) {
    sendNotification(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.LOW,
      'Team Member Updated',
      `${updatedMember.name}'s information has been updated.`
    );
  }
  
  return true;
};

/**
 * Remove a team member
 */
export const removeTeamMember = (id: string): boolean => {
  const index = teamMembers.findIndex(member => member.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const deletedMember = teamMembers[index];
  teamMembers.splice(index, 1);
  saveTeamMembers(teamMembers);
  
  // Send notification about team member removal
  const isAI = deletedMember.type === MemberType.AI;
  const notificationTitle = isAI ? 'AI Agent Removed' : 'Team Member Removed';
  
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.MEDIUM,
    notificationTitle,
    `${deletedMember.name} has been removed from the team.`
  );
  
  return true;
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  userId: string,
  resource: string,
  action: string
): boolean => {
  const member = teamMembers.find(member => member.id === userId);
  
  if (!member || (member.type === MemberType.HUMAN && member.status !== TeamMemberStatus.ACTIVE)) {
    return false;
  }
  
  return member.permissions.some(
    permission => 
      permission.resource === resource && 
      permission.actions.includes(action as any)
  );
};

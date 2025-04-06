
/**
 * Team Management Utility
 * 
 * This utility provides functions for managing team members.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  TeamMember, 
  TeamMemberRole, 
  TeamMemberStatus, 
  DEFAULT_ROLE_PERMISSIONS, 
  TEAM_MEMBERS_KEY 
} from './types';
import logger from '@/utils/logger';
import { sendNotification } from '@/utils/notifications/sender';
import { NotificationType, NotificationPriority } from '@/utils/notifications/types';

// Mock team members for demo purposes
const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: TeamMemberRole.OWNER,
    status: TeamMemberStatus.ACTIVE,
    avatar: 'https://i.pravatar.cc/150?u=jane',
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.OWNER]
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: TeamMemberRole.ADMIN,
    status: TeamMemberStatus.ACTIVE,
    avatar: 'https://i.pravatar.cc/150?u=john',
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.ADMIN]
  },
  {
    id: '3',
    name: 'Mark Johnson',
    email: 'mark.johnson@example.com',
    role: TeamMemberRole.TRADER,
    status: TeamMemberStatus.ACTIVE,
    avatar: 'https://i.pravatar.cc/150?u=mark',
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.TRADER]
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: TeamMemberRole.ANALYST,
    status: TeamMemberStatus.ACTIVE,
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.ANALYST]
  },
  {
    id: '5',
    name: 'Alex Parker',
    email: 'alex.parker@example.com',
    role: TeamMemberRole.VIEWER,
    status: TeamMemberStatus.INVITED,
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.VIEWER]
  }
];

// Load team members from localStorage or use initial data
let teamMembers: TeamMember[] = [];

try {
  const storedMembers = localStorage.getItem(TEAM_MEMBERS_KEY);
  if (storedMembers) {
    teamMembers = JSON.parse(storedMembers);
  } else {
    teamMembers = [...initialTeamMembers];
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(teamMembers));
  }
} catch (error) {
  logger.error('Failed to load team members:', error);
  teamMembers = [...initialTeamMembers];
}

/**
 * Save team members to localStorage
 */
const saveTeamMembers = (): void => {
  try {
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(teamMembers));
  } catch (error) {
    logger.error('Failed to save team members:', error);
  }
};

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
  newMember: Omit<TeamMember, 'id' | 'joinedAt' | 'permissions'>
): TeamMember => {
  const member: TeamMember = {
    id: uuidv4(),
    joinedAt: new Date().toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[newMember.role],
    ...newMember
  };
  
  teamMembers.push(member);
  saveTeamMembers();
  
  // Send notification about new team member
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.MEDIUM,
    'New Team Member Added',
    `${member.name} (${member.role}) has been added to the team.`
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
  saveTeamMembers();
  
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
  saveTeamMembers();
  
  // Send notification about team member removal
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.MEDIUM,
    'Team Member Removed',
    `${deletedMember.name} has been removed from the team.`
  );
  
  return true;
};

/**
 * Invite a new team member by email
 */
export const inviteTeamMember = (
  email: string,
  role: TeamMemberRole
): TeamMember => {
  // In a real app, this would send an email invitation
  // For demo purposes, we'll just create the user with INVITED status
  const member: TeamMember = {
    id: uuidv4(),
    name: email.split('@')[0], // Use part of email as name until they accept
    email,
    role,
    status: TeamMemberStatus.INVITED,
    joinedAt: new Date().toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[role]
  };
  
  teamMembers.push(member);
  saveTeamMembers();
  
  // Send notification about invitation
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.LOW,
    'Team Invitation Sent',
    `An invitation has been sent to ${email}.`
  );
  
  logger.info(`Invited user ${email} with role ${role}`);
  
  return member;
};

/**
 * Resend invitation to a team member
 */
export const resendInvitation = (id: string): boolean => {
  const member = teamMembers.find(member => member.id === id);
  
  if (!member || member.status !== TeamMemberStatus.INVITED) {
    return false;
  }
  
  // In a real app, this would resend the email invitation
  // For demo purposes, we'll just log it
  logger.info(`Resent invitation to ${member.email}`);
  
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.LOW,
    'Invitation Resent',
    `The invitation to ${member.email} has been resent.`
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
  
  if (!member || member.status !== TeamMemberStatus.ACTIVE) {
    return false;
  }
  
  return member.permissions.some(
    permission => 
      permission.resource === resource && 
      permission.actions.includes(action as any)
  );
};

export default {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  inviteTeamMember,
  resendInvitation,
  hasPermission
};

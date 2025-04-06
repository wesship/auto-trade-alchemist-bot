
/**
 * Team Invitations Utility
 * 
 * This utility provides functions for managing team invitations.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  TeamMember, 
  TeamMemberRole, 
  TeamMemberStatus,
  DEFAULT_ROLE_PERMISSIONS,
  MemberType
} from './types';
import { sendNotification } from '@/utils/notifications/sender';
import { NotificationType, NotificationPriority } from '@/utils/notifications/types';
import logger from '@/utils/logger';
import { getTeamMemberById, getTeamMembers, addTeamMember } from './teamMembers';
import { saveTeamMembers } from './storage';

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
    permissions: DEFAULT_ROLE_PERMISSIONS[role],
    type: MemberType.HUMAN
  };
  
  const newMember = addTeamMember(member);
  
  // Send notification about invitation
  sendNotification(
    NotificationType.SYSTEM_ALERT,
    NotificationPriority.LOW,
    'Team Invitation Sent',
    `An invitation has been sent to ${email}.`
  );
  
  logger.info(`Invited user ${email} with role ${role}`);
  
  return newMember;
};

/**
 * Resend invitation to a team member
 */
export const resendInvitation = (id: string): boolean => {
  const member = getTeamMemberById(id);
  
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


/**
 * Team Storage Utility
 * 
 * This utility provides functions for storing and retrieving team data.
 */

import { TeamMember, TEAM_MEMBERS_KEY, MemberType } from './types';
import logger from '@/utils/logger';

// Load team members from localStorage
export const loadTeamMembers = (): TeamMember[] => {
  try {
    const storedMembers = localStorage.getItem(TEAM_MEMBERS_KEY);
    if (storedMembers) {
      const members = JSON.parse(storedMembers);
      
      // Update any existing members without type field
      return members.map((member: TeamMember) => {
        if (!member.type) {
          return {
            ...member,
            type: MemberType.HUMAN
          };
        }
        return member;
      });
    }
  } catch (error) {
    logger.error('Failed to load team members:', error);
  }
  
  return [];
};

/**
 * Save team members to localStorage
 */
export const saveTeamMembers = (teamMembers: TeamMember[]): void => {
  try {
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(teamMembers));
  } catch (error) {
    logger.error('Failed to save team members:', error);
  }
};

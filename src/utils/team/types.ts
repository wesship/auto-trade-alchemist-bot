
/**
 * Team Member Management Types
 * 
 * This file contains types for managing team members in the trading platform.
 */

export enum TeamMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  TRADER = 'TRADER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export enum TeamMemberStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  INACTIVE = 'INACTIVE'
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  avatar?: string;
  joinedAt: string;
  lastActive?: string;
  permissions: TeamPermission[];
}

export interface TeamPermission {
  resource: TeamResource;
  actions: TeamAction[];
}

export enum TeamResource {
  TRADES = 'TRADES',
  MODELS = 'MODELS',
  STRATEGIES = 'STRATEGIES',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  TEAM = 'TEAM'
}

export enum TeamAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  APPROVE = 'APPROVE'
}

// Default role-based permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<TeamMemberRole, TeamPermission[]> = {
  [TeamMemberRole.OWNER]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE, TeamAction.EXECUTE, TeamAction.APPROVE] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE, TeamAction.EXECUTE] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE] },
    { resource: TeamResource.SETTINGS, actions: [TeamAction.VIEW, TeamAction.EDIT] },
    { resource: TeamResource.TEAM, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE] }
  ],
  [TeamMemberRole.ADMIN]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.DELETE, TeamAction.EXECUTE, TeamAction.APPROVE] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT, TeamAction.EXECUTE] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.SETTINGS, actions: [TeamAction.VIEW, TeamAction.EDIT] },
    { resource: TeamResource.TEAM, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] }
  ],
  [TeamMemberRole.TRADER]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EXECUTE] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.EXECUTE] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.SETTINGS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.TEAM, actions: [TeamAction.VIEW] }
  ],
  [TeamMemberRole.ANALYST]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.SETTINGS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.TEAM, actions: [TeamAction.VIEW] }
  ],
  [TeamMemberRole.VIEWER]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.SETTINGS, actions: [] },
    { resource: TeamResource.TEAM, actions: [TeamAction.VIEW] }
  ]
};

// Storage key for team members
export const TEAM_MEMBERS_KEY = 'trading_team_members';

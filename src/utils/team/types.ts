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
  VIEWER = 'VIEWER',
  AI_AGENT = 'AI_AGENT' // New role for AI agents
}

export enum TeamMemberStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  INACTIVE = 'INACTIVE'
}

export enum MemberType {
  HUMAN = 'HUMAN',
  AI = 'AI'
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
  type: MemberType; // Added type field to distinguish between humans and AI agents
  aiModel?: string; // For AI agents, which model they use
  specialties?: string[]; // For AI agents, what they specialize in
  description?: string; // Brief description of the AI agent's capabilities
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

// Default AI agent permissions
export const AI_AGENT_PERMISSIONS: Record<string, TeamPermission[]> = {
  'MARKET_ANALYZER': [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW, TeamAction.CREATE] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW, TeamAction.CREATE] },
  ],
  'TRADE_EXECUTOR': [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EXECUTE] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.EXECUTE] },
  ],
  'STRATEGY_DESIGNER': [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW, TeamAction.CREATE, TeamAction.EDIT] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW] },
  ]
};

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
  ],
  [TeamMemberRole.AI_AGENT]: [
    { resource: TeamResource.TRADES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.MODELS, actions: [TeamAction.VIEW] },
    { resource: TeamResource.STRATEGIES, actions: [TeamAction.VIEW] },
    { resource: TeamResource.ANALYTICS, actions: [TeamAction.VIEW] },
  ]
};

// Available AI agent models
export const AI_AGENT_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', capabilities: ['Analysis', 'Strategy', 'Communication'] },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', capabilities: ['Analysis', 'Research', 'Strategy'] },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', capabilities: ['Pattern Recognition', 'Strategy'] },
  { id: 'llama-3', name: 'Llama 3', provider: 'Meta', capabilities: ['Research', 'Execution', 'Monitoring'] },
  { id: 'custom', name: 'Custom Agent', provider: 'Internal', capabilities: ['Customizable'] }
];

// AI agent specialties
export const AI_AGENT_SPECIALTIES = [
  'Market Analysis',
  'Pattern Recognition',
  'Risk Assessment',
  'Sentiment Analysis',
  'Trade Execution',
  'Strategy Development',
  'Portfolio Optimization',
  'Trend Identification',
  'Anomaly Detection',
  'Earnings Analysis'
];

// Storage key for team members
export const TEAM_MEMBERS_KEY = 'trading_team_members';

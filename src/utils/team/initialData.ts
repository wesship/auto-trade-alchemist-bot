
/**
 * Initial Team Data
 * 
 * This file contains the initial team members data for the application.
 */

import { 
  TeamMember, 
  TeamMemberRole, 
  TeamMemberStatus, 
  DEFAULT_ROLE_PERMISSIONS, 
  MemberType,
  AI_AGENT_PERMISSIONS
} from './types';

// Mock team members for demo purposes
export const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: TeamMemberRole.OWNER,
    status: TeamMemberStatus.ACTIVE,
    avatar: 'https://i.pravatar.cc/150?u=jane',
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.OWNER],
    type: MemberType.HUMAN
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
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.ADMIN],
    type: MemberType.HUMAN
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
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.TRADER],
    type: MemberType.HUMAN
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
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.ANALYST],
    type: MemberType.HUMAN
  },
  {
    id: '5',
    name: 'Alex Parker',
    email: 'alex.parker@example.com',
    role: TeamMemberRole.VIEWER,
    status: TeamMemberStatus.INVITED,
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: DEFAULT_ROLE_PERMISSIONS[TeamMemberRole.VIEWER],
    type: MemberType.HUMAN
  },
  // Adding some initial AI agents
  {
    id: '101',
    name: 'MarketSense AI',
    email: 'marketsense@ai-agent.trading',
    role: TeamMemberRole.AI_AGENT,
    status: TeamMemberStatus.ACTIVE,
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    permissions: AI_AGENT_PERMISSIONS['MARKET_ANALYZER'],
    type: MemberType.AI,
    aiModel: 'gpt-4',
    specialties: ['Market Analysis', 'Sentiment Analysis', 'Trend Identification'],
    description: 'Analyzes market trends and sentiment to provide trading insights'
  },
  {
    id: '102',
    name: 'TradeBot Alpha',
    email: 'tradebot@ai-agent.trading',
    role: TeamMemberRole.AI_AGENT,
    status: TeamMemberStatus.ACTIVE,
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date().toISOString(),
    permissions: AI_AGENT_PERMISSIONS['TRADE_EXECUTOR'],
    type: MemberType.AI,
    aiModel: 'claude-3',
    specialties: ['Trade Execution', 'Risk Assessment'],
    description: 'Executes trades based on predefined strategies with risk management'
  }
];

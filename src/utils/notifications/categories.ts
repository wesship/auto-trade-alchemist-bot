/**
 * Custom Notification Categories
 * 
 * This utility manages user-defined notification categories
 * that can be used to filter and organize notifications.
 */

import { NotificationType } from './types';
import logger from '@/utils/logger';

// Storage key for custom categories
export const CATEGORIES_KEY = 'notification_categories';

// Default categories
export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  notificationTypes: NotificationType[];
  isDefault?: boolean;
}

// Default categories
const defaultCategories: NotificationCategory[] = [
  {
    id: 'trading',
    name: 'Trading Alerts',
    description: 'Notifications related to trade executions and orders',
    color: '#4CAF50',
    notificationTypes: [NotificationType.TRADE_EXECUTION],
    isDefault: true
  },
  {
    id: 'market',
    name: 'Market Updates',
    description: 'Notifications about market conditions and price alerts',
    color: '#2196F3',
    notificationTypes: [NotificationType.MARKET_ALERT],
    isDefault: true
  },
  {
    id: 'system',
    name: 'System Alerts',
    description: 'Notifications about system status and maintenance',
    color: '#FFC107',
    notificationTypes: [NotificationType.SYSTEM_ALERT],
    isDefault: true
  },
  {
    id: 'models',
    name: 'AI Model Alerts',
    description: 'Notifications about AI model performance and issues',
    color: '#9C27B0',
    notificationTypes: [NotificationType.MODEL_ALERT],
    isDefault: true
  },
  {
    id: 'performance',
    name: 'Performance Updates',
    description: 'Notifications about your trading performance',
    color: '#F44336',
    notificationTypes: [NotificationType.PERFORMANCE_ALERT],
    isDefault: true
  }
];

// Load categories from localStorage
let userCategories: NotificationCategory[] = [...defaultCategories];

try {
  const storedCategories = localStorage.getItem(CATEGORIES_KEY);
  if (storedCategories) {
    // Merge with default categories to ensure we always have the defaults
    const parsedCategories = JSON.parse(storedCategories);
    
    // Keep default categories and add custom ones
    userCategories = [
      ...defaultCategories.filter(dc => dc.isDefault),
      ...parsedCategories.filter((pc: NotificationCategory) => 
        !defaultCategories.some(dc => dc.id === pc.id && dc.isDefault))
    ];
  }
} catch (error) {
  logger.error('Failed to load notification categories:', error);
}

/**
 * Save categories to localStorage
 */
const saveCategories = (): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(userCategories));
  } catch (error) {
    logger.error('Failed to save notification categories:', error);
  }
};

/**
 * Get all notification categories
 */
export const getNotificationCategories = (): NotificationCategory[] => {
  return [...userCategories];
};

/**
 * Add a new custom category
 */
export const addNotificationCategory = (category: Omit<NotificationCategory, 'id' | 'isDefault'>): NotificationCategory => {
  // Generate a unique ID
  const id = `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newCategory: NotificationCategory = {
    id,
    ...category,
    isDefault: false
  };
  
  userCategories.push(newCategory);
  saveCategories();
  
  return newCategory;
};

/**
 * Update an existing category
 */
export const updateNotificationCategory = (categoryId: string, updates: Partial<Omit<NotificationCategory, 'id' | 'isDefault'>>): boolean => {
  const index = userCategories.findIndex(c => c.id === categoryId);
  
  if (index === -1) {
    return false;
  }
  
  // Don't allow modification of default property
  const category = userCategories[index];
  
  // Don't allow modification of default categories
  if (category.isDefault) {
    return false;
  }
  
  userCategories[index] = {
    ...category,
    ...updates
  };
  
  saveCategories();
  return true;
};

/**
 * Delete a category
 */
export const deleteNotificationCategory = (categoryId: string): boolean => {
  const index = userCategories.findIndex(c => c.id === categoryId);
  
  if (index === -1) {
    return false;
  }
  
  // Don't allow deletion of default categories
  if (userCategories[index].isDefault) {
    return false;
  }
  
  userCategories.splice(index, 1);
  saveCategories();
  
  return true;
};

/**
 * Get notification types by category
 */
export const getNotificationTypesByCategory = (categoryId: string): NotificationType[] => {
  const category = userCategories.find(c => c.id === categoryId);
  return category ? [...category.notificationTypes] : [];
};

/**
 * Get category by notification type
 */
export const getCategoriesByNotificationType = (type: NotificationType): NotificationCategory[] => {
  return userCategories.filter(category => 
    category.notificationTypes.includes(type)
  );
};

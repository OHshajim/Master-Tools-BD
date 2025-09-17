
import { Order } from '@/types/dataTypes';
import { User } from '@/types/auth';
import { subscriptionStatusService } from './subscriptionStatusService';

/**
 * Service for managing user collection and statistics
 * Updated to use real user data from AuthContext and active subscriptions only
 */
export const userCollectionService = {
  /**
   * Get all registered user IDs from real users
   */
  getAllRegisteredUserIds: (users: User[]): string[] => {
    return users.map(user => user._id);
  },

  /**
   * Get total count of registered users
   */
  getTotalUserCount: (users: User[]): number => {
    return users?.length;
  },

  /**
   * Get users who have active subscriptions (refined "purchased" definition)
   */
  getUsersWithActiveSubscriptions: (users: User[], orders: Order[]): string[] => {
    return subscriptionStatusService.getUsersWithActiveSubscriptions(orders);
  },

  /**
   * Get users who have never had active subscriptions
   * This includes users who never purchased, have expired subscriptions, or cancelled orders
   */
  getNonActiveSubscriptionUserIds: (users: User[], orders: Order[]): string[] => {
    const activeSubscriptionUserIds = new Set(userCollectionService.getUsersWithActiveSubscriptions(users, orders));
    const allUserIds = userCollectionService.getAllRegisteredUserIds(users);
    
    return allUserIds?.filter(userId => !activeSubscriptionUserIds.has(userId));
  },

  /**
   * Get users who have made at least one purchase (any status - for backward compatibility)
   */
  getPurchasingUserIds: (orders: Order[]): string[] => {
    return [...new Set(orders?.map(order => order.userId))];
  },

  /**
   * Get users who have never purchased anything (backward compatibility)
   */
  getNonPurchasingUserIds: (users: User[], orders: Order[]): string[] => {
    const purchasingUserIds = new Set(orders?.map(order => order.userId));
    const allUserIds = userCollectionService.getAllRegisteredUserIds(users);
    
    return allUserIds.filter(userId => !purchasingUserIds.has(userId));
  }
};

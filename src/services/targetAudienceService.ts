
import { Order, NotificationTargetType } from '@/types/dataTypes';
import { User } from '@/types/auth';
import { userCollectionService } from './userCollectionService';
import { subscriptionStatusService } from './subscriptionStatusService';

/**
 * Service for calculating target audience for notifications
 * Updated to use refined "purchased" logic (active subscriptions only)
 */
export const targetAudienceService = {
  /**
   * Calculate the number of users that will receive a notification based on target type
   */
  calculateTargetCount: (
    users: User[],
    orders: Order[],
    targetType: NotificationTargetType,
    targetPlanId?: string
  ): number => {
    switch (targetType) {
      case 'all':
        return userCollectionService.getTotalUserCount(users);
        
      case 'purchased':
        // Users who have active subscriptions only (refined definition)
        return userCollectionService.getUsersWithActiveSubscriptions(users, orders).length;
        
      case 'non-purchased':
        // Users who don't have active subscriptions (includes never purchased, expired, cancelled)
        return userCollectionService.getNonActiveSubscriptionUserIds(users, orders).length;
        
      case 'specific-plan':
        if (!targetPlanId) return 0;
        // Users with active subscription for the specific plan
        return subscriptionStatusService.getUsersWithActivePlanSubscription(orders, targetPlanId).length;
        
      default:
        return 0;
    }
  },

  /**
   * Get user IDs that should receive a notification based on target type
   */
  getTargetUserIds: (
    users: User[],
    orders: Order[],
    targetType: NotificationTargetType,
    targetPlanId?: string
  ): string[] => {
    switch (targetType) {
      case 'all':
        return userCollectionService.getAllRegisteredUserIds(users);
        
      case 'purchased':
        // Users with active subscriptions only
        return userCollectionService.getUsersWithActiveSubscriptions(users, orders);
        
      case 'non-purchased':
        // Users without active subscriptions
        return userCollectionService.getNonActiveSubscriptionUserIds(users, orders);
        
      case 'specific-plan':
        if (!targetPlanId) return [];
        return subscriptionStatusService.getUsersWithActivePlanSubscription(orders, targetPlanId);
        
      default:
        return [];
    }
  },

  /**
   * Check if a user should receive a notification based on their orders and target criteria
   */
  shouldUserReceiveNotification: (
    orders: Order[],
    userId: string,
    targetType: NotificationTargetType,
    targetPlanId?: string
  ): boolean => {
    const hasActiveSubscription = subscriptionStatusService.hasActiveSubscription(orders, userId);
    
    switch (targetType) {
      case 'all':
        return true;
        
      case 'purchased':
        // Only users with active subscriptions
        return hasActiveSubscription;
        
      case 'non-purchased':
        // Users without active subscriptions
        return !hasActiveSubscription;
        
      case 'specific-plan':
        if (!targetPlanId) return false;
        return subscriptionStatusService.getUsersWithActivePlanSubscription(orders, targetPlanId).includes(userId);
        
      default:
        return false;
    }
  },

  /**
   * Get detailed statistics for target audience with refined definitions
   */
  getTargetAudienceStats: (users: User[], orders: Order[]) => {
    const totalUsers = userCollectionService.getTotalUserCount(users);
    const purchasingUsers = userCollectionService.getUsersWithActiveSubscriptions(users, orders).length;
    const nonPurchasingUsers = userCollectionService.getNonActiveSubscriptionUserIds(users, orders).length;
    
    return {
      totalUsers,
      purchasingUsers, // Only users with active subscriptions
      nonPurchasingUsers, // Users without active subscriptions
    };
  }
};

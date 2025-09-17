
import { Order } from '@/types/order';

/**
 * Service for checking subscription and order status
 */
export const subscriptionStatusService = {
  /**
   * Check if an order represents an active subscription
   */
  isSubscriptionActive: (order: Order): boolean => {
    // Must be approved or completed to be active
    if (order.status !== 'approved' && order.status !== 'completed') {
      return false;
    }
    
    // Check expiration date
    const now = new Date();
    
    if (order.expirationDate) {
      const expirationDate = new Date(order.expirationDate);
      return expirationDate > now;
    }
    
    // Check expiresAt for backward compatibility
    if (order.expiresAt) {
      const expirationDate = new Date(order.expiresAt);
      return expirationDate > now;
    }
    
    return false;
  },

  /**
   * Get all active subscriptions for a user
   */
  getUserActiveSubscriptions: (orders: Order[], userId: string): Order[] => {
    return orders
      ?.filter(order => order.userId === userId)
      ?.filter(order => subscriptionStatusService.isSubscriptionActive(order));
  },

  /**
   * Check if user has any active subscriptions
   */
  hasActiveSubscription: (orders: Order[], userId: string): boolean => {
    return subscriptionStatusService.getUserActiveSubscriptions(orders, userId).length > 0;
  },

  /**
   * Get users with active subscriptions
   */
  getUsersWithActiveSubscriptions: (orders: Order[]): string[] => {
    const userIds = [...new Set(orders?.map(order => order.userId))];
    
    return userIds.filter(userId => 
      subscriptionStatusService.hasActiveSubscription(orders, userId)
    );
  },

  /**
   * Get users with active subscription for a specific plan
   */
  getUsersWithActivePlanSubscription: (orders: Order[], planId: string): string[] => {
    const planOrders = orders?.filter(order => order.planId === planId);
    const userIds = [...new Set(planOrders?.map(order => order.userId))];
    
    return userIds.filter(userId => {
      const userPlanOrders = planOrders?.filter(order => order.userId === userId);
      return userPlanOrders?.some(order => subscriptionStatusService.isSubscriptionActive(order));
    });
  },

  /**
   * Check if user has ever made a purchase (regardless of subscription status)
   */
  hasEverPurchased: (orders: Order[], userId: string): boolean => {
    return orders?.some(order => order.userId === userId);
  }
};

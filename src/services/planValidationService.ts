
import { Order } from '@/types/dataTypes';

/**
 * Service for validating plan operations
 */
export const planValidationService = {
  /**
   * Check if a plan has any active subscriptions
   */
  hasActiveSubscriptions: (orders: Order[], planId: string): boolean => {
    const now = new Date();
    
    return orders.some(order => {
      // Check if order is for this plan
      if (order.planId !== planId) return false;
      
      // Check if order is active (completed or approved)
      if (order.status !== 'completed' && order.status !== 'approved') return false;
      
      // Check if subscription is still active (not expired)
      if (order.expirationDate) {
        const expirationDate = new Date(order.expirationDate);
        return expirationDate > now;
      }
      
      // If no expiration date, check expiresAt for backward compatibility
      if (order.expiresAt) {
        const expirationDate = new Date(order.expiresAt);
        return expirationDate > now;
      }
      
      return false;
    });
  },

  /**
   * Check if a plan has any pending subscriptions
   */
  hasPendingSubscriptions: (orders: Order[], planId: string): boolean => {
    return orders.some(order => {
      return order.planId === planId && order.status === 'pending';
    });
  },

  /**
   * Get count of active subscriptions for a plan
   */
  getActiveSubscriptionsCount: (orders: Order[], planId: string): number => {
    const now = new Date();
    
    return orders.filter(order => {
      if (order.planId !== planId) return false;
      if (order.status !== 'completed' && order.status !== 'approved') return false;
      
      if (order.expirationDate) {
        const expirationDate = new Date(order.expirationDate);
        return expirationDate > now;
      }
      
      if (order.expiresAt) {
        const expirationDate = new Date(order.expiresAt);
        return expirationDate > now;
      }
      
      return false;
    }).length;
  },

  /**
   * Get count of pending subscriptions for a plan
   */
  getPendingSubscriptionsCount: (orders: Order[], planId: string): number => {
    return orders.filter(order => {
      return order.planId === planId && order.status === 'pending';
    }).length;
  },

  /**
   * Get validation message for plan deletion
   */
  getPlanDeletionMessage: (orders: Order[], planId: string): { canDelete: boolean; message: string; activeCount: number; pendingCount: number } => {
    const activeCount = planValidationService.getActiveSubscriptionsCount(orders, planId);
    const pendingCount = planValidationService.getPendingSubscriptionsCount(orders, planId);
    const totalCount = activeCount + pendingCount;
    
    if (totalCount === 0) {
      return {
        canDelete: true,
        message: '',
        activeCount: 0,
        pendingCount: 0
      };
    }
    
    let message = '🔒 This plan cannot be deleted because there ';
    
    if (activeCount > 0 && pendingCount > 0) {
      message += `are ${activeCount} active and ${pendingCount} pending subscription${totalCount > 1 ? 's' : ''} associated with it.`;
    } else if (activeCount > 0) {
      message += `are ${activeCount} active subscription${activeCount > 1 ? 's' : ''} associated with it.`;
    } else {
      message += `are ${pendingCount} pending subscription${pendingCount > 1 ? 's' : ''} associated with it.`;
    }
    
    return {
      canDelete: false,
      message,
      activeCount,
      pendingCount
    };
  }
};

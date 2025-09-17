
import { Order } from '@/types/dataTypes';
import { addDays, addHours, addMinutes, addMonths, addYears } from 'date-fns';

export interface OrderValidationResult {
  canOrder: boolean;
  reason?: string;
  reasonBangla?: string;
  existingOrder?: Order;
  expirationDate?: string;
}

/**
 * Service for validating order operations and preventing duplicates
 */
export const orderValidationService = {
  /**
   * Check if a user can order a specific plan
   */
  canUserOrderPlan: (orders: Order[], userId: string, planId: string): OrderValidationResult => {
    // Check for pending orders
    const pendingOrder = orderValidationService.getUserPendingOrderForPlan(orders, userId, planId);
    if (pendingOrder) {
      return {
        canOrder: false,
        reason: "You already have a pending order for this plan. Please wait for approval or cancellation.",
        reasonBangla: "আপনার এই প্ল্যানের জন্য ইতিমধ্যে একটি অর্ডার অপেক্ষারত আছে। অনুমোদন বা বাতিলের জন্য অপেক্ষা করুন।",
        existingOrder: pendingOrder
      };
    }

    // Check for active subscriptions
    const activeSubscription = orderValidationService.getUserActiveSubscriptionForPlan(orders, userId, planId);
    if (activeSubscription) {
      const expirationDate = activeSubscription.expirationDate || activeSubscription.expiresAt;
      return {
        canOrder: false,
        reason: `You have an active subscription for this plan that expires on ${expirationDate ? new Date(expirationDate).toLocaleDateString() : 'N/A'}.`,
        reasonBangla: `আপনার এই প্ল্যানের সাবস্ক্রিপশন এখনো চালু আছে যা ${expirationDate ? new Date(expirationDate).toLocaleDateString() : 'N/A'} তারিখে শেষ হবে।`,
        existingOrder: activeSubscription,
        expirationDate: expirationDate
      };
    }

    // User can order - no restrictions
    return {
      canOrder: true
    };
  },

  /**
   * Get pending order for a specific plan and user
   */
  getUserPendingOrderForPlan: (orders: Order[], userId: string, planId: string): Order | null => {
    return orders.find(order => 
      order.userId === userId && 
      order.planId === planId && 
      order.status === 'pending'
    ) || null;
  },

  /**
   * Get active subscription for a specific plan and user
   */
  getUserActiveSubscriptionForPlan: (orders: Order[], userId: string, planId: string): Order | null => {
    const now = new Date();
    
    return orders.find(order => {
      // Check if order is for this user and plan
      if (order.userId !== userId || order.planId !== planId) return false;
      
      // Check if order is approved (active subscription)
      if (order.status !== 'approved' && order.status !== 'completed') return false;
      
      // Check if subscription is still active (not expired)
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
    }) || null;
  },

  /**
   * Check if a subscription is still active
   */
  isSubscriptionActive: (order: Order): boolean => {
    if (order.status !== 'approved' && order.status !== 'completed') return false;
    
    const now = new Date();
    
    if (order.expirationDate) {
      const expirationDate = new Date(order.expirationDate);
      return expirationDate > now;
    }
    
    if (order.expiresAt) {
      const expirationDate = new Date(order.expiresAt);
      return expirationDate > now;
    }
    
    return false;
  },

  /**
   * Get all user orders for a specific plan
   */
  getUserOrdersForPlan: (orders: Order[], userId: string, planId: string): Order[] => {
    return orders.filter(order => 
      order.userId === userId && order.planId === planId
    );
  }
};

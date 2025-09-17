
import { useMemo } from 'react';
import { Notification } from '@/types/notification';
import { targetAudienceService } from '@/services/targetAudienceService';
import { Order } from '@/types/order';

export const useNotificationFiltering = (
  notifications: Notification[] | undefined,
  orders: Order[],
  currentUserId: string | undefined
) => {
  const relevantNotifications = useMemo(() => {
    if (!notifications || !currentUserId) return [];

    return notifications
      .filter(notification => {
        // Check if notification is still active (not expired)
        if (notification.expiresAt && new Date(notification.expiresAt) <= new Date()) {
          return false;
        }

        // Use the improved target audience service to determine if user should see notification
        return targetAudienceService.shouldUserReceiveNotification(
          orders,
          currentUserId,
          notification.targetType,
          notification.targetPlanId
        );
      })
      .sort((a, b) => {
        // Sort by priority first (high > medium > low)
        const priorityOrder: Record<string, number> = {
          'high': 3,
          'medium': 2,
          'low': 1
        };
        
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notifications, orders, currentUserId]);

  return relevantNotifications;
};

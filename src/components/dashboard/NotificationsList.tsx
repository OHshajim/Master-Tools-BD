
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationCard } from './NotificationCard';

interface NotificationsListProps {
  notifications: Notification[];
  readNotificationIds: string[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationsList = ({
  notifications,
  readNotificationIds,
  onMarkAsRead
}: NotificationsListProps) => {
  const isNotificationRead = (notificationId: string) => {
    return readNotificationIds.includes(notificationId);
  };

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          isRead={isNotificationRead(notification.id)}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

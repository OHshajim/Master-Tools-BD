
import React from 'react';
import { Notification } from '@/types/notification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationItem } from './NotificationItem';

interface ActiveNotificationsListProps {
  notifications: Notification[];
  deleteNotification: (id: string) => void;
}

export const ActiveNotificationsList: React.FC<ActiveNotificationsListProps> = ({ notifications, deleteNotification }) => {
  // Filter out expired notifications
  const activeNotifications = notifications??[].filter(notification => {
    if (!notification.expiresAt) return true;
    return new Date(notification.expiresAt) > new Date();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Notifications</CardTitle>
        <CardDescription>
          Manage your current notifications • {activeNotifications.length} active
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeNotifications && activeNotifications.length > 0 ? (
          <div className="space-y-4">
            {activeNotifications?.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                deleteNotification={deleteNotification}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No active notifications
          </div>
        )}
      </CardContent>
    </Card>
  );
};

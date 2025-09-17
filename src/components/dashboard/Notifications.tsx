
import React from 'react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotificationFiltering } from '@/hooks/useNotificationFiltering';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationsList } from './NotificationsList';

export const Notifications = () => {
  const { notifications, orders } = useData();
  const { user: currentUser } = useAuth();
  
  // Store read notification IDs in localStorage, specific to the current user
  const [readNotificationIds, setReadNotificationIds] = useLocalStorage<string[]>(
    currentUser ? `userReadNotifications_${currentUser.id}` : 'userReadNotifications_guest',
    []
  );

  // Filter notifications based on target audience and user's purchase/subscription status
  const relevantNotifications = useNotificationFiltering(
    notifications,
    orders,
    currentUser?.id
  );

  const handleMarkAsRead = (notificationId: string) => {
    if (!readNotificationIds.includes(notificationId)) {
      setReadNotificationIds([...readNotificationIds, notificationId]);
    }
  };

  if (!currentUser) {
    return null;
  }
  
  if (relevantNotifications.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Important updates and announcements</CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationsList
          notifications={relevantNotifications}
          readNotificationIds={readNotificationIds}
          onMarkAsRead={handleMarkAsRead}
        />
      </CardContent>
    </Card>
  );
};

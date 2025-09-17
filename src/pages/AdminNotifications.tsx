
import React from 'react';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import { ActiveNotificationsList } from '@/components/admin/notifications/ActiveNotificationsList';
import { useData } from '@/hooks/useData';
import { NotificationForm } from '@/components/admin/notifications/NotificationForm';

const AdminNotifications = () => {

  const { notifications, addNotification, deleteNotification } = useData();

  return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Notification Management</h1>
        <p className="text-gray-600 mb-8">
            Create and manage user notifications
        </p>

        {/* Back to Admin Dashboard Button */}
        <BackToAdminButton />

        <div className="space-y-6">
            <NotificationForm addNotification={addNotification} />
            <ActiveNotificationsList
                notifications={notifications}
                deleteNotification={deleteNotification}
            />
        </div>
      </div>
  );
};

export default AdminNotifications;

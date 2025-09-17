
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Notification, NotificationPriority } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, Bell, Trash2 } from 'lucide-react';
import { MessageRenderer } from '@/components/ui/MessageRenderer';

interface NotificationItemProps {
  notification: Notification;
  deleteNotification: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, deleteNotification }) => {
  
  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-blue-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div
      key={notification._id}
      className="flex items-start justify-between p-4 border rounded-md"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getPriorityIcon(notification.priority)}</div>
        <div>
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-600 mt-1">
            <MessageRenderer message={notification.message} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getPriorityBadge(notification.priority)}
            <span className="text-xs text-gray-500">
              Expires: {new Date(notification.expiresAt || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          deleteNotification(notification._id);
          toast.info("Notification Deleted", { description: "The notification has been removed" });
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

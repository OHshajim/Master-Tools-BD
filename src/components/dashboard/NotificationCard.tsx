
import React, { useState } from 'react';
import { Notification } from '@/types/notification';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { MessageRenderer } from '@/components/ui/MessageRenderer';

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  onMarkAsRead: (id: string) => void;
}

export const NotificationCard = ({ 
  notification, 
  isRead, 
  onMarkAsRead 
}: NotificationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Bell className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getAlertVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return { className: 'border-destructive' };
      case 'medium':
        return { className: 'border-amber-500' };
      case 'low':
        return { className: 'border-blue-500' };
      default:
        return {};
    }
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Alert 
      {...getAlertVariant(notification.priority)}
      className={`${isRead ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start">
        <div className="mr-3">
          {getPriorityIcon(notification.priority)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <AlertTitle className="font-bold mb-1">
              {notification.title}
            </AlertTitle>
            {notification.priority === 'high' && (
              <Badge variant="destructive">Important</Badge>
            )}
          </div>
          
          {notification.message.length > 120 ? (
            <div className="mt-1">
              <Accordion type="single" collapsible className="border-none p-0">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger 
                    className="p-0 hover:no-underline" 
                    onClick={toggleExpanded}
                  >
                    <AlertDescription className="text-sm text-left">
                      {isExpanded 
                        ? <MessageRenderer message={notification.message} />
                        : truncateText(notification.message)}
                    </AlertDescription>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0">
                    <AlertDescription className="text-sm">
                      <MessageRenderer message={notification.message} />
                    </AlertDescription>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <AlertDescription className="text-sm mt-1">
              <MessageRenderer message={notification.message} />
            </AlertDescription>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString()}
            </span>
            {!isRead && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-xs flex items-center gap-1"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <CheckCircle className="h-3 w-3" />
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
};

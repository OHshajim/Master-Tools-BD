import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, Info, X } from "lucide-react";
import { useNotificationProvider } from "@/hooks/providers/useNotificationProvider";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageRenderer } from "./ui/MessageRenderer";
import { NotificationPriority } from "@/types";

export const NotificationBar = () => {
    const { notifications: data, markNotificationAsRead } =
        useNotificationProvider();
    const { user, isLoading, isAdmin,isManager,isSupport } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user || isLoading) return;

        // Filter unread notifications for the current user
        const unread = data.filter((n) => !n.isReadBy.includes(user._id));

        // Sort by priority: high -> medium -> low
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        unread.sort(
            (a, b) =>
                (priorityOrder[a.priority] ?? 3) -
                (priorityOrder[b.priority] ?? 3)
        );

        setNotifications(unread);
    }, [data, user, isLoading]);

    const getPriorityIcon = (priority: NotificationPriority) => {
        switch (priority) {
            case "high":
                return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case "medium":
                return <Bell className="h-5 w-5 text-amber-500" />;
            case "low":
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Info className="h-5 w-5 text-gray-400" />;
        }
    };

    if (isAdmin || isManager || isSupport || isLoading) return;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-96 max-w-full">
            {notifications.map((n) => (
                <Card
                    key={n._id}
                    className="flex items-start p-4 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02]"
                >
                    <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(n.priority)}
                    </div>

                    <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-800">
                                {n.title}
                            </h4>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markNotificationAsRead(n._id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="text-sm text-gray-600">
                            <MessageRenderer message={n.message} />
                        </div>
{/* 
                        <div className="mt-2 flex items-center gap-2">
                            {getPriorityBadge(n.priority)}
                        </div> */}
                    </div>
                </Card>
            ))}
        </div>
    );
};

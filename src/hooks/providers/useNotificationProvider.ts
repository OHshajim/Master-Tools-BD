import { Notification } from '@/types/dataTypes';
import {
    updateNotificationApi,
    fetchNotifications,
    createNotificationApi,
    deleteNotificationApi,
    markAsReadApi
} from "@/services/notificationService";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '../use-toast';
import { socket } from '@/lib/socket';
import { useEffect } from 'react';

export const useNotificationProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch notifications ---
    const { data: notifications = [], refetch } = useQuery<
        Notification[],
        Error
    >({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
    });

    // Add a notification
    const addNotification = useMutation({
        mutationFn: (
            notification: Omit<Notification, "_id" | "createdAt" | "updatedAt">
        ) => createNotificationApi(notification),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["plans"] });
                toast.success("Notification created successfully");
            } else {
                toast.error("Try again later");
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to create plan");
        },
    });

    // --- Update Notification ---
    const updateNotification = useMutation({
        mutationFn: (notification: Notification) =>
            updateNotificationApi(notification._id, notification),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification updated successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update notification");
        },
    });

    // --- Delete Notification ---
    const deleteNotification = useMutation({
        mutationFn: (id: string) => deleteNotificationApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification deleted successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to delete notification");
        },
    });

    // --- Mark as Read ---
    const markNotificationAsRead = useMutation({
        mutationFn: (id: string) => markAsReadApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to mark as read");
        },
    });

    useEffect(() => {
        const handleNotifications = () => {
            refetch();
        };

        socket.on("notifications", handleNotifications);

        return () => {
            socket.off("notifications", handleNotifications);
        };
    }, [refetch, socket]);

    return {
        notifications,
        addNotification: addNotification.mutate,
        updateNotification : updateNotification.mutate,
        deleteNotification : deleteNotification.mutate,
        markNotificationAsRead : markNotificationAsRead.mutate,
    };
};

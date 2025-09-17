import { secureApi } from "@/hooks/axios/useAxios";
import { Notification } from "@/types/dataTypes";

// --- Get All Notifications ---
export const fetchNotifications = async () => {
    const res = await secureApi.get("/api/notifications");
    return res.data.notifications;
};

// --- Create Notification ---
export const createNotificationApi = async (notification: Omit<Notification, "_id" | "createdAt" | "updatedAt">)=>{
  console.log(notification);
  
    const res = await secureApi.post("/api/notifications", notification);
    return res.data.notification;
};

// --- Update Notification ---
export const updateNotificationApi = async ( id: string, data: Partial<Notification>)=>{
    const res = await secureApi.put(`/api/notifications/${id}`, data);
    return res.data.notification;
};

// --- Delete Notification ---
export const deleteNotificationApi = async (id: string)=>{
    await secureApi.delete(`/api/notifications/${id}`);
};

// --- Mark Notification as Read ---
export const markAsReadApi = async ( id: string)=>{
    const res = await secureApi.patch(`/api/notifications/${id}/read`, {});
    return res.data.notification;
};

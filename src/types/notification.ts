
export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationTargetType = 'all' | 'purchased' | 'non-purchased' | 'specific-plan';

export interface Notification {
    _id?: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    priority: NotificationPriority;
    // isRead: boolean;
    isReadBy?: string[];
    createdAt: string;
    updatedAt?: string;
    expiresAt?: string;
    targetType: NotificationTargetType;
    targetPlanId?: string;
    targetCount?: number;
}

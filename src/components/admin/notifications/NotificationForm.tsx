import React, { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import {
    NotificationPriority,
    Notification,
    NotificationTargetType,
} from "@/types/dataTypes";
import { useData } from "@/hooks/useData";
import { useAuth } from "@/contexts/AuthContext";
import { targetAudienceService } from "@/services/targetAudienceService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Target } from "lucide-react";
import { NotificationBasicFields } from "./NotificationBasicFields";
import { AudienceStatistics } from "./AudienceStatistics";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface NotificationFormProps {
    addNotification: (
        notification: Omit<Notification, "id" | "createdAt" | "isRead">
    ) => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
    addNotification,
}) => {
    const { plans, orders } = useData();
    const { getUsers } = useAuth();
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [priority, setPriority] = useState<NotificationPriority>("medium");
    const [targetType, setTargetType] = useState<NotificationTargetType>("all");
    const [targetPlanId, setTargetPlanId] = useState("");
    const [expiresIn, setExpiresIn] = useState("7"); // Days

    // Load users once
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data || []);
        };
        fetchUsers();
    }, [getUsers]);

    // Memoize audience stats for performance
    const { targetCount, audienceStats } = useMemo(() => {
        const count = targetAudienceService.calculateTargetCount(
            users,
            orders,
            targetType,
            targetPlanId || undefined
        );

        const stats = targetAudienceService.getTargetAudienceStats(
            users,
            orders
        );
        return { targetCount: count, audienceStats: stats };
    }, [users, orders, targetType, targetPlanId]);

    const handleCreateNotification = () => {
        if (!title.trim() || !message.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
            });
            return;
        }

        if (targetType === "specific-plan" && !targetPlanId) {
            toast({
                title: "Error",
                description: "Please select a plan for targeting",
            });
            return;
        }

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn || "7"));

        addNotification({
            title,
            message,
            priority,
            targetType,
            targetPlanId:
                targetType === "specific-plan" ? targetPlanId : undefined,
            targetCount,
            expiresAt: expiresAt.toISOString(),
            type: "info",
        });

        toast({
            title: "Success",
            description: `Notification sent to ${targetCount} users`,
        });

        // Reset form
        setTitle("");
        setMessage("");
        setPriority("medium");
        setTargetType("all");
        setTargetPlanId("");
        setExpiresIn("7");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" /> Create Targeted Notification
                </CardTitle>
                <CardDescription>
                    Send notifications to specific user groups or plans
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <NotificationBasicFields
                        title={title}
                        setTitle={setTitle}
                        message={message}
                        setMessage={setMessage}
                        priority={priority}
                        setPriority={setPriority}
                        expiresIn={expiresIn}
                        setExpiresIn={setExpiresIn}
                        targetCount={targetCount}
                        onSubmit={handleCreateNotification}
                    />

                    <AudienceStatistics audienceStats={audienceStats} />

                    <TargetAudienceSelector
                        targetType={targetType}
                        setTargetType={setTargetType}
                        targetPlanId={targetPlanId}
                        setTargetPlanId={setTargetPlanId}
                        plans={plans}
                        targetCount={targetCount}
                    />
                </form>
            </CardContent>
        </Card>
    );
};

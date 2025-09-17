import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DraftPlatformStatus } from "@/types/draftPlatform";
import { toast } from "@/hooks/use-toast";
import { api, secureApi } from "@/hooks/axios/useAxios";
import { socket } from "@/lib/socket";

export const useDraftPlatformProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch draft platforms ---
    const { data: draftPlatforms = [], isLoading } = useQuery({
        queryKey: ["draftPlatforms"],
        queryFn: async () => {
            const res = await secureApi.get("/api/draftPlatforms");
            return res.data;
        },
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        enabled: !!localStorage.getItem("accessToken"),
    });

    // --- Add draft platform ---
    const addMutation = useMutation({
        mutationFn: async (
            draft: Omit<DraftPlatformStatus, "_id" | "draftedAt">
        ) => {
            const res = await secureApi.post(
                "/api/draftPlatforms",
                draft
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["draftPlatforms"] });
            toast({
                title: "Draft Added",
                description: "Platform drafted successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add draft platform.",
            });
        },
    });

    // --- Remove draft platform ---
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/draftPlatforms/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["draftPlatforms"] });
            toast({
                title: "Draft Removed",
                description: "Draft platform removed successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to remove draft platform.",
            });
        },
    });

    // --- Toggle draft platform ---
    const toggleMutation = useMutation({
        mutationFn: async (payload: {
            userId: string;
            planId: string;
            platformId: string;
            type: "credential" | "cookie";
            draftedBy: string;
        }) => {
            const res = await secureApi.patch<DraftPlatformStatus>(
                "/api/draftPlatforms/toggle",
                payload
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["draftPlatforms"] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to toggle draft status.",
            });
        },
    });

    // --- Socket.IO real-time sync ---
    useEffect(() => {
        const handleUpdate = () =>
            queryClient.invalidateQueries({ queryKey: ["draftPlatforms"] });

        socket.on("draftPlatform", handleUpdate);
        return () => {
            socket.off("draftPlatform", handleUpdate);
        };
    }, [queryClient]);

    // --- Utility functions ---
    const addDraftPlatform = (
        data: Omit<DraftPlatformStatus, "_id" | "draftedAt">
    ) => addMutation.mutateAsync(data);

    const removeDraftPlatform = (id: string) => removeMutation.mutateAsync(id);

    const togglePlatformDraft = (
        userId: string,
        planId: string,
        platformId: string,
        type: "credential" | "cookie",
        draftedBy: string
    ) =>
        toggleMutation.mutateAsync({
            userId,
            planId,
            platformId,
            type,
            draftedBy,
        });

    const getUserDraftPlatforms = (userId: string, planId?: string) =>
        draftPlatforms.filter(
            (d) => d.userId === userId && (!planId || d.planId === planId)
        );

    const isDraftedForUser = (
        userId: string,
        planId: string,
        platformId: string,
        credentialType: "credential" | "cookie"
    ) =>
        draftPlatforms.some(
            (d) =>
                d.userId === userId &&
                d.planId === planId &&
                d.platformId === platformId &&
                d.type === credentialType
        );

    const getPlatformDraftStatus = (
        userId: string,
        planId: string,
        platformId: string,
        credentialType: "credential" | "cookie"
    ) =>
        draftPlatforms.find(
            (d) =>
                d.userId === userId &&
                d.planId === planId &&
                d.platformId === platformId &&
                d.type === credentialType
        );

    return {
        draftPlatforms,
        isLoading,
        addDraftPlatform,
        removeDraftPlatform,
        togglePlatformDraft,
        getUserDraftPlatforms,
        isDraftedForUser,
        getPlatformDraftStatus,
    };
};

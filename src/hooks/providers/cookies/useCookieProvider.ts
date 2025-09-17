import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cookie } from "@/types/dataTypes";
import { toast } from "@/hooks/use-toast";
import { secureApi } from "@/hooks/axios/useAxios";
import { socket } from "@/lib/socket";
import { useAuth } from "@/contexts/AuthContext";

// Sort helper
const sortCookies = (cookies: Cookie[]) => {
    return [...cookies].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.isPinned && b.isPinned && a.pinnedAt && b.pinnedAt) {
            return (
                new Date(a.pinnedAt).getTime() - new Date(b.pinnedAt).getTime()
            );
        }
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    });
};

export const useCookieProvider = () => {
    const queryClient = useQueryClient();
    const { user, isLoading: authLoading } = useAuth();


    // Fetch cookies
    const { data: cookies = [], isLoading } = useQuery<Cookie[]>({
        queryKey: ["cookies"],
        queryFn: async () => {
            const { data } = await secureApi.get("/api/cookies", {
                params: { isAll: true },
            });
            return sortCookies(data);
        },
        enabled: !!user && !authLoading,
        staleTime: 1000 * 30, // 30 seconds
    });

    // --- Mutations ---
    const addMutation = useMutation({
        mutationFn: async (cookie: Omit<Cookie, "_id">) => {
            const { data } = await secureApi.post("/api/cookies", cookie);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Cookie[]>(["cookies"], (old = []) =>
                sortCookies([...old, data])
            );
            toast({
                title: "Cookie Added",
                description: `Cookie for ${data.name} added.`,
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (cookie: Cookie) => {
            const { data } = await secureApi.put(
                `/api/cookies/${cookie._id}`,
                cookie
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Cookie[]>(["cookies"], (old = []) =>
                sortCookies(old.map((c) => (c._id === data._id ? data : c)))
            );
            toast({
                title: "Cookie Updated",
                description: `Cookie for ${data.name} updated.`,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await secureApi.delete(`/api/cookies/${id}`);
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData<Cookie[]>(["cookies"], (old = []) =>
                old.filter((c) => c._id !== id)
            );
            toast({ title: "Cookie Deleted" });
        },
    });

    const togglePinnedMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await secureApi.patch(`/api/cookies/${id}/pin`);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Cookie[]>(["cookies"], (old = []) =>
                sortCookies(old.map((c) => (c._id === data._id ? data : c)))
            );
        },
    });

    // --- Real-time Socket.IO updates ---
    useEffect(() => {
        const handleUpdate = async () => {
            queryClient.invalidateQueries({ queryKey: ["cookies"] });
        };
        socket.on("cookie", handleUpdate);
        return () => {
            socket.off("cookie");
        };
    }, [queryClient]);

    // --- Utility ---
    const getCookiesForPlan = useCallback(
        (planId: string) => cookies.filter((c) => c.planId === planId),
        [cookies]
    );

    return {
        cookies,
        isLoading,
        addCookie: addMutation.mutateAsync,
        updateCookie: updateMutation.mutateAsync,
        deleteCookie: deleteMutation.mutateAsync,
        togglePinnedStatus: togglePinnedMutation.mutateAsync,
        getCookiesForPlan,
    };
};

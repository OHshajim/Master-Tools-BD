import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { secureApi } from "@/hooks/axios/useAxios";
import { socket } from "@/lib/socket";
import { Cookie } from "@/types";

export interface UserSpecificCookie extends Cookie {
  userId: string;
}

/**
 * Hook for managing user-specific cookies with React Query and real-time updates
 */
export const useUserSpecificCookieProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch user-specific cookies ---
    const { data: userCookies = [], isLoading } = useQuery<
        UserSpecificCookie[]
    >({
        queryKey: ["userCookies"],
        queryFn: async () => {
            const { data } = await secureApi.get("/api/cookies/user")
            return data;
        },
        staleTime: 1000 * 30,
        retry: 2,
        enabled:(!!localStorage.getItem("accessToken"))
    });

    // --- Mutations ---
    const addMutation = useMutation({
        mutationFn: async (cookieData: Omit<UserSpecificCookie, "_id">) => {
            const { data } = await secureApi.post("/api/cookies", cookieData);
            return data;
        },
        onSuccess: (data) => {
            toast({
                title: "Cookie Added",
                description: `Cookie for ${data.platform} added.`,
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (cookie: UserSpecificCookie) => {
            const { data } = await secureApi.put(
                `/api/cookies/${cookie._id}`,
                cookie
            );
            return data;
        },
        onSuccess: (data) => {
            toast({
                title: "Cookie Updated",
                description: `Cookie for ${data.platform} updated.`,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await secureApi.delete(`/api/cookies/${id}`);
            return id;
        },
        onSuccess: () => {
            toast({ title: "Cookie Deleted" });
        },
    });

    // --- Real-time updates ---
    useEffect(() => {
        const handleUpdate = () =>
            queryClient.invalidateQueries({ queryKey: ["userCookies"] });

        socket.on("cookie", handleUpdate);

        return () => {
            socket.off("cookie", handleUpdate);
        };
    }, [queryClient]);

    // --- Utility functions ---
    const getUserSpecificCookiesForPlan = (userId: string, planId: string) =>
        userCookies.filter((c) => c.userId === userId && c.planId === planId);

    const getUserSpecificCookies = (userId) =>
        userCookies.filter((c) => c.userId === userId);

    return {
        userCookies,
        isLoading,
        addUserSpecificCookie: addMutation.mutateAsync,
        updateUserSpecificCookie: updateMutation.mutateAsync,
        deleteUserSpecificCookie: deleteMutation.mutateAsync,
        getUserSpecificCookiesForPlan,
        getUserSpecificCookies
    };
};

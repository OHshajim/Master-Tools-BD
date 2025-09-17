import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Credential } from "@/types/dataTypes";
import { toast } from "@/hooks/use-toast";
import { api, secureApi } from "@/hooks/axios/useAxios";
import { socket } from "@/lib/socket"; // <-- your initialized socket instance

// Helper: sort by updatedAt
const sortCredentialsByDate = (creds: Credential[]) =>
    [...creds].sort((a, b) => {
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    });

export const useCredentialProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch credentials ---
    const { data: credentials = [], isLoading } = useQuery<Credential[]>({
        queryKey: ["credentials"],
        queryFn: async () => {
            if (!localStorage.getItem("accessToken")) return [];
            const res = await api.get<Credential[]>("/api/credential");
            return sortCredentialsByDate(res.data);
        },
    });

    // --- Add ---
    const addMutation = useMutation({
        mutationFn: async (credential: Omit<Credential, "_id">) => {
            const res = await secureApi.post("/api/credential", credential);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["credentials"] });
            toast({
                title: "Credential Added",
                description: "New credential added successfully",
            });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to add credential" });
        },
    });

    // --- Update ---
    const updateMutation = useMutation({
        mutationFn: async (credential: Credential) => {
            const res = await secureApi.put(
                `/api/credential/${credential._id}`,
                credential
            );
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["credentials"] });
            toast({
                title: "Credential Updated",
                description: `Credential for ${
                    data.platform || data.platformId
                } has been updated.`,
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update credential",
            });
        },
    });

    // --- Delete ---
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await secureApi.delete(`/api/credential/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["credentials"] });
            toast({
                title: "Deleted",
                description: "Credential deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete credential",
            });
        },
    });

    // --- Utility: get credentials for a specific plan ---
    const getCredentialsForPlan = (planId: string): Credential[] => {
        return credentials.filter((c) => c.planId === planId);
    };

    // --- Socket.IO sync ---
    useEffect(() => {
        if (!socket) return;

        const handleSync = () => {
            queryClient.invalidateQueries({ queryKey: ["credentials"] });
        };

        socket.on("credential", handleSync);

        return () => {
            socket.off("credential", handleSync);
        };
    }, [queryClient]);

    return {
        credentials,
        isLoading,
        addCredential: addMutation.mutateAsync,
        updateCredential: updateMutation.mutateAsync,
        deleteCredential: deleteMutation.mutateAsync,
        getCredentialsForPlan,
    };
};

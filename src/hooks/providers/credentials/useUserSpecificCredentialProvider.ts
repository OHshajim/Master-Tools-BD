import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { secureApi } from "@/hooks/axios/useAxios";
import { socket } from "@/lib/socket";
import { Credential } from "@/types";

export interface UserSpecificCredential extends Credential {
    userId: string;
}

export const useUserSpecificCredentialProvider = () => {
    const { user, isLoading } = useAuth();
    const queryClient = useQueryClient();

    // 🔹 Fetcher function
    const fetchUserCredentials = async (): Promise<
        UserSpecificCredential[]
    > => {
        if (!user) return [];
        const { data } = await secureApi.get(
            "/api/credential/specificCredential"
        );
        return data;
    };

    // 🔹 React Query integration
    const {
        data: userCredentials = [],
        isLoading: credentialsLoading,
        refetch,
    } = useQuery<UserSpecificCredential[], Error>({
        queryKey: ["userCredentials", user?._id],
        queryFn: fetchUserCredentials,
        enabled: !!user && !isLoading,
        staleTime: 1000 * 30, // cache for 30s
    });

    // 🔹 Socket.IO listeners (real-time updates)
    useEffect(() => {
        if (!user) return;

        const handleCredentialEvent = () => {
            queryClient.invalidateQueries({
                queryKey: ["userCredentials", user._id],
            });
        };

        socket.on("credential", handleCredentialEvent);

        return () => {
            socket.off("credential", handleCredentialEvent);
        };
    }, [user, queryClient]);

    // 🔹 CRUD Methods
    const addUserSpecificCredential = async (
        credentialData: Omit<UserSpecificCredential, "_id">
    ) => {
        await secureApi.post(
            "/api/credential",
            credentialData
        );
        toast({
            title: "Credential Added",
            description: `Credential for ${credentialData.platform} added.`,
        });
        refetch();
    };

    const updateUserSpecificCredential = async (
        credential: UserSpecificCredential
    ) => {
        await secureApi.put(
            `/api/credential/${credential._id}`,
            credential
        );
        toast({
            title: "Credential Updated",
            description: `Credential for ${credential.platform} updated.`,
        });
        refetch();
    };

    const deleteUserSpecificCredential = async (id: string) => {
        await secureApi.delete(`/api/credential/${id}`);
        toast({ title: "Credential Deleted" });
        refetch();
    };

    // 🔹 Helper Getters
    const getUserCredentialsForPlan = (
        planId: string
    ): UserSpecificCredential[] => {
        return userCredentials.filter(
            (cred) => cred.userId === user?._id && cred.planId === planId
        );
    };

    const getUserCredentials = (): UserSpecificCredential[] => {
        return userCredentials.filter((cred) => cred.userId === user?._id);
    };
    
    const getBulkUserPlatformData = () => {
        return userCredentials.map((cred) => ({
            _id: cred._id,
            userId: cred.userId,
            planId: cred.planId,
            platform: cred.platform,
            type: "credential",
            updatedAt: cred.updatedAt,
        }));
    };

    return {
        userCredentials,
        credentialsLoading,
        addUserSpecificCredential,
        updateUserSpecificCredential,
        deleteUserSpecificCredential,
        getUserCredentialsForPlan,
        getUserCredentials,
        getBulkUserPlatformData,
    };
};

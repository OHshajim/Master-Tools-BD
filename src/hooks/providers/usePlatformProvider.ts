import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { platformService } from "@/services/platformService";
import { Platform } from "@/types/dataTypes";
import { toast } from "@/hooks/use-toast";

export const usePlatformProvider = () => {
    const queryClient = useQueryClient();

    const {
        data: platforms = [],
        isLoading: loading,
        refetch,
        error,
    } = useQuery<Platform[]>({
        queryKey: ["platforms"],
        queryFn: platformService.getPlatforms,
    });

    // --- Add Platform ---
    const addPlatform = useMutation({
        mutationFn: (platform: Omit<Platform, "_id">) =>
            platformService.addPlatform(platform),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platforms"] });
            toast.success("Platform added successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to add platform");
        },
    });

    // --- Update Platform ---
    const updatePlatform = useMutation({
        mutationFn: ({
            id,
            platform,
        }: {
            id: string;
            platform: Partial<Platform>;
        }) => platformService.updatePlatform(id, platform),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platforms"] });
            toast.success("Platform updated successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update platform");
        },
    });

    // --- Delete Platform ---
    const deletePlatform = useMutation({
        mutationFn: (id: string) => platformService.deletePlatform(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platforms"] });
            toast.success("Platform deleted successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to delete platform");
        },
    });

    return {
        platforms,
        loading,
        error,
        loadPlatforms: refetch,
        addPlatform: addPlatform.mutate,
        updatePlatform: updatePlatform.mutate,
        deletePlatform: deletePlatform.mutate,
    };
};

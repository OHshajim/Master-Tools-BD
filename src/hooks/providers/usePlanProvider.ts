import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planApi } from "@/services/planApi";
import { Plan } from "@/types/dataTypes";
import { formatService } from "@/services/formatServices";
import { toast } from "@/hooks/use-toast";
import { socket } from "@/lib/socket";

export const usePlanProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch Plans ---
    const {
        data: plans = [],
        isLoading: loading,
        refetch,
        error,
    } = useQuery<Plan[]>({
        queryKey: ["plans"],
        queryFn: planApi.getPlans,
    });

    // --- Add Plan ---
    const addPlan = useMutation({
        mutationFn: (plan: Omit<Plan, "_id" | "createdAt" | "updatedAt">) =>
            planApi.createPlan(plan),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["plans"] });
                toast.success("Plan created successfully");
            } else {
                toast.error("Try again later");
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to create plan");
        },
    });

    // --- Update Plan ---
    const updatePlan = useMutation({
        mutationFn: (plan: Plan) => planApi.updatePlan(plan._id, plan),
        onMutate: async (plan) => {
            await queryClient.cancelQueries({ queryKey: ["plans"] });

            const previousPlans = queryClient.getQueryData<Plan[]>(["plans"]);

            queryClient.setQueryData<Plan[]>(["plans"], (old = []) =>
                old.map((p) => (p._id === plan._id ? { ...p, ...plan } : p))
            );

            return { previousPlans };
        },
        onError: (err, plan, context) => {
            queryClient.setQueryData(["plans"], context?.previousPlans);
            toast.error(err?.message || "Failed to update plan");
        },
        onSuccess: () => {
            toast.success("Plan updated successfully");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    // --- Delete Plan ---
    const deletePlan = useMutation({
        mutationFn: (id: string) => planApi.deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            toast.success("Plan deleted successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to delete plan");
        },
    });

    // --- Helpers ---
    const getPlanById = (id: string) => plans.find((p) => p._id === id) || null;
    const formatPlanDuration = (plan: Plan) =>
        formatService.formatPlanDuration(plan.durationType, plan.durationValue);

    useEffect(() => {
        const handlePlanUpdate = () => {
            refetch();
        };

        socket.on("planUpdated", handlePlanUpdate);

        return () => {
            socket.off("planUpdated", handlePlanUpdate);
        };
    }, [refetch, socket]);

    return {
        plans,
        loading,
        error,
        addPlan: addPlan.mutate,
        updatePlan: updatePlan.mutate,
        deletePlan: deletePlan.mutate,
        loadPlans: refetch,
        getPlanById,
        formatPlanDuration,
    };
};

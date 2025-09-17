import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "@/services/couponService";
import { Coupon } from "@/types/dataTypes";
import { toast } from "@/hooks/use-toast";


export const useCouponProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch Coupons ---
    const { data: coupons = [], isLoading: loading, error, refetch } = useQuery<Coupon[]>({
        queryKey: ["coupons"],
        queryFn: couponService.getCoupons,
    });

    // --- Add Coupon ---
    const addCoupon = useMutation({
        mutationFn: (coupon: Omit<Coupon, "_id" | "createdAt" | "updatedAt">) =>
            couponService.addCoupon(coupon),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success("Coupon added successfully");
        },
        onError: (err) => {
            toast.error(
                    err.message ||
                    "Failed to add coupon"
            );
        },
    });

    // --- Update Coupon ---
    const updateCoupon = useMutation({
        mutationFn: (coupon: Coupon) => couponService.updateCoupon(coupon),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success("Coupon updated successfully");
        },
        onError: (err) => {
            toast.error(
                    err.message ||
                    "Failed to update coupon"
            );
        },
    });

    // --- Delete Coupon ---
    const deleteCoupon = useMutation({
        mutationFn: (id: string) => couponService.deleteCoupon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success("Coupon deleted successfully");
        },
        onError: (err) => {
            toast.error(
                    err.message ||
                    "Failed to delete coupon"
            );
        },
    });

    // --- Helpers ---
    const getCouponsForPlan = async (planId: string) => {
        return await couponService.getCouponsForPlan(planId);
    };

    const validateCoupon = async (code: string, planId: string) => {
        return await couponService.validateCoupon(code, planId);
    };

    return {
        coupons,
        loading,
        error,
        refetch,
        addCoupon: addCoupon.mutate,
        updateCoupon: updateCoupon.mutate,
        deleteCoupon: deleteCoupon.mutate,
        getCouponsForPlan,
        validateCoupon,
    };
};

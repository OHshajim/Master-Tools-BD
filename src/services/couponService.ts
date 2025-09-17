import { Coupon } from "@/types/coupon";
import { api, secureApi } from "@/hooks/axios/useAxios";

const API_BASE = "/api/coupons";

export const couponService = {
    addCoupon: async (
        coupon: Omit<Coupon, "_id" | "createdAt" | "updatedAt">
    ): Promise<Coupon> => {
        const res = await secureApi.post(API_BASE, coupon);
        return res.data;
    },

    updateCoupon: async (coupon: Coupon): Promise<Coupon> => {
        const res = await secureApi.put(
            `${API_BASE}/${coupon._id}`,
            coupon
        );
        return res.data;
    },

    deleteCoupon: async (id: string): Promise<{ success: boolean }> => {
        const res = await secureApi.delete(
            `${API_BASE}/${id}`
        );
        return res.data;
    },

    getCoupons: async (): Promise<Coupon[]> => {
        const res = await secureApi.get(API_BASE);
        return res.data.coupons;
    },

    getCouponsForPlan: async (planId: string): Promise<Coupon[]> => {
        const res = await secureApi.get(
            `${API_BASE}?planId=${planId}`
        );
        return res.data;
    },

    validateCoupon: async (
        code: string,
        planId: string
    ): Promise<Coupon | null> => {
        const res = await api.post(`${API_BASE}/validate`, {
            code,
            planId,
        });
        return res.data;
    },
};

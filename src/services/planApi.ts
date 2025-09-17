import { api, secureApi } from "@/hooks/axios/useAxios";
import { Plan } from "@/types/dataTypes";

const BASE_URL = "/api/plans";

export const planApi = {
    // Public API
    getPlansForUser: async (filters = {}): Promise<Plan[]> => {
        const res = await api.get(BASE_URL, { params: filters });
        return res.data;
    },
    getPlanBySlug: async (slug = "") => {
        const res = await api.get(`${BASE_URL}/${slug}`);
        return res.data;
    },

    // for admin
    getPlans: async (): Promise<Plan[]> => {
        const res = await api.get(BASE_URL);
        return res.data;
    },
    getPlanById: async (id: string): Promise<Plan> => {
        const res = await api.get(`${BASE_URL}/${id}`);
        return res.data;
    },
    getAllPlans: async (): Promise<Plan[]> => {
        const res = await api.get(`${BASE_URL}/all`);
        return res.data;
    },
    TogglePlan: async (id) => {
        const res = await secureApi.patch(`${BASE_URL}/${id}`);
        return res.data;
    },
    createPlan: async (plan: Omit<Plan, "_id" | "createdAt" | "updatedAt">) => {
        const res = await secureApi.post(BASE_URL, plan);
        return res.data;
    },
    updatePlan: async (
        id: string,
        plan: Partial<Omit<Plan, "_id" | "createdAt" | "updatedAt">>
    ): Promise<Plan> => {
        const res = await secureApi.put(`${BASE_URL}/${id}`, plan);
        return res.data;
    },
    deletePlan: async (id: string): Promise<void> => {
        await secureApi.delete(`${BASE_URL}/${id}`);
    },
};

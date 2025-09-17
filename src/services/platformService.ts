import axios from "axios";
import { Platform } from "@/types/dataTypes";
import { api, secureApi } from "@/hooks/axios/useAxios";

const API_BASE = "/api/platforms"; // Adjust this to your backend route

export const platformService = {
    // Fetch all platforms
    getPlatforms: async (): Promise<Platform[]> => {
        const res = await api.get(API_BASE);
        return res.data.platforms;
    },

    // Add a new platform
    addPlatform: async (platform: Omit<Platform, "_id">): Promise<Platform> => {
        const res = await secureApi.post(API_BASE, platform);
        return res.data.platform;
    },

    // Update existing platform
    updatePlatform: async (
        id: string,
        platform: Partial<Platform>
    ): Promise<Platform> => {
        const res = await secureApi.put(`${API_BASE}/${id}`, platform);
        return res.data.platform;
    },

    // Delete platform
    deletePlatform: async (id: string): Promise<{ message: string }> => {
        const res = await secureApi.delete(`${API_BASE}/${id}`);
        return res.data;
    },

    // Get platform by ID
    getPlatformById: async (id: string): Promise<Platform> => {
        const res = await axios.get(`${API_BASE}/${id}`);
        return res.data.platform;
    },
};

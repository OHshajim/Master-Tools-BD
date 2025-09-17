import { api } from '@/hooks/axios/useAxios';
import { CopyButtonVisibility, PlanVisibilitySettings, GlobalVisibilitySettings, CopyButtonVisibilityState } from '@/types/copyButtonVisibility';

const STORAGE_KEY = 'copyButtonVisibility';

const getStorageData = (): CopyButtonVisibilityState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      platformVisibility: [],
      planVisibility: [],
      globalVisibility: { isVisible: true, updatedAt: new Date().toISOString() }
    };
  } catch {
    return {
      platformVisibility: [],
      planVisibility: [],
      globalVisibility: { isVisible: true, updatedAt: new Date().toISOString() }
    };
  }
};

const saveStorageData = (data: CopyButtonVisibilityState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save copy button visibility data:', error);
  }
};

export const copyButtonVisibilityService = {
    // Get all data
    getAllVisibilityData: async (): Promise<CopyButtonVisibilityState> => {
        const { data: records } = await api.get("/api/copy-visibility");
        return records;
    },

    // Platform-specific visibility
    setPlatformVisibility: async(
        platformId: string,
        planId: string,
        isVisible: boolean
    ): CopyButtonVisibility[] => {
        const { data } = await api.put(
            `/api/copy-visibility/platform/${platformId}`,
            {
                isVisible,
                planId
            }
        );
        return data;
    },

    // Plan-wide visibility
    setPlanVisibility: async(
        planId: string,
        isVisible: boolean
    ): PlanVisibilitySettings[] => {
        const { data } = await api.put(`/api/copy-visibility/plan/${planId}`, {
            isVisible,
        });
        return data;
    },

    // Global visibility
    setGlobalVisibility: async (isVisible: boolean): GlobalVisibilitySettings => {
        const { data } = await api.put("/api/copy-visibility/global",{isVisible});
        return data;
    },

    // Get visibility for a specific platform
    isPlatformCopyButtonVisible: (
        platformId: string,
        planId: string,
        visibilityData
    ): boolean => {
        const data = visibilityData;

        // Check global visibility first
        if (!data.globalVisibility.isVisible) {
            return false;
        }

        // Check plan visibility
        const planSetting = data.planVisibility.find(
            (item) => item.planId === planId
        );
        if (planSetting && !planSetting.isVisible) {
            return false;
        }

        // Check platform-specific visibility
        const platformSetting = data.platformVisibility.find(
            (item) => item.platformId === platformId && item.planId === planId
        );

        return platformSetting ? platformSetting.isVisible : true;
    },

    // Get platform visibility for a plan
    getPlatformVisibilityForPlan: (planId: string): CopyButtonVisibility[] => {
        const data = getStorageData();
        return data.platformVisibility.filter((item) => item.planId === planId);
    },
};
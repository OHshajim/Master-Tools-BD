import { useState, useEffect } from 'react';
import { copyButtonVisibilityService } from '@/services/copyButtonVisibilityService';
import { CopyButtonVisibility, CopyButtonVisibilityState } from '@/types/copyButtonVisibility';

export const useCopyButtonVisibilityProvider = () => {
  const [visibilityData, setVisibilityData] = useState<CopyButtonVisibilityState>();

  const loadData = async () => {
      try {
          const data = await copyButtonVisibilityService.getAllVisibilityData();
          setVisibilityData(data);
      } catch (error) {
          console.error("Failed to fetch visibility data:", error);
      }
  };

  useEffect(() => {
      loadData();
  }, []);

  const setPlatformVisibility = async (platformId: string, planId: string, isVisible: boolean) => {
    const updatedData = await copyButtonVisibilityService.setPlatformVisibility(platformId, planId, isVisible);
    await loadData();
  };

  const setPlanVisibility = async (planId: string, isVisible: boolean) => {
    const updatedData = await copyButtonVisibilityService.setPlanVisibility(planId, isVisible);
    await loadData();
  };

  const setGlobalVisibility = async (isVisible: boolean) => {
    const updatedData = await copyButtonVisibilityService.setGlobalVisibility(isVisible);
    await loadData();
  };

  const isPlatformCopyButtonVisible = (platformId: string, planId: string): boolean => {
    return copyButtonVisibilityService.isPlatformCopyButtonVisible(
        platformId,
        planId,
        visibilityData
    );
  };

  const getPlatformVisibilityForPlan = (planId: string): CopyButtonVisibility[] => {
    return visibilityData.platformVisibility.filter(
        (item) => item.planId === planId
    );
  };

  return {
    visibilityData,
    setPlatformVisibility,
    setPlanVisibility,
    setGlobalVisibility,
    isPlatformCopyButtonVisible,
    getPlatformVisibilityForPlan
  };
};

import { useDataContext } from './useDataContext';
import { Platform } from '@/types/dataTypes';

export const usePlatforms = () => {
  const { 
    platforms, 
    addPlatform, 
    updatePlatform, 
    deletePlatform 
  } = useDataContext();
  
  return {
    platforms,
    addPlatform,
    updatePlatform,
    deletePlatform
  };
};

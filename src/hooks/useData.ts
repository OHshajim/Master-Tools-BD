
import { useDataContext } from './useDataContext';
import type { DataContextType } from '@/types/dataContext';

// Re-export types for convenience
export type { 
  Platform, 
  Plan, 
  Coupon, 
  Credential, 
  Order, 
  Cookie, 
  DataContextType 
} from '@/types';

/**
 * Custom hook to use data context
 * @returns All data context values and methods
 */
export const useData = (): DataContextType => {
  return useDataContext();
};


import React, { createContext, ReactNode } from 'react';
import { DataContextType } from '@/types/dataContext';
import { useDataProvider } from '@/hooks/useDataProvider';

// Create context
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Use our data provider hook to handle all the logic
  const contextValue = useDataProvider();

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Re-export types for convenience
export type { 
  Platform, 
  Plan, 
  Coupon, 
  Credential, 
  Order, 
  Cookie,
  DraftPlatformStatus 
} from '@/types';

// Re-export useData for backward compatibility
export { useData } from '@/hooks/useData';

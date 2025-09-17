
import { useContext } from 'react';
import { DataContext } from '@/contexts/DataContext';
import { DataContextType } from '@/types/dataContext';

/**
 * Custom hook to use the data context
 * @returns DataContextType context
 */
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

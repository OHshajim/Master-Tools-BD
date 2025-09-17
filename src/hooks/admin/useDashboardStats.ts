
import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/dataTypes'; // Assuming Order type is available

export const useDashboardStats = () => {
  const { orders } = useData();
  const { getUsers } = useAuth();

  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [blockedUsersCount, setBlockedUsersCount] = useState<number>(0);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);

  const refreshStats = useCallback(() => {
    setPendingOrdersCount(orders.filter((order: Order) => order.status === 'pending').length);
    
    const allUsers = getUsers();
    setTotalUsersCount(5);
    setBlockedUsersCount([].filter(u => u.blocked).length);
  }, [orders, getUsers]);

  useEffect(() => {
    refreshStats();
    const intervalId = setInterval(refreshStats, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [refreshStats]);

  return {
    pendingOrdersCount,
    blockedUsersCount,
    totalUsersCount,
  };
};


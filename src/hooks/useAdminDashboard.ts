
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useRoleBasedNavigation } from './admin/useRoleBasedNavigation';
import { useDashboardStats } from './admin/useDashboardStats';
import { Order } from '@/types/dataTypes'; // Ensure Order type is imported

export const useAdminDashboard = () => {
  // Handles role-based navigation and authentication checks
  useRoleBasedNavigation();

  // Get core data from contexts
  const { user } = useAuth(); // getUsers is called within useDashboardStats
  const { orders, plans, platforms } = useData(); // Removed unused 'coupons'

  // Get calculated dashboard statistics
  const { 
    pendingOrdersCount, 
    blockedUsersCount, 
    totalUsersCount 
  } = useDashboardStats();

  // Sort orders by date, newest first
  const sortedOrders = [...orders].sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    user,
    plans,
    platforms,
    orders: sortedOrders, // Return sorted orders
    pendingOrders: pendingOrdersCount,
    totalUsers: totalUsersCount,
    blockedUsers: blockedUsersCount,
  };
};

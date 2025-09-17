
import { SummaryCards } from '@/components/admin/dashboard/SummaryCards';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { PendingOrdersCard } from '@/components/admin/dashboard/PendingOrdersCard';
import { RecentOrdersCard } from '@/components/admin/dashboard/RecentOrdersCard';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

const ManagerDashboard = () => {
  const {
    plans,
    platforms,
    orders,
    pendingOrders,
    totalUsers,
    blockedUsers
  } = useAdminDashboard();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage platform operations</p>
      
      {/* Summary Cards */}
      <SummaryCards
        plansCount={plans.length}
        platformsCount={platforms.length}
        ordersCount={orders.length}
        totalUsers={totalUsers}
        blockedUsers={blockedUsers}
      />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Pending Orders */}
      <PendingOrdersCard 
        orders={orders}
        pendingOrders={pendingOrders}
      />
      
      {/* Recent Activity */}
      <RecentOrdersCard orders={orders} />
    </div>
  );
};

export default ManagerDashboard;

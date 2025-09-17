
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Order } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { sortOrdersByDate } from '@/services/orderService';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { getUserOrders } = useData();
  const [orders,setOrders] = useState([])
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

  useEffect(() => {
      if (!user || isLoading) return;

      const LoadData = () => {
          const data = getUserOrders(user._id);
          setOrders(data);

          const sortedOrders = sortOrdersByDate(data);
          const approvedOrdersFiltered = sortedOrders?.filter(
              (order) => order.status === "approved"
          );
          setApprovedOrders(approvedOrdersFiltered);

          const pendingOrdersFiltered = sortedOrders?.filter(
              (order) => order.status === "pending"
          );
          setPendingOrders(pendingOrdersFiltered);
      };

      LoadData();
  }, [user, isLoading, getUserOrders]);


  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Please Login to Access Your Dashboard</h1>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}</p>
      
      <DashboardContent 
        user={user} 
        orders={orders} 
        approvedOrders={approvedOrders} 
        pendingOrders={pendingOrders} 
      />
    </div>
  );
};

export default Dashboard;

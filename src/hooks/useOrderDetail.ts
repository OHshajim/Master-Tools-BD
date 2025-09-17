import { orderService } from '@/services/orderService';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Order, Plan } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

interface UseOrderDetailProps {
  id: string | undefined;
}

interface UseOrderDetailReturn {
  order: Order | null;
  orderUser: any;
  plan: Plan;
  isLoading: boolean;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  handleStatusChange: (newStatus: Order['status']) => Promise<void>;
}

export const useOrderDetail = ({ id }: UseOrderDetailProps): UseOrderDetailReturn => {
  const { user, isAdmin, isManager, isSupport, getUserById } = useAuth();
  const { getOrder, plans, updateOrderStatus } = useData();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderUser, setOrderUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Validate user role - only admin, manager, or support can access
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
      return;
    }
    
    if (!id) return;

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      
      // Get the order
      const foundOrder = await orderService.getOrderById(id);
      
      if (!foundOrder) {
        // Redirect based on user role
        if (isAdmin) {
          navigate('/admin/orders');
        } else if (isManager) {
          navigate('/admin/orders');
        } else if (isSupport) {
          navigate('/admin/orders');
        } else {
          navigate('/dashboard');
        }
        return;
      }
      
      setOrder(foundOrder);
      
      // Get the plan
      const foundPlan = plans.find(p => p._id === foundOrder.planId);
      setPlan(foundPlan);
      
      // Get the user
      const foundUser = await getUserById(foundOrder.userId);
      setOrderUser(foundUser);
      setIsLoading(false);
    };
    
    fetchOrderDetails();
    
    // Set up a listener to handle order updates from other tabs/devices
    const handleOrdersUpdate = () => {
      if (id) {
        const updatedOrder = getOrder(id);
        if (updatedOrder) setOrder(updatedOrder);
      }
    };
    
    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    window.addEventListener('storage', handleOrdersUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
      window.removeEventListener('storage', handleOrdersUpdate);
    };
  }, [user, isAdmin, isManager, isSupport, id, navigate, getOrder, plans, getUserById]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order || !id) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    order,
    orderUser,
    plan,
    isLoading,
    isUpdating,
    setIsUpdating,
    handleStatusChange
  };
};

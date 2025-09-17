
import { useDataContext } from './useDataContext';
import { orderService } from '@/services/orderService';

export const useOrders = () => {
  const {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders
  } = useDataContext();
  
  const isOrderExpired = (orderId: string) => {
    const order = getOrder(orderId);
    if (!order) return false;
    return orderService.isOrderExpired(order);
  };
  
  return {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders,
    isOrderExpired
  };
};

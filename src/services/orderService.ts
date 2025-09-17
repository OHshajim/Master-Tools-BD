import axios from "axios";
import { Order, Plan, DurationType } from "@/types/dataTypes";
import { addDays, addHours, addMinutes, addMonths, addYears } from "date-fns";
import { formatService } from "./formatServices";
import { api, secureApi } from "@/hooks/axios/useAxios";
const API_BASE = "/api/orders"; // Update with your API base URL

export const calculateExpirationDate = (
    purchaseDate: Date,
    plan: Plan
): Date => {
    const { durationType, durationValue } = plan;

    switch (durationType as DurationType) {
        case "minutes":
            return addMinutes(purchaseDate, durationValue || 0);
        case "hours":
            return addHours(purchaseDate, durationValue || 0);
        case "days":
            return addDays(purchaseDate, durationValue || 0);
        case "weeks":
            return addDays(purchaseDate, (durationValue || 0) * 7);
        case "months":
            return addMonths(purchaseDate, durationValue || 0);
        case "years":
            return addYears(purchaseDate, durationValue || 0);
        default:
            return addDays(purchaseDate, 30); // Default 30 days
    }
};

export const formatPlanDuration = (plan: Plan): string => {
    return formatService.formatPlanDuration(
        plan.durationType,
        plan.durationValue
    );
};

export const sortOrdersByDate = (orders: Order[]): Order[] => {
    return [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return dateB.getTime() - dateA.getTime();
    });
};


export const orderService = {
    // Fetch all orders
    getOrders: async (): Promise<Order[]> => {
      try {
          const { data } = await secureApi.get(`${API_BASE}`);
          if (!data.success) {
              throw new Error("Failed to fetch orders");
          }
          return Array.isArray(data.orders) ? data.orders : [];
      } catch (error) {
          console.error("Error fetching orders:", error);
          return [];
      }
    },

    // Create a new order
    createOrder: async (orderData) => {
      const { data } = await secureApi.post(`${API_BASE}`, orderData);
      console.log(data);
      return data.order;
    },

    // Update an order
    updateOrder: async (
        orderId: string,
        updateData: Partial<Order>
    ): Promise<Order> => {
        const { data } = await secureApi.put(`${API_BASE}/${orderId}`, updateData);
        return data.order;
    },

    // Delete an order
    deleteOrder: async (orderId: string): Promise<{ success: boolean }> => {
        const { data } = await secureApi.delete(`${API_BASE}/${orderId}`);
        return data;
    },

    // Get order by ID
    getOrderById: async (orderId: string): Promise<Order> => {
        const { data } = await api.get(`${API_BASE}/${orderId}`);
        return data.order;
    },

    // Get orders by user
    getUserOrders: async (userId: string): Promise<Order[]> => {
        const { data } = api.get(`${API_BASE}/user/${userId}`);
        return data.orders;
    },

    isOrderExpired: (order: Order): boolean => {
        if (!order.expirationDate) return false;
        const expirationDate = new Date(order.expirationDate);
        return new Date() > expirationDate;
    },
};

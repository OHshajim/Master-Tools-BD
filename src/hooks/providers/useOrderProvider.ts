import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/types/dataTypes";
import { orderService } from "@/services/orderService";
import { toast } from "@/hooks/use-toast";
import { socket } from "@/lib/socket";


export const useOrderProvider = () => {
    const queryClient = useQueryClient();

    // --- Fetch all orders ---
    const {
        data: orders = [],
        isLoading,
        error,
        refetch,
    } = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: orderService.getOrders,
    });

    // --- Create order ---
    const createOrderMutation = useMutation({
        mutationFn: async (params: {
            userId: string;
            userName: string;
            planId: string;
            planName: string;
            originalPrice: number;
            lastFourDigits: string;
            couponCode?: string;
            couponDiscount?: number;
        }) => {
            return orderService.createOrder(params);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to create order");
        },
    });

    // --- Update order status ---
    const updateOrderStatusMutation = useMutation({
        mutationFn: ({
            orderId,
            status,
        }: {
            orderId: string;
            status: Order["status"];
        }) => orderService.updateOrder(orderId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update order status");
        },
    });

    // --- Get order by ID ---
    const getOrder = (id: string): Order | undefined => {
        return orders.find((o) => o._id === id);
    };

    // --- Get orders for a specific user ---
    const getUserOrders = (userId: string): Order[] => {
        return orders.filter((o) => o.userId === userId);
    };

    // --- 🔥 Real-time Updates ---
    useEffect(() => {
        socket.on("orderUpdated", (change) => {
            queryClient.setQueryData(["orders"], () => {
                refetch();
            });
        });

        return () => {
            socket.off("orderUpdated");
        };
    }, [queryClient]);

    return {
        orders,
        isLoading,
        error,
        refetch,
        createOrder: createOrderMutation.mutate,
        updateOrderStatus: updateOrderStatusMutation.mutate,
        getOrder,
        getUserOrders,
    };
};

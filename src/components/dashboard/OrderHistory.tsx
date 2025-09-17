import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { OrderHistoryMobile } from "./OrderHistoryMobile";
import { OrderHistoryDesktop } from "./OrderHistoryDesktop";
import { useOrderProvider } from "@/hooks/providers/useOrderProvider";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const OrderHistory = () => {
    const [orders,setOrders] = useState([])
    const {user}= useAuth()
    const isMobile = useIsMobile();
    const { handlePDFDownload, isOrderGenerating } = useOrderHistory();

    const { orders:data, isLoading, error } = useOrderProvider();

    useEffect(()=>{
        setOrders(data?.filter((o) => o.userId === user._id)??[])
    },[data,user])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Loading your orders...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                        Failed to load orders. Please try again later.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!orders || orders.length === 0) {
        return null;
    }

    // Orders are already sorted by date in the service
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                    All your past orders and their status
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isMobile ? (
                    <OrderHistoryMobile
                        orders={orders}
                        onPDFDownload={handlePDFDownload}
                        isOrderGenerating={isOrderGenerating}
                    />
                ) : (
                    <OrderHistoryDesktop
                        orders={orders}
                        onPDFDownload={handlePDFDownload}
                        isOrderGenerating={isOrderGenerating}
                    />
                )}
            </CardContent>
        </Card>
    );
};

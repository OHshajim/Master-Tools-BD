import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/contexts/DataContext';
import { Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatUtils';

interface PendingOrdersProps {
  pendingOrders: Order[];
}

export const PendingOrders = ({ pendingOrders }: PendingOrdersProps) => {
  if (pendingOrders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8" data-testid="pending-orders">
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
        <CardDescription>Orders that are waiting for admin approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingOrders?.map(order => (
            <div key={order._id} data-order-id={order._id} className="border rounded-md p-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{order.planName}</h3>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span>Ordered on {formatDate(order.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-yellow-50 border-t text-sm text-yellow-700 px-6">
        <p>
          Pending orders are usually approved within 24 hours. You'll receive access once approved.
        </p>
      </CardFooter>
    </Card>
  );
};

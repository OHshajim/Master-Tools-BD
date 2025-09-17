
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/dataTypes';

interface PendingOrdersCardProps {
  orders: Order[];
  pendingOrders: number;
}

export const PendingOrdersCard = ({ orders, pendingOrders }: PendingOrdersCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders requiring approval</CardDescription>
        </div>
        {pendingOrders > 0 && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
            {pendingOrders} pending
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {orders.filter(order => order.status === 'pending').length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(order => order.status === 'pending')
                  .map(order => (
                    <tr key={order._id} className="border-b">
                      <td className="py-3">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="py-3">{order.userName}</td>
                      <td className="py-3">{order.planName}</td>
                      <td className="py-3">${order.finalPrice.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No pending orders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

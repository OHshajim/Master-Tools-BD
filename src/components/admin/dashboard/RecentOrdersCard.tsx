
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/dataTypes';
import { formatDate } from '@/utils/formatUtils'; // Import formatDate

interface RecentOrdersCardProps {
  orders: Order[];
}

export const RecentOrdersCard = ({ orders }: RecentOrdersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders // Orders are now pre-sorted from useAdminDashboard
                  .slice(0, 5) // We only need to slice here as sorting is done upstream
                  .map(order => (
                    <tr key={order._id} className="border-b">
                      <td className="py-3">{formatDate(order.date)}</td> {/* Use formatDate here */}
                      <td className="py-3">{order.userName}</td>
                      <td className="py-3">{order.planName}</td>
                      <td className="py-3">
                        <Badge className={
                          order.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">View</Button>
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
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

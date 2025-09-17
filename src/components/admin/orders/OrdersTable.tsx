
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatUtils';

interface OrdersTableProps {
  filteredOrders: Order[];
  statusFilter: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ filteredOrders, statusFilter }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              {filteredOrders.length} orders found
            </CardDescription>
          </div>
          <div className="text-sm text-gray-500">
            {statusFilter !== "all" && (
              <Badge className={
                statusFilter === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                'bg-red-100 text-red-800 border-red-200'
              }>
                {statusFilter}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="py-3">{formatDate(order.date)}</td>
                    <td className="py-3">{order.userName}</td>
                    <td className="py-3">{order.planName}</td>
                    <td className="py-3">${order.finalPrice.toFixed(2)}</td>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400">Try changing your filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;

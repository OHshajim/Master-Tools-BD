
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, Plan } from '@/types/dataTypes';
import { formatRelativeDate } from '@/utils/formatUtils';

interface UserOrdersListProps {
  orders: Order[];
  plans: Plan[];
  selectedPlanId: string;
  onPlanSelect: (planId: string) => void;
}

const UserOrdersList: React.FC<UserOrdersListProps> = ({
  orders,
  plans,
  selectedPlanId,
  onPlanSelect
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No purchased plans found for this user.
      </div>
    );
  }

  const getPlanName = (planId: string) => {
    return plans.find(p => p._id === planId)?.name || 'Unknown Plan';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order._id} className={`cursor-pointer transition-colors ${
          selectedPlanId === order.planId ? 'ring-2 ring-blue-500' : ''
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium">{getPlanName(order.planId)}</h4>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Order ID: {order._id}</p>
                  <p>Price: ${order.finalPrice}</p>
                  <p>Purchased: {formatRelativeDate(order.createdAt)}</p>
                  {order.expiresAt && (
                    <p>Expires: {formatRelativeDate(order.expiresAt)}</p>
                  )}
                </div>
              </div>
              <Button
                variant={selectedPlanId === order.planId ? "default" : "outline"}
                onClick={() => onPlanSelect(order.planId)}
              >
                {selectedPlanId === order.planId ? 'Selected' : 'Select'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrdersList;

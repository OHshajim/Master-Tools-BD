
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order } from '@/types/dataTypes';
import { useAuth } from '@/contexts/AuthContext';

interface OrderActionsProps {
  order: Order;
  isUpdating: boolean;
  handleStatusChange: (status: Order['status']) => void;
  plan: any | null;
  orderUser: any | null;
}

export const OrderActions = ({ order, isUpdating, handleStatusChange, plan, orderUser }: OrderActionsProps) => {
  const { isAdmin, isSupport } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
        <CardDescription>Manage this order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Update Status</h3>
          <div className="space-y-4">
            <Select
              value={order?.status}
              onValueChange={(value: Order['status']) => handleStatusChange(value)}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={order?.status === 'approved' ? "outline" : "default"} 
                className="w-full"
                onClick={() => handleStatusChange('approved')}
                disabled={order?.status === 'approved' || isUpdating}
              >
                Approve
              </Button>
              <Button 
                variant={order?.status === 'cancelled' ? "outline" : "destructive"} 
                className="w-full"
                onClick={() => handleStatusChange('cancelled')}
                disabled={order?.status === 'cancelled' || isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
        
        {isAdmin && orderUser && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Customer Actions</h3>
            <div className="space-y-2">
              <Link className="block" to={`/admin/users?search=${orderUser?.email || ''}`}>
                <Button variant="outline" className="w-full">
                  View Customer Details
                </Button>
              </Link>
              <Link className="block" to={`/admin/orders?search=${orderUser?.name || ''}`}>
                <Button variant="outline" className="w-full">
                  View Customer all Orders
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

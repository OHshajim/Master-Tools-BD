import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/contexts/DataContext';
import { Package, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatUtils';
import { orderService, sortOrdersByDate } from '@/services/orderService';

interface SubscriptionsProps {
  approvedOrders: Order[];
}

export const Subscriptions = ({ approvedOrders }: SubscriptionsProps) => {
  // Filter active (non-expired) subscriptions and sort by date (newest first)
  const activeSubscriptions = sortOrdersByDate(
    approvedOrders.filter(order => !orderService.isOrderExpired(order))
  );
  
  // Filter expired subscriptions and sort by date (newest first)
  const expiredSubscriptions = sortOrdersByDate(
    approvedOrders.filter(order => orderService.isOrderExpired(order))
  );

  return (
    <Card className="mb-8" data-testid="subscriptions">
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
        <CardDescription>Active plans that you have access to</CardDescription>
      </CardHeader>
      <CardContent>
        {activeSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {activeSubscriptions?.map(order => (
              <div key={order._id} data-order-id={order._id} className="border rounded-md p-4 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{order.planName}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span>Purchased on {formatDate(order.date)}</span>
                  </div>
                  {order.expirationDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span>Expires on {formatDate(order.expirationDate)}</span>
                    </div>
                  )}
                </div>
                <Link to={`/access/${order.planId}`}>
                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800">
                    Access Credentials
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : expiredSubscriptions.length > 0 ? (
          <div className="space-y-4">
            <div className="text-center py-4 mb-4">
              <h3 className="text-lg font-medium mb-2">All Subscriptions Expired</h3>
              <p className="text-gray-600 mb-4">
                Your subscriptions have expired. Please renew or purchase a new plan to continue.
              </p>
              <Link to="/plans">
                <Button>Browse Plans</Button>
              </Link>
            </div>
            
            {expiredSubscriptions?.map(order => (
              <div key={order._id} data-order-id={order._id} className="border border-red-200 rounded-md p-4 bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{order.planName}</h3>
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    Expired
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span>Purchased on {formatDate(order.date)}</span>
                  </div>
                  {order.expirationDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600">Expired on {formatDate(order.expirationDate)}</span>
                    </div>
                  )}
                </div>
                <Link to={`/plans`}>
                  <Button variant="outline" size="sm">Renew Subscription</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">No Active Subscriptions</h3>
            <p className="text-gray-600 mb-4">
              You don't have any active subscriptions yet. Browse our plans to find one that fits your needs.
            </p>
            <Link to="/plans">
              <Button>Browse Plans</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

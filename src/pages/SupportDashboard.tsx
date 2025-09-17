
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PendingOrdersCard } from '@/components/admin/dashboard/PendingOrdersCard';
import { CreditCard, Cookie, Bell, ClipboardList } from 'lucide-react';

const SupportDashboard = () => {
  const {
    orders,
    pendingOrders
  } = useAdminDashboard();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Support Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage support operations</p>
      
      {/* Support Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Support Actions</CardTitle>
          <CardDescription>Support staff controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/credentials">
                <CreditCard className="h-5 w-5 mb-2" />
                <span>Manage Credentials</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/cookies">
                <Cookie className="h-5 w-5 mb-2" />
                <span>Manage Cookies</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/notifications">
                <Bell className="h-5 w-5 mb-2" />
                <span>Notifications</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/orders">
                <ClipboardList className="h-5 w-5 mb-2" />
                <span>Manage Orders</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Orders */}
      <PendingOrdersCard 
        orders={orders}
        pendingOrders={pendingOrders}
      />
    </div>
  );
};

export default SupportDashboard;

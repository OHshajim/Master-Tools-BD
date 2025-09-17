
import React from 'react';
import { Order } from '@/contexts/DataContext';
import { User } from '@/types/auth';
import { Subscriptions } from './Subscriptions';
import { PendingOrders } from './PendingOrders';
import { OrderHistory } from './OrderHistory';
import { UserProfile } from './UserProfile';
import { QuickLinks } from './QuickLinks';
import { Notifications } from './Notifications';

interface DashboardContentProps {
  user: User;
  orders: Order[];
  approvedOrders: Order[];
  pendingOrders: Order[];
}

export const DashboardContent = ({
  user,
  orders,
  approvedOrders,
  pendingOrders,
}: DashboardContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Main Content */}
      <div className="md:col-span-8">
        <Notifications />
        <Subscriptions approvedOrders={approvedOrders} />
        <PendingOrders pendingOrders={pendingOrders} />
        <OrderHistory />
      </div>
      
      {/* Sidebar */}
      <div className="md:col-span-4">
        <UserProfile user={user} />
        <QuickLinks isAdmin={user.role === 'admin'} />
      </div>
    </div>
  );
};

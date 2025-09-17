
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Order } from '@/contexts/DataContext';

interface OrderDetailHeaderProps {
  order: Order | null;
  isLoading: boolean;
}

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ 
  order, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-600">Order #{order?._id}</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Link to="/admin/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    </div>
  );
};

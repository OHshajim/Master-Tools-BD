
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OrderNotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
      <p className="mb-4">The order you are looking for does not exist.</p>
      <Link to="/admin/orders">
        <Button>Back to Orders</Button>
      </Link>
    </div>
  );
};

export default OrderNotFound;

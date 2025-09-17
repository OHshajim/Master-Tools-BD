
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Order } from '@/types/dataTypes';
import { FileText } from 'lucide-react';

interface CouponSalesTableProps {
  orders: Order[];
}

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'cancelled':
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const CouponSalesTable: React.FC<CouponSalesTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No orders found for the selected criteria
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Order Details ({orders.length} orders)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Payment (Last 4)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    {format(new Date(order.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.userName}
                  </TableCell>
                  <TableCell>
                    {order.planName}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {order.couponCode || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${order.originalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${order.finalPrice.toFixed(2)}
                    {order.couponDiscount && (
                      <span className="text-green-600 text-xs ml-1">
                        (-{order.couponDiscount}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      ****{order.lastFourDigits}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

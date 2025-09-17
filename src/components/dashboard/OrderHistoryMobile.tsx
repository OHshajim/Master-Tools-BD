
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/contexts/DataContext';
import { formatDate } from '@/utils/formatUtils';
import { orderService } from '@/services/orderService';
import { Download } from 'lucide-react';

interface OrderHistoryMobileProps {
  orders: Order[];
  onPDFDownload: (order: Order) => void;
  isOrderGenerating: (orderId: string) => boolean;
}

export const OrderHistoryMobile = ({ 
  orders, 
  onPDFDownload, 
  isOrderGenerating 
}: OrderHistoryMobileProps) => {
  return (
    <div className="space-y-4">
      {orders.map(order => {
        const isExpired = orderService.isOrderExpired(order);
        const discountAmount = order.originalPrice - order.finalPrice;
        const isGenerating = isOrderGenerating(order._id);
        
        return (
          <Card key={order._id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{order.planName}</h4>
                <Badge className={
                  order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }>
                  {order.status}
                </Badge>
              </div>
              
              <div className="text-sm grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500">Purchase Date:</p>
                  <p>{formatDate(order.date)}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Expiration:</p>
                  <p className={isExpired ? "text-red-600 font-medium" : ""}>
                    {order.expirationDate ? formatDate(order.expirationDate) : '-'}
                    {isExpired && " (Expired)"}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Original Price:</p>
                  <p>${order.originalPrice.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Final Price:</p>
                  <p className="font-medium">${order.finalPrice.toFixed(2)}</p>
                </div>
                
                {discountAmount > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Discount:</p>
                    <p className="text-green-600">
                      -${discountAmount.toFixed(2)} 
                      ({Math.round((discountAmount / order.originalPrice) * 100)}%)
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => onPDFDownload(order)}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isGenerating ? 'Generating...' : 'Download PDF Invoice'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

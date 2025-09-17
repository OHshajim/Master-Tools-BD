import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/contexts/DataContext';
import { formatDate } from '@/utils/formatUtils';
import { orderService } from '@/services/orderService';
import { Download } from 'lucide-react';

interface OrderHistoryDesktopProps {
  orders: Order[];
  onPDFDownload: (order: Order) => void;
  isOrderGenerating: (orderId: string) => boolean;
}

export const OrderHistoryDesktop = ({ 
  orders, 
  onPDFDownload, 
  isOrderGenerating 
}: OrderHistoryDesktopProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2 font-medium">Plan</th>
            <th className="pb-2 font-medium">Purchase Date</th>
            <th className="pb-2 font-medium">Expiration Date</th>
            <th className="pb-2 font-medium">Original Price</th>
            <th className="pb-2 font-medium">Discount</th>
            <th className="pb-2 font-medium">Final Price</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const isExpired = orderService.isOrderExpired(order);
            const discountAmount = order.originalPrice - order.finalPrice;
            const discountPercentage = order.originalPrice > 0 
              ? Math.round((discountAmount / order.originalPrice) * 100) 
              : 0;
            const isGenerating = isOrderGenerating(order._id);
            
            return (
              <tr key={order._id} className="border-b">
                <td className="py-3">{order.planName}</td>
                <td className="py-3">{formatDate(order.date)}</td>
                <td className="py-3">
                  {order.expirationDate ? (
                    <span className={isExpired ? "text-red-600 font-medium" : ""}>
                      {formatDate(order.expirationDate)}
                      {isExpired && " (Expired)"}
                    </span>
                  ) : '-'}
                </td>
                <td className="py-3">${order.originalPrice.toFixed(2)}</td>
                <td className="py-3">
                  {discountAmount > 0 ? (
                    <span className="text-green-600">
                      -${discountAmount.toFixed(2)}
                      <span className="text-xs ml-1">({discountPercentage}%)</span>
                    </span>
                  ) : '-'}
                </td>
                <td className="py-3">
                  <span className="font-medium">${order.finalPrice.toFixed(2)}</span>
                </td>
                <td className="py-3">
                  <Badge className={
                    order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => onPDFDownload(order)}
                    disabled={isGenerating}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {isGenerating ? 'Gen...' : 'PDF'}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


import { InvoiceData } from '@/types/invoice';

export const processInvoiceData = (data: InvoiceData) => {
  const { order } = data;
  const discountAmount = order.originalPrice - order.finalPrice;
  const discountPercentage = order.originalPrice > 0 
    ? Math.round((discountAmount / order.originalPrice) * 100) 
    : 0;

  return {
    discountAmount,
    discountPercentage
  };
};

export const formatGeneratedTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(date);
};

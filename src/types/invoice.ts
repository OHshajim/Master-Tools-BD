
import { Order } from '@/types/dataTypes';
import { BrandInfo } from '@/contexts/BrandContext';

export interface InvoiceData {
  order: Order;
  brandInfo: BrandInfo;
  customerName: string;
  customerEmail: string;
  generatedAt: Date;
}

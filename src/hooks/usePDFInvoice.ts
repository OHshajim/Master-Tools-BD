import { useState } from 'react';
import { Order } from '@/types/dataTypes';
import { InvoiceData } from '@/types/invoice';
import { useBrand } from '@/contexts/BrandContext';
import { generatePDFFromTemplate } from '@/services/pdf/pdfGenerator';

interface UsePDFInvoiceReturn {
  generatingOrderId: string | null;
  generatePDFInvoice: (order: Order, customerName: string, customerEmail: string) => Promise<void>;
  isOrderGenerating: (orderId: string) => boolean;
}

export const usePDFInvoice = (): UsePDFInvoiceReturn => {
  const [generatingOrderId, setGeneratingOrderId] = useState<string | null>(null);
  const { brandInfo } = useBrand();

  const generatePDFInvoice = async (
    order: Order,
    customerName: string,
    customerEmail: string
  ): Promise<void> => {
    setGeneratingOrderId(order._id);
    
    try {
      const invoiceData: InvoiceData = {
        order,
        brandInfo,
        customerName,
        customerEmail,
        generatedAt: new Date()
      };
      await generatePDFFromTemplate(invoiceData);
    } catch (error) {
      console.error('Failed to generate PDF invoice:', error);
      throw error;
    } finally {
      setGeneratingOrderId(null);
    }
  };

  const isOrderGenerating = (orderId: string): boolean => {
    return generatingOrderId === orderId;
  };

  return {
    generatingOrderId,
    generatePDFInvoice,
    isOrderGenerating
  };
};

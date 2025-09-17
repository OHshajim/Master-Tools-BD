
import { Order } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePDFInvoice } from '@/hooks/usePDFInvoice';

export const useOrderHistory = () => {
  const { user } = useAuth();
  const { generatePDFInvoice, isOrderGenerating } = usePDFInvoice();

  const handlePDFDownload = async (order: Order) => {
    if (!user) return;
    
    try {
      await generatePDFInvoice(order, user.name, user.email);
    } catch (error) {
      console.error('Failed to generate PDF invoice:', error);
    }
  };

  return {
    handlePDFDownload,
    isOrderGenerating
  };
};

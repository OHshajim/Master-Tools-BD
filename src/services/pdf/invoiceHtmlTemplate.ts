import { InvoiceData } from '@/types/invoice';
import { invoiceStyles } from './styles/invoiceStyles';
import { generateInvoiceHeader } from './components/InvoiceHeader';
import { generateInvoiceDetails } from './components/InvoiceDetails';
import { generateOrderItems } from './components/OrderItems';
import { generatePaymentSummary } from './components/PaymentSummary';
import { generatePaymentMethod } from './components/PaymentMethod';
import { generateInvoiceFooter } from './components/InvoiceFooter';

/**
 * Generate HTML template for the invoice
 */
export const generateInvoiceHTML = (data: InvoiceData): string => {
  return `
    <div style="${invoiceStyles.container}">
      ${generateInvoiceHeader(data)}
      ${generateInvoiceDetails(data)}
      ${generateOrderItems(data)}
      ${generatePaymentSummary(data)}
      ${generatePaymentMethod(data)}
      ${generateInvoiceFooter(data)}
    </div>
  `;
};

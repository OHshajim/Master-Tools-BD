
import { InvoiceData } from '@/types/invoice';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generatePaymentMethod = (data: InvoiceData): string => {
  const { order } = data;
  
  return `
    <div style="margin-bottom: 40px;">
      <h3 style="${invoiceStyles.sectionTitle}">Payment Number</h3>
      <div style="${invoiceStyles.infoCard}">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            background: #3b82f6;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
          ">last 4 digit</div>
          <span style="font-family: monospace; font-size: 16px; font-weight: 500;">
            •••• ${order.lastFourDigits || order.paymentLastFour || '0000'}
          </span>
        </div>
      </div>
    </div>
  `;
};

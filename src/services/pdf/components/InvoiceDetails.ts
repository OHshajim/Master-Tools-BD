
import { InvoiceData } from '@/types/invoice';
import { formatDate } from '@/utils/formatUtils';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generateInvoiceDetails = (data: InvoiceData): string => {
  const { order, customerName, customerEmail } = data;
  
  return `
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    ">
      <!-- Bill To -->
      <div>
        <h3 style="${invoiceStyles.sectionTitle}">Bill To</h3>
        <div style="${invoiceStyles.infoCard}">
          <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${customerName}</p>
          <p style="margin: 0; color: #64748b; font-size: 14px;">${customerEmail}</p>
        </div>
      </div>

      <!-- Invoice Info -->
      <div>
        <h3 style="${invoiceStyles.sectionTitle}">Invoice Details</h3>
        <div style="${invoiceStyles.infoCard}">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;">
            <span style="color: #64748b; font-size: 14px;">Date:</span>
            <span style="font-weight: 500;">${formatDate(order.date)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;">
            <span style="color: #64748b; font-size: 14px;">Status:</span>
            <div style="display: flex; align-items: center; justify-content: flex-end;">
              <span style="${invoiceStyles.statusBadge(order.status)}">${order.status}</span>
            </div>
          </div>
          ${order.expirationDate ? `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #64748b; font-size: 14px;">Expires:</span>
              <span style="font-weight: 500;">${formatDate(order.expirationDate)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};

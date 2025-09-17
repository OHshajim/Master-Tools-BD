
import { InvoiceData } from '@/types/invoice';
import { processInvoiceData } from '../invoiceDataProcessor';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generatePaymentSummary = (data: InvoiceData): string => {
  const { order } = data;
  const { discountAmount, discountPercentage } = processInvoiceData(data);
  
  return `
    <div style="${invoiceStyles.summaryContainer}">
      <div style="
        max-width: 400px;
        margin-left: auto;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
          margin: 0 0 20px 0;
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        ">Payment Summary</h3>
        
        <div style="space-y: 12px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; align-items: center;">
            <span style="color: #64748b;">Subtotal:</span>
            <span style="font-weight: 500;">$${order.originalPrice.toFixed(2)}</span>
          </div>
          
          ${discountAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #059669; align-items: center;">
              <span>Discount (${discountPercentage}%):</span>
              <span style="font-weight: 500;">-$${discountAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          
          ${order.couponCode ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; align-items: center;">
              <span style="color: #64748b;">Coupon Applied:</span>
              <div style="display: flex; align-items: center; justify-content: flex-end;">
                <span style="${invoiceStyles.couponBadge}">${order.couponCode}</span>
              </div>
            </div>
          ` : ''}
          
          <div style="
            border-top: 2px solid #e2e8f0;
            padding-top: 15px;
            margin-top: 15px;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                font-size: 20px;
                font-weight: bold;
                color: #1e293b;
              ">Total:</span>
              <span style="
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
              ">$${order.finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

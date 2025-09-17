
import { InvoiceData } from '@/types/invoice';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generateOrderItems = (data: InvoiceData): string => {
  const { order } = data;
  
  return `
    <div style="margin-bottom: 40px;">
      <h3 style="${invoiceStyles.sectionTitle}">Order Items</h3>
      
      <div style="
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      ">
        <!-- Table Header -->
        <div style="${invoiceStyles.tableHeader}">
          <span>Description</span>
          <span style="text-align: center;">Quantity</span>
          <span style="text-align: center;">Price</span>
          <span style="text-align: right;">Total</span>
        </div>
        
        <!-- Table Row -->
        <div style="${invoiceStyles.tableRow}">
          <div>
            <p style="margin: 0; font-weight: bold; font-size: 16px; color: #1e293b;">${order.planName}</p>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Premium Access Plan</p>
          </div>
          <div style="text-align: center; font-weight: 500;">1</div>
          <div style="text-align: center; font-weight: 500;">$${order.originalPrice.toFixed(2)}</div>
          <div style="text-align: right; font-weight: bold; font-size: 16px;">$${order.originalPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
};

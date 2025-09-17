
import { InvoiceData } from '@/types/invoice';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generateInvoiceFooter = (data: InvoiceData): string => {
  const { brandInfo } = data;
  
  return `
    <!-- Footer -->
    <div style="${invoiceStyles.footerGradient}">
      <h4 style="
        margin: 0 0 15px 0;
        font-size: 20px;
        font-weight: bold;
      ">Thank You for Your Purchase!</h4>
      <p style="
        margin: 0 0 20px 0;
        opacity: 0.9;
        font-size: 14px;
      ">Your payment has been processed successfully.</p>
      
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      ">
        <div>
          <p style="margin: 0; opacity: 0.8; font-size: 12px;">Support</p>
          <p style="margin: 0; font-weight: 500;">${brandInfo.supportEmail}</p>
        </div>
        <div>
          <p style="margin: 0; opacity: 0.8; font-size: 12px;">Contact</p>
          <p style="margin: 0; font-weight: 500;">${brandInfo.contactNumber}</p>
        </div>
      </div>
    </div>
    
    <!-- Small Print -->
    <div style="
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 12px;
    ">
      <p style="margin: 0;">
        This is a computer-generated invoice. No signature required. 
        For questions, contact ${brandInfo.supportEmail}
      </p>
    </div>
  `;
};

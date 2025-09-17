
import { InvoiceData } from '@/types/invoice';
import { formatGeneratedTime } from '../invoiceDataProcessor';
import { invoiceStyles } from '../styles/invoiceStyles';

export const generateInvoiceHeader = (data: InvoiceData): string => {
  const { order, brandInfo, generatedAt } = data;
  
  return `
    <div style="${invoiceStyles.header}">
      <div style="${invoiceStyles.brandSection}">
        ${brandInfo.logoUrl ? `
          <img src="${brandInfo.logoUrl}" alt="${brandInfo.platformName}" style="${invoiceStyles.logo}">
        ` : ''}
        <div>
          <h1 style="${invoiceStyles.brandName}">${brandInfo.platformName}</h1>
          <p style="${invoiceStyles.domainName}">${brandInfo.domainName}</p>
        </div>
      </div>
      
      <div style="text-align: right;">
        <h2 style="${invoiceStyles.invoiceTitle}">INVOICE</h2>
        <div style="${invoiceStyles.invoiceInfoBox}">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Invoice #</p>
          <p style="margin: 0; font-weight: bold; font-size: 16px;">${order._id.substring(0, 8).toUpperCase()}</p>
          <div style="
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
          ">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Invoice Generated Date</p>
            <p style="margin: 0; font-weight: 500; font-size: 13px; color: #475569;">${formatGeneratedTime(generatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

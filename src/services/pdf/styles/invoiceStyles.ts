export const invoiceStyles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background: white;
    color: #1a1a1a;
    line-height: 1.6;
  `,
  
  header: `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 3px solid #3b82f6;
  `,
  
  brandSection: `
    display: flex;
    align-items: flex-start;
    gap: 15px;
  `,
  
  logo: `
    height: 50px;
    width: auto;
    object-fit: contain;
    vertical-align: top;
    flex-shrink: 0;
  `,
  
  brandName: `
    font-size: 28px;
    font-weight: bold;
    color: #3b82f6;
    margin: 0;
    margin-bottom: 5px;
    line-height: 1.2;
  `,
  
  domainName: `
    color: #64748b;
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
  `,
  
  invoiceTitle: `
    font-size: 32px;
    font-weight: bold;
    color: #1e293b;
    margin: 0;
    margin-bottom: 10px;
  `,
  
  invoiceInfoBox: `
    background: #f1f5f9;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  `,
  
  sectionTitle: `
    font-size: 18px;
    font-weight: bold;
    color: #1e293b;
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #e2e8f0;
  `,
  
  infoCard: `
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  `,
  
  tableHeader: `
    background: #f1f5f9;
    padding: 15px 20px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,
  
  tableRow: `
    padding: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 20px;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
  `,
  
  summaryContainer: `
    background: #f8fafc;
    padding: 30px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 40px;
  `,
  
  footerGradient: `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin-top: 40px;
  `,
  
  statusBadge: (status: string) => `
    background: ${status === 'approved' ? '#dcfce7' : status === 'pending' ? '#fef3c7' : '#fecaca'};
    color: ${status === 'approved' ? '#166534' : status === 'pending' ? '#92400e' : '#dc2626'};
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: inline-block;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
  `,
  
  couponBadge: `
    background: #dcfce7;
    color: #166534;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
  `
};

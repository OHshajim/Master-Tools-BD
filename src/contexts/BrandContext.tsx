
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { brandService } from '@/services/brandService';

export interface BrandInfo {
  platformName: string;
  logoUrl: string;
  faviconUrl: string;
  contactNumber: string;
  domainName: string;
  supportEmail: string;
  adminEmail: string;
  metaTitle: string;
}

interface BrandContextType {
  brandInfo: BrandInfo;
  updateBrandInfo: (newBrandInfo: Partial<BrandInfo>) => void;
  resetToDefaults: () => void;
}

const defaultBrandInfo: BrandInfo = {
  platformName: 'Master Tools BD',
  logoUrl: '',
  faviconUrl: '',
  contactNumber: '+880 1878-720467',
  domainName: 'mastertoolsbd.com',
  supportEmail: 'support@mastertoolsbd.com',
  adminEmail: 'admin@mastertoolsbd.com',
  metaTitle: 'Master Tools BD - Premium Learning Platform Access'
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
}

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(defaultBrandInfo);

  // Load brand info from localStorage on mount
  useEffect(() => {
    const savedBrandInfo = localStorage.getItem('brandInfo');
    if (savedBrandInfo) {
      try {
        const parsed = JSON.parse(savedBrandInfo);
        setBrandInfo({ ...defaultBrandInfo, ...parsed });
      } catch (error) {
        console.error('Error parsing saved brand info:', error);
      }
    }
  }, []);

  // Save to localStorage and update favicon/title whenever brandInfo changes
  useEffect(() => {
    localStorage.setItem('brandInfo', JSON.stringify(brandInfo));
    
    // Update document title
    document.title = brandInfo.metaTitle;
    
    // Update favicon - use faviconUrl if available, otherwise generate from logoUrl
    const faviconSource = brandInfo.faviconUrl || brandInfo.logoUrl;
    if (faviconSource) {
      if (brandInfo.faviconUrl) {
        // Use the dedicated favicon directly
        brandService.updateFavicon(brandInfo.faviconUrl);
      } else if (brandInfo.logoUrl) {
        // Generate favicon from logo (existing behavior)
        brandService.generateFaviconFromLogo(brandInfo.logoUrl)
          .then(faviconUrl => {
            brandService.updateFavicon(faviconUrl);
          })
          .catch(error => {
            console.error('Failed to update favicon:', error);
          });
      }
    }
  }, [brandInfo]);

  const updateBrandInfo = (newBrandInfo: Partial<BrandInfo>) => {
    setBrandInfo(prev => {
      const updated = { ...prev, ...newBrandInfo };
      
      // Auto-generate emails when domain changes
      if (newBrandInfo.domainName) {
        updated.supportEmail = `support@${newBrandInfo.domainName}`;
        updated.adminEmail = `admin@${newBrandInfo.domainName}`;
      }
      
      return updated;
    });
  };

  const resetToDefaults = () => {
    setBrandInfo(defaultBrandInfo);
    localStorage.removeItem('brandInfo');
  };

  return (
    <BrandContext.Provider value={{ brandInfo, updateBrandInfo, resetToDefaults }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

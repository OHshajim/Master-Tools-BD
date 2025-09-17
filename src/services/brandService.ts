
import { BrandInfo } from '@/contexts/BrandContext';

export const brandService = {
  validateBrandInfo: (brandInfo: Partial<BrandInfo>) => {
    const errors: Record<string, string> = {};

    if (brandInfo.platformName && brandInfo.platformName.trim().length < 2) {
      errors.platformName = 'Platform name must be at least 2 characters long';
    }

    if (brandInfo.metaTitle && brandInfo.metaTitle.trim().length < 5) {
      errors.metaTitle = 'Meta title must be at least 5 characters long';
    }

    if (brandInfo.contactNumber && !/^\+?[\d\s-()]+$/.test(brandInfo.contactNumber)) {
      errors.contactNumber = 'Please enter a valid contact number';
    }

    if (brandInfo.domainName && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(brandInfo.domainName)) {
      errors.domainName = 'Please enter a valid domain name (e.g., example.com)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  processLogoUpload: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Image size should be less than 2MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  },

  processFaviconUpload: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      if (file.size > 1 * 1024 * 1024) { // 1MB limit for favicon
        reject(new Error('Favicon image size should be less than 1MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set optimal favicon size
          const size = 64; // 64x64 for better quality
          canvas.width = size;
          canvas.height = size;
          
          // Draw the image scaled to fit
          ctx.drawImage(img, 0, 0, size, size);
          
          try {
            const faviconDataUrl = canvas.toDataURL('image/png');
            resolve(faviconDataUrl);
          } catch (err) {
            reject(new Error('Failed to process favicon'));
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  },

  generateFaviconFromLogo: (logoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set favicon size to 32x32
        canvas.width = 32;
        canvas.height = 32;
        
        // Draw the logo scaled to fit the favicon size
        ctx.drawImage(img, 0, 0, 32, 32);
        
        try {
          const faviconDataUrl = canvas.toDataURL('image/png');
          resolve(faviconDataUrl);
        } catch (err) {
          reject(new Error('Failed to generate favicon'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load logo for favicon generation'));
      };
      
      img.src = logoUrl;
    });
  },

  updateFavicon: (faviconUrl: string) => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());
    
    // Create new favicon link
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = faviconUrl;
    
    // Add to document head
    document.head.appendChild(favicon);
  }
};

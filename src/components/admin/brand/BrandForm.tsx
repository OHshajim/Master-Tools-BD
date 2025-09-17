
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { BrandInfo } from '@/contexts/BrandContext';
import { brandService } from '@/services/brandService';
import { BrandFormInputs } from './BrandFormInputs';
import { LogoUploadSection } from './LogoUploadSection';
import { FaviconUploadSection } from './FaviconUploadSection';

interface BrandFormProps {
  initialBrandInfo: BrandInfo;
  onBrandInfoChange: (brandInfo: BrandInfo) => void;
  onReset: () => void;
}

export const BrandForm = ({ initialBrandInfo, onBrandInfoChange, onReset }: BrandFormProps) => {
  const [formData, setFormData] = useState<BrandInfo>(initialBrandInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const [isProcessingFavicon, setIsProcessingFavicon] = useState(false);

  const handleInputChange = (field: keyof BrandInfo, value: string) => {
    const updatedData = { ...formData, [field]: value };
    
    // Auto-generate emails when domain changes
    if (field === 'domainName') {
      updatedData.supportEmail = `support@${value}`;
      updatedData.adminEmail = `admin@${value}`;
    }
    
    setFormData(updatedData);
    onBrandInfoChange(updatedData);
    
    // Clear specific field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (logoUrl: string) => {
    const updatedData = { ...formData, logoUrl };
    setFormData(updatedData);
    onBrandInfoChange(updatedData);
  };

  const handleFaviconUpload = (faviconUrl: string) => {
    const updatedData = { ...formData, faviconUrl };
    setFormData(updatedData);
    onBrandInfoChange(updatedData);
  };

  const handleFaviconRemove = () => {
    const updatedData = { ...formData, faviconUrl: '' };
    setFormData(updatedData);
    onBrandInfoChange(updatedData);
  };

  const validateForm = () => {
    const validation = brandService.validateBrandInfo(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onBrandInfoChange(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Brand Information
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BrandFormInputs
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <LogoUploadSection
            logoUrl={formData.logoUrl}
            isProcessing={isProcessingLogo}
            onLogoUpload={handleLogoUpload}
            onProcessingChange={setIsProcessingLogo}
          />

          <FaviconUploadSection
            faviconUrl={formData.faviconUrl}
            logoUrl={formData.logoUrl}
            isProcessing={isProcessingFavicon}
            onFaviconUpload={handleFaviconUpload}
            onFaviconRemove={handleFaviconRemove}
            onProcessingChange={setIsProcessingFavicon}
          />
        </form>
      </CardContent>
    </Card>
  );
};

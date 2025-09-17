
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { brandService } from '@/services/brandService';
import { toast } from '@/hooks/use-toast';
import { BrandInfo } from '@/contexts/BrandContext';

interface LogoUploadSectionProps {
  logoUrl: string;
  isProcessing: boolean;
  onLogoUpload: (logoUrl: string) => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

export const LogoUploadSection = ({ 
  logoUrl, 
  isProcessing, 
  onLogoUpload, 
  onProcessingChange 
}: LogoUploadSectionProps) => {
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onProcessingChange(true);
    try {
      const logoDataUrl = await brandService.processLogoUpload(file);
      onLogoUpload(logoDataUrl);
      toast({
        title: "Success",
        description: "Logo uploaded successfully"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload logo");
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Website Logo</Label>
      <div className="flex items-center gap-4">
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Current logo" 
            className="w-16 h-16 object-contain border rounded-md"
          />
        )}
        <div className="flex-1">
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in navbar and throughout the website. Upload PNG, JPG, or SVG. Max size: 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

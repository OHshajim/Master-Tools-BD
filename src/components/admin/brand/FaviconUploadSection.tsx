
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { brandService } from '@/services/brandService';
import { toast } from '@/hooks/use-toast';

interface FaviconUploadSectionProps {
  faviconUrl: string;
  logoUrl: string;
  isProcessing: boolean;
  onFaviconUpload: (faviconUrl: string) => void;
  onFaviconRemove: () => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

export const FaviconUploadSection = ({ 
  faviconUrl, 
  logoUrl, 
  isProcessing, 
  onFaviconUpload, 
  onFaviconRemove, 
  onProcessingChange 
}: FaviconUploadSectionProps) => {
  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onProcessingChange(true);
    try {
      const faviconDataUrl = await brandService.processFaviconUpload(file);
      onFaviconUpload(faviconDataUrl);
      toast({
        title: "Success",
        description: "Favicon uploaded successfully"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload favicon");
    } finally {
      onProcessingChange(false);
    }
  };

  const handleRemoveFavicon = () => {
    onFaviconRemove();
    toast({
      title: "Success",
      description: "Favicon removed. Website logo will be used for browser tab icon."
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="favicon">Favicon (Browser Tab Icon)</Label>
      <div className="flex items-center gap-4">
        {faviconUrl ? (
          <div className="relative">
            <img 
              src={faviconUrl} 
              alt="Current favicon" 
              className="w-16 h-16 object-contain border rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveFavicon}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : logoUrl ? (
          <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50">
            <p className="text-xs text-gray-500 text-center">Using website logo</p>
          </div>
        ) : (
          <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50">
            <p className="text-xs text-gray-500 text-center">No favicon</p>
          </div>
        )}
        <div className="flex-1">
          <Input
            id="favicon"
            type="file"
            accept="image/*"
            onChange={handleFaviconUpload}
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Upload a separate icon for browser tabs. Recommended: 64x64 pixels, square format. Max size: 1MB
          </p>
          {!faviconUrl && (
            <p className="text-xs text-blue-600 mt-1">
              If no favicon is uploaded, the website logo will be automatically resized and used.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

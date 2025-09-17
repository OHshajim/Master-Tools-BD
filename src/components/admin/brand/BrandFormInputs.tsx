
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandInfo } from '@/contexts/BrandContext';

interface BrandFormInputsProps {
  formData: BrandInfo;
  errors: Record<string, string>;
  onInputChange: (field: keyof BrandInfo, value: string) => void;
}

export const BrandFormInputs = ({ formData, errors, onInputChange }: BrandFormInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="platformName">Platform Name</Label>
        <Input
          id="platformName"
          value={formData.platformName}
          onChange={(e) => onInputChange('platformName', e.target.value)}
          placeholder="Enter platform name"
        />
        {errors.platformName && (
          <p className="text-sm text-red-600">{errors.platformName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title (Browser Tab Title)</Label>
        <Input
          id="metaTitle"
          value={formData.metaTitle}
          onChange={(e) => onInputChange('metaTitle', e.target.value)}
          placeholder="Enter browser tab title"
        />
        {errors.metaTitle && (
          <p className="text-sm text-red-600">{errors.metaTitle}</p>
        )}
        <p className="text-xs text-gray-500">
          This will appear in the browser tab next to the favicon
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => onInputChange('contactNumber', e.target.value)}
          placeholder="Enter contact number"
        />
        {errors.contactNumber && (
          <p className="text-sm text-red-600">{errors.contactNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="domainName">Domain Name</Label>
        <Input
          id="domainName"
          value={formData.domainName}
          onChange={(e) => onInputChange('domainName', e.target.value)}
          placeholder="example.com"
        />
        {errors.domainName && (
          <p className="text-sm text-red-600">{errors.domainName}</p>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Support Email: {formData.supportEmail}</p>
          <p>Admin Email: {formData.adminEmail}</p>
        </div>
      </div>
    </>
  );
};

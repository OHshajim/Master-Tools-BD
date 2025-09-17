
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandInfo } from '@/contexts/BrandContext';

interface BrandPreviewProps {
  newBrandInfo: BrandInfo;
  currentBrandInfo: BrandInfo;
}

export const BrandPreview = ({ newBrandInfo, currentBrandInfo }: BrandPreviewProps) => {
  const hasChanges = JSON.stringify(newBrandInfo) !== JSON.stringify(currentBrandInfo);

  if (!hasChanges) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No changes to preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {newBrandInfo.platformName !== currentBrandInfo.platformName && (
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Platform Name</p>
            <p className="text-sm text-gray-600">
              From: <span className="line-through">{currentBrandInfo.platformName}</span>
            </p>
            <p className="text-sm text-green-600">
              To: <span className="font-medium">{newBrandInfo.platformName}</span>
            </p>
          </div>
        )}

        {newBrandInfo.logoUrl !== currentBrandInfo.logoUrl && (
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Website Logo</p>
            <div className="flex items-center gap-4 mt-2">
              {currentBrandInfo.logoUrl && (
                <div>
                  <p className="text-xs text-gray-500">Current:</p>
                  <img src={currentBrandInfo.logoUrl} alt="Current logo" className="w-12 h-12 object-contain border rounded" />
                </div>
              )}
              {newBrandInfo.logoUrl && (
                <div>
                  <p className="text-xs text-green-600">New:</p>
                  <img src={newBrandInfo.logoUrl} alt="New logo" className="w-12 h-12 object-contain border rounded" />
                </div>
              )}
            </div>
          </div>
        )}

        {newBrandInfo.faviconUrl !== currentBrandInfo.faviconUrl && (
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Favicon (Browser Tab Icon)</p>
            <div className="flex items-center gap-4 mt-2">
              {currentBrandInfo.faviconUrl ? (
                <div>
                  <p className="text-xs text-gray-500">Current:</p>
                  <img src={currentBrandInfo.faviconUrl} alt="Current favicon" className="w-8 h-8 object-contain border rounded" />
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500">Current: Using website logo</p>
                </div>
              )}
              {newBrandInfo.faviconUrl ? (
                <div>
                  <p className="text-xs text-green-600">New:</p>
                  <img src={newBrandInfo.faviconUrl} alt="New favicon" className="w-8 h-8 object-contain border rounded" />
                </div>
              ) : (
                <div>
                  <p className="text-xs text-green-600">New: Will use website logo</p>
                </div>
              )}
            </div>
          </div>
        )}

        {newBrandInfo.contactNumber !== currentBrandInfo.contactNumber && (
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Contact Number</p>
            <p className="text-sm text-gray-600">
              From: <span className="line-through">{currentBrandInfo.contactNumber}</span>
            </p>
            <p className="text-sm text-green-600">
              To: <span className="font-medium">{newBrandInfo.contactNumber}</span>
            </p>
          </div>
        )}

        {newBrandInfo.domainName !== currentBrandInfo.domainName && (
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Domain & Email Updates</p>
            <p className="text-sm text-gray-600">
              Domain: <span className="line-through">{currentBrandInfo.domainName}</span> → <span className="font-medium text-green-600">{newBrandInfo.domainName}</span>
            </p>
            <p className="text-sm text-gray-600">
              Support Email: <span className="line-through">{currentBrandInfo.supportEmail}</span> → <span className="font-medium text-green-600">{newBrandInfo.supportEmail}</span>
            </p>
            <p className="text-sm text-gray-600">
              Admin Email: <span className="line-through">{currentBrandInfo.adminEmail}</span> → <span className="font-medium text-green-600">{newBrandInfo.adminEmail}</span>
            </p>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            <strong>Impact:</strong> These changes will be applied across the entire website including headers, footers, invoices, and email templates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

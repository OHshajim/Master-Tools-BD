
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/components/ui/sonner';
import { Save, X } from 'lucide-react';
import { Cookie } from '@/types/dataTypes';
import { hasCookieChanges } from '@/utils/changeDetectionUtils';

interface QuickEditCookieModalProps {
  cookie: Cookie;
  onClose: () => void;
  getPlanName: (planId: string) => string;
}

export const QuickEditCookieModal: React.FC<QuickEditCookieModalProps> = ({
  cookie,
  onClose,
  getPlanName
}) => {
  const { platforms, updateUserSpecificCookie } = useDataContext();
  
  const initialPlatformId = platforms.some(p => p._id === cookie.platformId)
    ? (cookie.platformId as string)
    : (platforms.find(p => p.name === cookie.platform)?._id || '');
  const [platform, setPlatform] = useState(initialPlatformId);
  const [cookieData, setCookieData] = useState(cookie.cookieData || cookie.value || '');
  const [domain, setDomain] = useState(cookie.domain || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !cookieData) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Ensure userId is provided - this is required for user-specific cookies
    if (!cookie.userId) {
      toast.error('User ID is missing. Cannot update cookie.');
      return;
    }

    setIsSubmitting(true);
    try {
      const platformName = platforms.find(p => p._id === platform)?.name || cookie.platform || platform;
      
      // Check for actual changes
      const updatedData = {
        platformId: platform,
        platform: platformName,
        cookieData,
        domain,
        planId: cookie.planId
      };

      const hasChanges = hasCookieChanges(cookie, updatedData);

      if (!hasChanges) {
        toast.info('No changes detected');
        setIsSubmitting(false);
        return;
      }

      updateUserSpecificCookie({
        ...cookie,
        platformId: platform,
        platform: platformName,
        name: `Cookie for ${platformName}`,
        cookieData,
        domain,
        userId: cookie.userId,
        updatedAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error updating cookie:', error);
      toast.error('Failed to update cookie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Cookie</DialogTitle>
          <p className="text-sm text-gray-600">
            User ID: {cookie.userId} | Plan: {getPlanName(cookie.planId)}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform *</Label>
            <SearchablePlatformSelect
              platforms={platforms}
              value={platform}
              onValueChange={setPlatform}
              placeholder="Select a platform"
            />
          </div>

          <div>
            <Label htmlFor="cookieData">Cookie Data *</Label>
            <Textarea
              id="cookieData"
              value={cookieData}
              onChange={(e) => setCookieData(e.target.value)}
              placeholder="Paste cookie data here..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., udemy.com"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Cookie'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

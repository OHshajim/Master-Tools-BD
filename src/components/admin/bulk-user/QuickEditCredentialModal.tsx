
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/components/ui/sonner';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { Credential } from '@/types/dataTypes';
import { hasCredentialChanges } from '@/utils/changeDetectionUtils';

interface QuickEditCredentialModalProps {
  credential: Credential;
  onClose: () => void;
  getPlanName: (planId: string) => string;
}

export const QuickEditCredentialModal: React.FC<QuickEditCredentialModalProps> = ({
  credential,
  onClose,
  getPlanName
}) => {
  const { platforms, updateUserSpecificCredential } = useDataContext();
  
  const [platform, setPlatform] = useState(credential.platformId || credential.platform || '');
  const [username, setUsername] = useState(credential.username);
  const [password, setPassword] = useState(credential.password);
  const [domain, setDomain] = useState(credential.domain || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Ensure userId is provided - this is required for user-specific credentials
    if (!credential.userId) {
      toast.error('User ID is missing. Cannot update credential.');
      return;
    }

    setIsSubmitting(true);
    try {
      const platformName = platforms.find(p => p._id === platform)?.name || platform;
      
      // Check for actual changes
      const updatedData = {
        platformId: platform,
        platform: platformName,
        username,
        password,
        domain: domain || '',
        planId: credential.planId
      };

      const hasChanges = hasCredentialChanges(credential, updatedData);

      if (!hasChanges) {
        toast.info('No changes detected');
        setIsSubmitting(false);
        return;
      }

      updateUserSpecificCredential({
        ...credential,
        ...updatedData,
        userId: credential.userId,
        updatedAt: new Date().toISOString()
      });
      toast.success('Credential updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating credential:', error);
      toast.error('Failed to update credential');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <p className="text-sm text-gray-600">
            User ID: {credential.userId} | Plan: {getPlanName(credential.planId)}
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
            <Label htmlFor="username">Username/Email *</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., company.udemy.com"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter domain manually for credential usage
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || !domain}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Credential'}
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

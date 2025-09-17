import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Credential } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';

interface EditCredentialFormProps {
  isOpen: boolean;
  credential: Credential | null;
  onClose: () => void;
  onSubmit: (platformId: string, username: string, password: string, domain?: string) => void;
}

export const EditCredentialForm = ({ isOpen, credential, onClose, onSubmit }: EditCredentialFormProps) => {
  const [platformId, setPlatformId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset form when credential changes
  useEffect(() => {
    if (credential) {
      setPlatformId(credential.platform || credential.platformId);
      setUsername(credential.username || '');
      setPassword(credential.password || '');
      setDomain(credential.domain || '');
    } else {
      setPlatformId('');
      setUsername('');
      setPassword('');
      setDomain('');
    }
  }, [credential]);
  
  const handleSubmit = () => {
    if (!domain || domain.trim() === '') {
      toast({
        title: "Domain Required",
        description: "Please enter a domain URL for this credential."
      });
      return;
    }

    onSubmit(platformId, username, password, domain.trim());
  };
  
  const handlePlatformChange = (value: string) => {
    setPlatformId(value);
    // No auto-domain generation - admin will input manually
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="platformId" className="text-sm font-medium">
              Platform Name *
            </label>
            <Input
              id="platformId"
              value={platformId}
              onChange={e => handlePlatformChange(e.target.value)}
              placeholder="e.g., Coursera"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain Name *
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g., coursera.org"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter domain manually for the "Go to Platform" button (required)
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username / Email
            </label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g., user@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="flex">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="rounded-r-none"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!domain || domain.trim() === ''}>
            Update Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

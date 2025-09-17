import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/hooks/use-toast';

interface AddCredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planId: string, platformId: string, username: string, password: string, domain?: string) => void;
}

export const AddCredentialForm = ({ isOpen, onClose, onSubmit }: AddCredentialFormProps) => {
  const { plans } = useDataContext();
  const [planId, setPlanId] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = () => {
    if (!planId) {
      // Don't submit if no plan is selected
      return;
    }

    if (!domain || domain.trim() === '') {
      toast({
        title: "Domain Required",
        description: "Please enter a domain URL for this credential."
      });
      return;
    }

    onSubmit(planId, platformId, username, password, domain.trim());
    resetForm();
  };

  const resetForm = () => {
    setPlanId('');
    setPlatformId('');
    setUsername('');
    setPassword('');
    setDomain('');
    setShowPassword(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handlePlatformChange = (value: string) => {
    setPlatformId(value);
    // No auto-domain generation - admin will input manually
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
          <DialogDescription>Add login details for a platform</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Plan Selector */}
          <div className="space-y-2">
            <label htmlFor="planId" className="text-sm font-medium">
              Select Plan *
            </label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!planId || !domain || domain.trim() === ''}>
            Add Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

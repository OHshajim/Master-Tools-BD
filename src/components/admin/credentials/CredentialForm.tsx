import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plan } from '@/types/dataTypes';
import { useDataContext } from '@/hooks/useDataContext';

interface CredentialFormProps {
  platform: string;
  setPlatform: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  selectedPlanId: string;
  setSelectedPlanId: (value: string) => void;
  selectedPlatformId: string;
  setSelectedPlatformId: (value: string) => void;
  isDrafted: boolean;
  setIsDrafted: (value: boolean) => void;
  isEditing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancelEdit: () => void;
  plans: Plan[];
}

const CredentialForm = ({
  platform,
  setPlatform,
  username,
  setUsername,
  password,
  setPassword,
  domain,
  setDomain,
  selectedPlanId,
  setSelectedPlanId,
  selectedPlatformId,
  setSelectedPlatformId,
  isDrafted,
  setIsDrafted,
  isEditing,
  handleSubmit,
  handleCancelEdit,
  plans
}: CredentialFormProps) => {
  const { platforms } = useDataContext();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize platform ID when platform prop changes (for editing)
  useEffect(() => {
    if (platform) {
      const foundPlatform = platforms.find(p => p.name === platform);
      if (foundPlatform) {
        setSelectedPlatformId(foundPlatform._id);
      }
    }
  }, [platform, platforms, setSelectedPlatformId]);

  // Update platform name when platform selection changes
  // No automatic domain generation - admin will input manually
  useEffect(() => {
    if (selectedPlatformId) {
      const selectedPlatform = platforms.find(p => p._id === selectedPlatformId);
      if (selectedPlatform) {
        setPlatform(selectedPlatform.name);
      }
    }
  }, [selectedPlatformId, platforms, setPlatform]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Credential' : 'Add New Credential'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update credential information' : 'Create a new credential for a plan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              Select Platform *
            </label>
            <SearchablePlatformSelect
              platforms={platforms}
              value={selectedPlatformId}
              onValueChange={setSelectedPlatformId}
              placeholder="Select a platform"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain URL *
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="Enter domain URL (e.g., coursera.org)"
              required
            />
            <p className="text-xs text-gray-500">
              Enter the domain where credentials will be used (required)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="plan" className="text-sm font-medium">
              Select Plan *
            </label>
            <Select 
              value={selectedPlanId} 
              onValueChange={setSelectedPlanId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username / Email *
            </label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g., user@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password *
            </label>
            <div className="flex">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="rounded-r-none"
                required
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
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDrafted"
              checked={isDrafted}
              onCheckedChange={(checked) => setIsDrafted(!!checked)}
            />
            <label htmlFor="isDrafted" className="text-sm font-medium cursor-pointer">
              Draft Platform
            </label>
            <p className="text-xs text-gray-500">
              (Won't show on Access Page for any user)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Credential' : 'Add Credential'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CredentialForm;

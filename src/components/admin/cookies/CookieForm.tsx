import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cookie, Plan } from '@/types/dataTypes';
import { useDataContext } from '@/hooks/useDataContext';

interface CookieFormProps {
  isEditing: boolean;
  currentCookie: Cookie | null;
  selectedPlanId: string;
  plans: Plan[];
  shouldResetForm: boolean;
  onSave: (cookieData: Partial<Cookie>) => void;
  onCancel: () => void;
  onResetComplete: () => void;
}

const CookieForm = ({ 
  isEditing, 
  currentCookie, 
  selectedPlanId, 
  plans,
  shouldResetForm,
  onSave, 
  onCancel,
  onResetComplete
}: CookieFormProps) => {
  const { platforms } = useDataContext();
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  const [cookieData, setCookieData] = useState('');
  const [domain, setDomain] = useState('');
  const [planId, setPlanId] = useState(selectedPlanId);
  const [isDrafted, setIsDrafted] = useState(false);
  
  // Helper function to find platform by name or ID
  const findPlatformByNameOrId = (identifier: string) => {
    if (!identifier) return null;
    
    // First try to find by ID
    const byId = platforms.find(p => p._id === identifier);
    if (byId) return byId;
    
    // Then try to find by name (for legacy data)
    const byName = platforms.find(p => p.name === identifier);
    if (byName) return byName;
    
    return null;
  };
  
  // Reset form function
  const resetForm = () => {
    setSelectedPlatformId('');
    setCookieData('');
    setDomain('');
    setPlanId(selectedPlanId);
    setIsDrafted(false);
  };
  
  // Handle form reset signal
  useEffect(() => {
    if (shouldResetForm && !isEditing) {
      resetForm();
      onResetComplete();
    }
  }, [shouldResetForm, isEditing, selectedPlanId, onResetComplete]);
  
  // Initialize form when editing mode or current cookie changes
  useEffect(() => {
    if (isEditing && currentCookie) {
      // Try to find platform by platformId first, then by platform name
      const foundPlatform = findPlatformByNameOrId(currentCookie.platformId || currentCookie.platform || '');
      
      if (foundPlatform) {
        setSelectedPlatformId(foundPlatform._id);
      } else {
        // Fallback: use platformId or platform as is
        setSelectedPlatformId(currentCookie.platformId || currentCookie.platform || '');
      }
      
      setCookieData(currentCookie.cookieData || '');
      setDomain(currentCookie.domain || '');
      setPlanId(currentCookie.planId);
      setIsDrafted(currentCookie.isDrafted || false);
    } else {
      // Reset form when not editing
      if (!isEditing) {
        resetForm();
      }
    }
  }, [isEditing, currentCookie, selectedPlanId, platforms]);

  // Update platform name when platform selection changes
  // No automatic domain generation - admin will input manually
  useEffect(() => {
    if (selectedPlatformId) {
      const selectedPlatform = platforms.find(p => p._id === selectedPlatformId);
      if (selectedPlatform) {
        // Only set platform name, no domain auto-generation
      }
    }
  }, [selectedPlatformId, platforms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlatformId) {
      toast.error("Please select a platform");
      return;
    }
    
    if (!cookieData.trim()) {
      toast.error("Cookie data is required");
      return;
    }

    if (!domain.trim()) {
      toast.error("Domain URL is required");
      return;
    }
    
    if (!planId) {
      toast.error("Please select a plan");
      return;
    }

    const selectedPlatform = platforms.find(p => p._id === selectedPlatformId);
    
    onSave({
      platformId: selectedPlatformId, // Always use the actual platform ID
      platform: selectedPlatform?.name || '', // For backward compatibility
      cookieData,
      domain,
      planId,
      isDrafted
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Cookie' : 'Add New Cookie'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update cookie information' : 'Create a new cookie for a plan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              Select Platform
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
              Domain URL
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="Enter domain URL (e.g., coursera.org)"
            />
            <p className="text-xs text-gray-500">
              Enter the domain where cookies will be set
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="plan" className="text-sm font-medium">
              Select Plan
            </label>
            <Select 
              value={planId} 
              onValueChange={setPlanId}
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
            <label htmlFor="cookieData" className="text-sm font-medium">
              Cookie Data
            </label>
            <Textarea
              id="cookieData"
              value={cookieData}
              onChange={e => setCookieData(e.target.value)}
              placeholder="Paste cookie data here (JSON format)"
              className="h-32"
            />
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
              {isEditing ? 'Update Cookie' : 'Add Cookie'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CookieForm;

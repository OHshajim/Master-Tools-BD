
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { CreateTokenRequest, TokenRole } from '@/types/tokenTypes';
import { useDataContext } from '@/hooks/useDataContext';

interface TokenFormProps {
  onCreateToken: (tokenData: CreateTokenRequest) => void;
}

const TokenForm = ({ onCreateToken }: TokenFormProps) => {
  const { platforms, plans } = useDataContext();
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  const role: TokenRole = 'external'; // Fixed to external only
  const [expiryDays, setExpiryDays] = useState('30');
  const [description, setDescription] = useState('');
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  
  // Get selected platform name
  const selectedPlatform = platforms.find(platform => platform._id === selectedPlatformId);
  const tokenName = selectedPlatform?.name || '';
  
  // Get relevant plans based on selected platform
  const getRelevantPlans = () => {
    if (!selectedPlatformId) return [];
    
    // Return plans that include this platform
    return plans.filter(plan => 
      plan.platforms.includes(selectedPlatformId)
    );
  };

  const relevantPlans = getRelevantPlans();

  // Auto-select all relevant plans when they change
  useEffect(() => {
    if (relevantPlans.length > 0) {
      setSelectedPlanIds(relevantPlans.map(plan => plan._id));
    } else {
      setSelectedPlanIds([]);
    }
  }, [selectedPlatformId, relevantPlans.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlatformId) {
      toast.error("Please select a platform");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));

    onCreateToken({
      name: tokenName,
      role,
      expiresAt: expiresAt.toISOString(),
      description: description.trim() || undefined,
      targetPlanIds: selectedPlanIds
    });

    // Reset form
    setSelectedPlatformId('');
    setExpiryDays('30');
    setDescription('');
    setSelectedPlanIds([]);
  };

  const handleSelectAll = () => {
    setSelectedPlanIds(relevantPlans.map(plan => plan._id));
  };

  const handleDeselectAll = () => {
    setSelectedPlanIds([]);
  };

  const togglePlanSelection = (planId: string) => {
    setSelectedPlanIds(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New API Token</CardTitle>
        <CardDescription>
          Generate a new Bearer token for external service API access
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
              placeholder="Choose a platform for this token"
            />
            <p className="text-xs text-gray-500">
              Token will be named after the selected platform
            </p>
          </div>

          {/* Plan Selection - Always shown since all tokens are external */}
          {relevantPlans.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Target Plans
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {relevantPlans.map(plan => (
                    <div key={plan._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plan-${plan._id}`}
                        checked={selectedPlanIds.includes(plan._id)}
                        onCheckedChange={() => togglePlanSelection(plan._id)}
                      />
                      <label
                        htmlFor={`plan-${plan._id}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {plan.name}
                      </label>
                      <span className="text-xs text-gray-500">
                        ${plan.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Select which plans will receive cookie updates from this token
              </p>
            </div>
          )}

          {selectedPlatformId && relevantPlans.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                No plans found with platform "{tokenName}". The token will be created but won't target any specific plans.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="expiry" className="text-sm font-medium">
              Token Expiry
            </label>
            <Select value={expiryDays} onValueChange={setExpiryDays}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Token usage description"
              className="h-20"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Token
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TokenForm;

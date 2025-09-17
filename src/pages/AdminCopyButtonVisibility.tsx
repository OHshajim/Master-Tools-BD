import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Settings, Shield } from 'lucide-react';
import { useDataContext } from '@/hooks/useDataContext';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminCopyButtonVisibility = () => {
  const { 
    plans, 
    platforms, 
    cookies,
    copyButtonVisibility,
    setPlatformCopyButtonVisibility,
    setPlanCopyButtonVisibility,
    setGlobalCopyButtonVisibility,
    getPlatformVisibilityForPlan,
    getCookiesForPlan
  } = useDataContext();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const selectedPlan = plans.find(plan => plan._id === selectedPlanId);
  const planCookies = selectedPlanId ? getCookiesForPlan(selectedPlanId) : [];
  const platformVisibilities = selectedPlanId ? getPlatformVisibilityForPlan(selectedPlanId) : [];

  // Get platforms that have cookies in the selected plan
  const planPlatforms = planCookies.map(cookie => {
    const platform = platforms.find(p => p._id === cookie.platformId);
    return {
      id: cookie.platformId,
      name: platform?.name || cookie.platform,
      logo: platform?.logo
    };
  }).filter((platform, index, self) => 
    index === self.findIndex(p => p.id === platform.id)
  );

  const handlePlatformVisibilityToggle = (platformId: string, isVisible: boolean) => {
    setPlatformCopyButtonVisibility(platformId, selectedPlanId, isVisible);
  };

  const handlePlanVisibilityToggle = (isVisible: boolean) => {
    setPlanCopyButtonVisibility(selectedPlanId, isVisible);
  };

  const handleGlobalVisibilityToggle = (isVisible: boolean) => {
    setGlobalCopyButtonVisibility(isVisible);
  };

  const isPlatformVisible = (platformId: string): boolean => {
    const platformSetting = platformVisibilities.find(v => v.platformId === platformId);
    return platformSetting ? platformSetting.isVisible : true;
  };

  const isPlanVisible = (): boolean => {
    const planSetting = copyButtonVisibility.planVisibility.find(v => v.planId === selectedPlanId);
    return planSetting ? planSetting.isVisible : true;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Copy Button Visibility Control</h1>
          <p className="text-muted-foreground">Manage cookie copy button visibility across plans and platforms</p>
        </div>
      </div>

      <BackToAdminButton />

      {/* Global Visibility Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Global Copy Button Visibility
          </CardTitle>
          <CardDescription>
            Control copy button visibility across all plans and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Copy Buttons Globally</Label>
              <p className="text-xs text-muted-foreground">
                When disabled, all copy buttons will be hidden regardless of individual settings
              </p>
            </div>
            <Switch
              checked={copyButtonVisibility?.globalVisibility?.isVisible}
              onCheckedChange={handleGlobalVisibilityToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Plan-Specific Controls</CardTitle>
          <CardDescription>Select a plan to manage copy button visibility for its platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-select">Select Plan</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plan to manage..." />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="space-y-4 pt-4 border-t">
              {/* Plan-wide Control */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Plan-wide Copy Button Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Control all copy buttons for "{selectedPlan.name}" plan
                  </p>
                </div>
                <Switch
                  checked={isPlanVisible()}
                  onCheckedChange={handlePlanVisibilityToggle}
                  disabled={!copyButtonVisibility.globalVisibility.isVisible}
                />
              </div>

              {/* Platform-specific Controls */}
              {planPlatforms.length > 0 ? (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Platform-specific Controls</Label>
                  <div className="grid gap-3">
                    {planPlatforms.map((platform) => (
                      <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {platform.logo && (
                            <img 
                              src={platform.logo} 
                              alt={`${platform.name} logo`}
                              className="w-8 h-8 rounded object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">Platform ID: {platform.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPlatformVisible(platform.id) ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600" />
                          )}
                          <Switch
                            checked={isPlatformVisible(platform.id)}
                            onCheckedChange={(checked) => handlePlatformVisibilityToggle(platform.id, checked)}
                            disabled={!copyButtonVisibility.globalVisibility.isVisible || !isPlanVisible()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No platforms with cookies found for this plan.</p>
                  <p className="text-sm">Add some cookies to platforms first.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCopyButtonVisibility;
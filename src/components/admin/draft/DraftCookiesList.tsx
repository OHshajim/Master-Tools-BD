
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/hooks/useDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Cookie } from '@/types/cookie';
import { Eye, EyeOff, Cookie as CookieIcon } from 'lucide-react';

interface DraftCookiesListProps {
  userId: string;
  planId: string;
  planName: string;
}

export const DraftCookiesList = ({ userId, planId, planName }: DraftCookiesListProps) => {
  const { user } = useAuth();
  const { 
    getCookiesForPlan, 
    platforms, 
    togglePlatformDraft, 
    isDraftedForUser,
    getPlatformDraftStatus
  } = useDataContext();
  
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [platformMap, setPlatformMap] = useState(new Map());

  useEffect(() => {
    const planCookies = getCookiesForPlan(planId);
    setCookies(planCookies);
    
    // Create platform lookup map
    const map = new Map();
    platforms.forEach(platform => {
      map.set(platform._id, platform);
      map.set(platform.name, platform);
    });
    setPlatformMap(map);
  }, [planId, getCookiesForPlan, platforms]);

  const handleToggleDraft = (cookie: Cookie) => {
    if (!user) return;
    
    // Resolve to actual platform ID
    const platformId = cookie.platformId || 
                      platforms.find(p => p.name === cookie.platform)?._id || 
                      cookie.platform || '';
    togglePlatformDraft(userId, planId, platformId, 'cookie', user._id);
  };

  const getDraftStatus = (cookie: Cookie) => {
    // Resolve to actual platform ID for consistency
    const platformId = cookie.platformId || 
                      platforms.find(p => p.name === cookie.platform)?._id || 
                      cookie.platform || '';
    return getPlatformDraftStatus(userId, planId, platformId, 'cookie');
  };

  const isDrafted = (cookie: Cookie) => {
    // Resolve to actual platform ID for consistency
    const platformId = cookie.platformId || 
                      platforms.find(p => p.name === cookie.platform)?._id || 
                      cookie.platform || '';
    return isDraftedForUser(userId, planId, platformId, 'cookie');
  };

  if (cookies.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No cookies found for this plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CookieIcon className="h-5 w-5" />
          Cookie Platforms - {planName}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Toggle visibility of cookie platforms for this user
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cookies.map((cookie) => {
            const platform = platformMap.get(cookie.platformId) || platformMap.get(cookie.platform);
            const platformName = cookie.platform || cookie.platformId || 'Unknown Platform';
            const isCurrentlyDrafted = isDrafted(cookie);
            const draftStatus = getDraftStatus(cookie);
            
            return (
              <div key={cookie._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {platform?.logo && (
                    <img 
                      src={platform.logo} 
                      alt={platformName} 
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{platformName}</h3>
                    <p className="text-sm text-gray-600">
                      Name: {cookie.name}
                    </p>
                    {cookie.domain && (
                      <p className="text-sm text-gray-500">
                        Domain: {cookie.domain}
                      </p>
                    )}
                    {cookie.isPinned && (
                      <Badge variant="outline" className="mt-1">
                        Pinned
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant={isCurrentlyDrafted ? "destructive" : "default"}>
                      {isCurrentlyDrafted ? "Hidden" : "Visible"}
                    </Badge>
                    
                    <Switch
                      checked={!isCurrentlyDrafted}
                      onCheckedChange={() => handleToggleDraft(cookie)}
                    />
                    
                    {isCurrentlyDrafted ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Hidden platforms will not appear in the user's Access Page, 
            but will remain available for other users with the same plan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

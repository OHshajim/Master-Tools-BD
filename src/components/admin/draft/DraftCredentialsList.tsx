
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/hooks/useDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Credential } from '@/types/credential';
import { Eye, EyeOff } from 'lucide-react';

interface DraftCredentialsListProps {
  userId: string;
  planId: string;
  planName: string;
}

export const DraftCredentialsList = ({ userId, planId, planName }: DraftCredentialsListProps) => {
  const { user } = useAuth();
  const { 
    getCredentialsForPlan, 
    platforms, 
    togglePlatformDraft, 
    isDraftedForUser,
    getPlatformDraftStatus
  } = useDataContext();
  
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [platformMap, setPlatformMap] = useState(new Map());

  useEffect(() => {
    const planCredentials = getCredentialsForPlan(planId);
    setCredentials(planCredentials);
    
    // Create platform lookup map
    const map = new Map();
    platforms.forEach(platform => {
      map.set(platform._id, platform);
      map.set(platform.name, platform);
    });
    setPlatformMap(map);
  }, [planId, getCredentialsForPlan, platforms]);

  const handleToggleDraft = (credential: Credential) => {
    if (!user) return;
    
    // Resolve to actual platform ID
    const platformId = credential.platformId || platforms.find(p => p.name === credential.platform)?._id || credential.platform || '';
    togglePlatformDraft(userId, planId, platformId, 'credential', user._id);
  };

  const getDraftStatus = (credential: Credential) => {
    // Resolve to actual platform ID for consistency
    const platformId = credential.platformId || 
                      platforms.find(p => p.name === credential.platform)?._id || 
                      credential.platform || '';
    return getPlatformDraftStatus(userId, planId, platformId, 'credential');
  };

  const isDrafted = (credential: Credential) => {
    // Resolve to actual platform ID for consistency
    const platformId = credential.platformId || 
                      platforms.find(p => p.name === credential.platform)?._id || 
                      credential.platform || '';
    return isDraftedForUser(userId, planId, platformId, 'credential');
  };

  if (credentials.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No credentials found for this plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Credential Platforms - {planName}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Toggle visibility of credential platforms for this user
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {credentials.map((credential) => {
            const platform = platformMap.get(credential.platformId) || platformMap.get(credential.platform);
            const platformName = credential.platform || credential.platformId || 'Unknown Platform';
            const isCurrentlyDrafted = isDrafted(credential);
            const draftStatus = getDraftStatus(credential);
            
            return (
              <div key={credential._id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      Username: {credential.username}
                    </p>
                    {credential.domain && (
                      <p className="text-sm text-gray-500">
                        Domain: {credential.domain}
                      </p>
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
                      onCheckedChange={() => handleToggleDraft(credential)}
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

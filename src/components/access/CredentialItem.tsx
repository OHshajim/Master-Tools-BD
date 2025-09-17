
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Clock } from 'lucide-react';
import { Credential } from '@/types/access';
import { formatRelativeDate } from '@/utils/formatUtils';
import { CopyButton } from './CopyButton';

interface CredentialItemProps {
  credential: Credential;
  isPasswordVisible: boolean;
  isViewed: boolean;
  onTogglePasswordVisibility: () => void;
  onCopy: (text: string, type: string) => void;
  onGoToPlatform: () => void;
  getPlatformUrl: (platformName?: string) => string;
}

export const CredentialItem = ({
  credential,
  isPasswordVisible,
  isViewed,
  onTogglePasswordVisibility,
  onCopy,
  onGoToPlatform,
  getPlatformUrl,
}: CredentialItemProps) => {
  const platformName = credential.platform;
  const platformUrl = credential.domain ? `https://${credential.domain}` : getPlatformUrl(platformName);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {credential.platformLogo && (
              <img 
                src={credential.platformLogo} 
                alt={`${platformName} logo`}
                className="w-10 h-10 mr-3 rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <CardTitle>{platformName}</CardTitle>
              <CardDescription>Access details for {platformName}</CardDescription>
            </div>
          </div>
          {credential.updatedAt && (
            <div className={`flex items-center text-xs ${!isViewed ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
              <Clock className={`h-3 w-3 mr-1 ${!isViewed ? 'text-green-500' : ''}`} />
              {formatRelativeDate(credential.updatedAt)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username/Email:</label>
          <div className="flex">
            <Input
              value={credential.username}
              readOnly
              className="flex-1 rounded-r-none"
              aria-label={`Username for ${platformName}`}
            />
            <CopyButton 
              text={credential.username}
              type="Username"
              onCopy={onCopy}
              className="rounded-l-none border-l-0"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Password:</label>
          <div className="flex">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              value={credential.password}
              readOnly
              className="flex-1 rounded-r-none"
              aria-label={`Password for ${platformName}`}
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-none border-l-0 border-r-0"
              onClick={onTogglePasswordVisibility}
              aria-label={`${isPasswordVisible ? 'Hide' : 'Show'} password for ${platformName}`}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <CopyButton 
              text={credential.password}
              type="Password"
              onCopy={onCopy}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button asChild className="w-full">
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to {platformName}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Edit, Trash, Clock, ExternalLink } from 'lucide-react';
import { Credential } from '@/types/dataTypes';
import { formatRelativeDate } from '@/utils/formatUtils';
import { getPlatformDomain } from '@/components/access/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';

interface CredentialCardProps {
  credential: Credential;
  onEdit?: (credential: Credential) => void;
  onDelete?: (credential: Credential) => void;
  readOnly?: boolean;
  planName?: string;
}

export const CredentialCard = ({ credential, onEdit, onDelete, readOnly = false, planName }: CredentialCardProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Use user-specific localStorage key
  const [viewedCredentials, setViewedCredentials] = useLocalStorage<Record<string, boolean>>(
    `viewed_credentials_${userId}`, 
    {}
  );
  
  // Store timestamp when viewing credential with user-specific key
  const markAsViewed = () => {
    if (!viewedCredentials[credential.id]) {
      const updatedViewedCredentials = {
        ...viewedCredentials,
        [credential.id]: true
      };
      setViewedCredentials(updatedViewedCredentials);
      localStorage.setItem(`credential_viewed_at_${userId}_${credential.id}`, new Date().toISOString());
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    markAsViewed();
  };

  const getDomainUrl = () => {
    const domain = credential.domain || getPlatformDomain(credential.platform || credential.platformId);
    return `https://${domain}`;
  };
  
  const handleCopyPassword = () => {
    if (credential.password) {
      navigator.clipboard.writeText(credential.password);
      markAsViewed();
    }
  };
  
  // Check if this credential was updated after it was last viewed
  useEffect(() => {
    if (viewedCredentials[credential.id] && credential.updatedAt) {
      const lastViewedAt = localStorage.getItem(`credential_viewed_at_${userId}_${credential.id}`);
      if (lastViewedAt && new Date(credential.updatedAt) > new Date(lastViewedAt)) {
        // Credential was updated after last view, mark as unviewed
        const updatedViewedCredentials = { ...viewedCredentials };
        delete updatedViewedCredentials[credential.id];
        setViewedCredentials(updatedViewedCredentials);
      }
    }
  }, [credential, viewedCredentials, setViewedCredentials, userId]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{credential.platform || credential.platformId}</CardTitle>
          {planName && (
            <p className="text-sm text-muted-foreground">Plan: {planName}</p>
          )}
        </div>
        {credential.updatedAt && (
          <div className={`flex items-center text-sm ${!viewedCredentials[credential.id] ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
            <Clock className={`h-4 w-4 mr-1 ${!viewedCredentials[credential.id] ? 'text-green-500' : ''}`} />
            {formatRelativeDate(credential.updatedAt)}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Username/Email</p>
              <div className="p-2 bg-muted rounded-md">
                {credential.username}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Password</p>
              <div className="p-2 bg-muted rounded-md flex items-center justify-between">
                <span>
                  {isPasswordVisible ? credential.password : '••••••••'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => {
                markAsViewed();
                window.open(getDomainUrl(), '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Go to {credential.platform || credential.platformId}
            </Button>
            
            {!readOnly && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(credential)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50" 
                    onClick={() => onDelete(credential)}
                  >
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

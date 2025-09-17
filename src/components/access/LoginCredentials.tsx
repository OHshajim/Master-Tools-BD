import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { TutorialVideo } from './TutorialVideo';
import { MissingPlatformFallback } from './MissingPlatformFallback';
import { LoginCredentialsProps } from '@/types/access';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { NoCredentialsMessage } from './NoCredentialsMessage';
import { CredentialItem } from './CredentialItem';
import { Eye, EyeOff } from 'lucide-react';

export const LoginCredentials = ({ 
  credentials, 
  getPlatformUrl, 
  showTutorials, 
  onToggleShowTutorials 
}: LoginCredentialsProps) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const userId = user?._id || 'guest_access';

  const [viewedCredentials, setViewedCredentials] = useLocalStorage<Record<string, boolean>>(
    `viewed_credentials_${userId}`,
    {}
  );
  
  // Memoized mark as viewed function
  const markAsViewed = useCallback((credentialId: string) => {
    if (!viewedCredentials[credentialId]) {
      setViewedCredentials(prev => ({
        ...prev,
        [credentialId]: true
      }));
    }
    localStorage.setItem(`credential_viewed_at_${userId}_${credentialId}`, new Date().toISOString());
  }, [viewedCredentials, setViewedCredentials, userId]);

  // Memoized toggle password visibility
  const togglePasswordVisibility = useCallback((credentialId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
    markAsViewed(credentialId);
  }, [markAsViewed]);

  // Memoized copy to clipboard
  const copyToClipboard = useCallback((text: string, type: string, credentialId: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
    
    if (type.toLowerCase() === 'password') {
      markAsViewed(credentialId);
    }
  }, [markAsViewed]);
  
  // Simple platform navigation handler without marking as viewed
  const handleGoToPlatform = useCallback(() => {
    // No action needed - just navigation handled by the button itself
  }, []);
  
  // Memoized credentials validation and cleanup
  const validCredentials = useMemo(() => {
    return credentials.filter(credential => {
      // Basic validation - using 'username' property from access.ts type
      if (!credential._id || !credential.username) {
        return false;
      }
      return true;
    });
  }, [credentials]);

  const invalidCredentials = useMemo(() => {
    return credentials.filter(credential => {
      // Using 'username' property from access.ts type
      return !credential._id || !credential.username;
    });
  }, [credentials]);

  // Effect for cleaning up viewed status - MODIFIED TO FIX DRAFT/UNDRAFT ISSUE
  useEffect(() => {
    if (validCredentials.length > 0) {
      const updatedViewedStatus = { ...viewedCredentials };
      let changesMade = false;

      // Only reset viewed status if credential was actually updated (not just undrafted)
      validCredentials.forEach(credential => {
        if (viewedCredentials[credential._id] && credential.updatedAt) {
          const lastViewedAt = localStorage.getItem(`credential_viewed_at_${userId}_${credential._id}`);
          
          if (lastViewedAt && credential.updatedAt && new Date(credential.updatedAt) > new Date(lastViewedAt)) {
            delete updatedViewedStatus[credential._id];
            localStorage.removeItem(`credential_viewed_at_${userId}_${credential._id}`);
            changesMade = true;
          }
        }
      });

      // Only clean up viewed status for credentials that no longer exist in the system
      // (This would require checking against all credentials in the system, not just visible ones)
      // For now, we'll keep the viewed status even for temporarily hidden credentials
      
      if (changesMade) {
        setViewedCredentials(updatedViewedStatus);
      }
    }
  }, [validCredentials, viewedCredentials, setViewedCredentials, userId]);

  if (validCredentials.length === 0 && invalidCredentials.length === 0) {
    return <NoCredentialsMessage />;
  }

  const tutorialVideoTitle = "Getting Started with Login Credentials";
  const tutorialVideoDescription = "Watch this tutorial to learn how to use your login credentials";
  const tutorialContentLabel = "Login Credentials Tutorial Video";
  const mainSectionHeading = "Your Login Credentials";

  return (
    <>
      <div className="flex justify-end mb-2 mt-2">
        <Button 
          variant={showTutorials ? "default" : "outline"} 
          size="sm" 
          onClick={onToggleShowTutorials} 
          className={`text-sm flex items-center font-medium transition-all duration-200 ${
            showTutorials 
              ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {showTutorials ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          <span>{showTutorials ? 'Hide Tutorial Video' : 'Show Tutorial Video'}</span>
        </Button>
      </div>

      {showTutorials && (
        <TutorialVideo 
          title={tutorialVideoTitle}
          description={tutorialVideoDescription}
          contentLabel={tutorialContentLabel}
        />
      )}

      <h2 className="text-2xl font-bold mb-4 mt-6">{mainSectionHeading}</h2>
      
      <div className="space-y-6 mb-8">
        {validCredentials.map(credential => (
          <CredentialItem
            key={credential._id}
            credential={credential}
            isPasswordVisible={!!visiblePasswords[credential._id]}
            isViewed={!!viewedCredentials[credential._id]}
            onTogglePasswordVisibility={() => togglePasswordVisibility(credential._id)}
            onCopy={(text, type) => copyToClipboard(text, type, credential._id)}
            onGoToPlatform={handleGoToPlatform}
            getPlatformUrl={getPlatformUrl}
          />
        ))}
        
        {/* Show fallback for invalid/missing platform credentials */}
        {invalidCredentials.map(credential => (
          <MissingPlatformFallback
            key={credential._id || Math.random()}
            platformId={credential.platform || 'unknown'}
            platformName={credential.platform}
            type="credential"
          />
        ))}
      </div>
    </>
  );
};

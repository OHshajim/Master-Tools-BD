import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, Eye, EyeOff } from 'lucide-react';
import { TutorialVideo } from './TutorialVideo';
import { CookieCredentialsProps } from '@/types/access';
import { formatRelativeDate } from '@/utils/formatUtils';
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/hooks/useDataContext';
import { CopyButton } from './CopyButton';

export const CookieCredentials = ({ 
  cookies, 
  extensionInstalled, 
  handleDirectAccess, 
  formatDate, 
  copyToClipboard,
  showTutorials,
  onToggleShowTutorials
}: CookieCredentialsProps) => {

  const { user } = useAuth();
  const { isPlatformCopyButtonVisible } = useDataContext();
  const userId = user?._id;
  
  const [platformFilter, setPlatformFilter] = useState("");
  
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>(
    `viewed_cookies_${userId}`, 
    {}
  );
  
  const filteredCookies = platformFilter ? cookies.filter(cookie => 
        cookie.platform.toLowerCase().includes(platformFilter.toLowerCase())
      )
    : cookies;
  
  // Handler for both copy and direct access to mark cookie as clicked
  const handleCookieAction = useCallback((cookieId: string, action: () => void) => {
    action();
    const newClickedState = {
      ...viewedCookies,
      [cookieId]: true
    };
    setViewedCookies(newClickedState);
    localStorage.setItem(`cookie_viewed_at_${userId}_${cookieId}`, new Date().toISOString());
  }, [viewedCookies, setViewedCookies, userId]);

  // Reset viewed state when cookie is updated (similar to CredentialCard logic)
  // Use a stable reference to track cookies to prevent unnecessary re-renders
  const [cookieRef, setCookieRef] = useState<typeof cookies>([]);
  
  useEffect(() => {
    if (cookies.length > 0) {
      const updatedViewedState = { ...viewedCookies };
      let changesMade = false;

      cookies.forEach(cookie => {
        if (viewedCookies[cookie._id] && cookie.updatedAt) {
          const lastViewedAt = localStorage.getItem(`cookie_viewed_at_${userId}_${cookie._id}`);
          
          if (lastViewedAt && new Date(cookie.updatedAt) > new Date(lastViewedAt)) {
            // Only reset viewed state if there were actual content changes, not just draft status
            const prevCookie = cookieRef.find(c => c._id === cookie._id);
            if (prevCookie) {
              const hasContentChanges = 
                prevCookie.cookieData !== cookie.cookieData ||
                prevCookie.domain !== cookie.domain ||
                prevCookie.platformId !== cookie.platformId ||
                prevCookie.platform !== cookie.platform ||
                prevCookie.planId !== cookie.planId;
              
              // Only reset viewed state for content changes, not draft changes
              if (hasContentChanges) {
                delete updatedViewedState[cookie._id];
                localStorage.removeItem(`cookie_viewed_at_${userId}_${cookie._id}`);
                changesMade = true;
              }
            } else {
              // New cookie, reset viewed state
              delete updatedViewedState[cookie._id];
              localStorage.removeItem(`cookie_viewed_at_${userId}_${cookie._id}`);
              changesMade = true;
            }
          }
        }
      });

      
      if (changesMade) {
        setViewedCookies(updatedViewedState);
      }
      
      // Update the reference for next comparison
      setCookieRef(cookies);
    }
  }, [cookies, viewedCookies,userId, cookieRef]);

  // Listen for user data sync events to reset viewed state ONLY for actual cookie content changes
  useEffect(() => {
    const handleUserDataSync = (event: CustomEvent) => {
      const { type } = event.detail;
      
      // Only reset viewed state for actual cookie content changes, NOT for draft platform changes
      if (type === 'userCookies') {
        // Force refresh viewed state when user-specific cookies are updated
        const updatedViewedState = { ...viewedCookies };
        let changesMade = false;

        cookies.forEach(cookie => {
          if (viewedCookies[cookie._id]) {
            // Reset viewed state to restore green highlight after admin update
            delete updatedViewedState[cookie._id];
            localStorage.removeItem(`cookie_viewed_at_${userId}_${cookie._id}`);
            changesMade = true;
          }
        });

        if (changesMade) {
          setViewedCookies(updatedViewedState);
        }
      }
      // Explicitly ignore 'draftPlatforms' type to prevent viewed state reset during draft/undraft operations
    };

    window.addEventListener('userDataSync', handleUserDataSync as EventListener);

    return () => {
      window.removeEventListener('userDataSync', handleUserDataSync as EventListener);
    };
  }, [cookies, viewedCookies, userId]);
  
  if (cookies.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6 text-center">
          <p className="mb-4">No cookie credentials have been added to this plan yet.</p>
          <p className="text-sm text-gray-500">
            The administrator will add cookie credentials soon. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tutorialVideoTitle = "Getting Started with Cookie Credentials";
  const tutorialVideoDescription = "Watch this tutorial to learn how to use cookie credentials";
  const tutorialContentLabel = "Cookie Credentials Tutorial Video";
  const mainSectionHeading = "Platform Cookies";

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
      
      <div className="mb-4 relative">
        <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-primary">
          <Search className="absolute left-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by platform name..."
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="pl-8 focus-visible:ring-0 border-0"
          />
        </div>
        {platformFilter && (
          <div className="mt-2 text-sm">
            Showing {filteredCookies.length} of {cookies.length} cookies
          </div>
        )}
      </div>
      
      <div className="space-y-6 mb-8">
        {filteredCookies.map(cookie => {
          const isClicked = viewedCookies[cookie._id];
          
          const platformIdentifier = cookie.platformId || cookie.platform;
          const isCopyButtonVisible = isPlatformCopyButtonVisible(platformIdentifier, cookie.planId);
          return (
            <Card key={cookie._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {cookie.platformLogo && (
                      <img 
                        src={cookie.platformLogo} 
                        alt={`${cookie.platform} logo`}
                        className="w-10 h-10 mr-3 rounded-md object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <CardTitle>{cookie.platform}</CardTitle>
                      <CardDescription>
                        Cookie for {cookie.platform}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <Clock className={`h-3 w-3 mr-1 ${!isClicked ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className={!isClicked ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {formatRelativeDate(cookie.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cookie Data:</label>
                  <div className="flex">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l p-3 text-sm text-gray-500 truncate">
                      [Protected Cookie Data]
                    </div>
                    {isCopyButtonVisible && (
                      <CopyButton 
                        text={cookie.cookieData}
                        type="Cookie data"
                        onCopy={(text, type) => handleCookieAction(
                          cookie._id, 
                          () => copyToClipboard(text, type)
                        )}
                        className="rounded-l-none"
                      />
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleCookieAction(
                    cookie._id,
                    () => handleDirectAccess(cookie)
                  )}
                  disabled={!extensionInstalled}
                >
                  Access {cookie.platform} Now 
                  {extensionInstalled ? (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Extension Enabled</span>
                  ) : (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Extension Required</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

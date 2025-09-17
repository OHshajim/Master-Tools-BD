import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AccessPageHeader } from '@/components/access/AccessPageHeader';
import { AccessPageTabs } from '@/components/access/AccessPageTabs';
import { ExtensionBanner } from '@/components/access/ExtensionBanner';
import { ExtensionStatus } from '@/components/access/ExtensionStatus';
import { EmptyAccessContent } from '@/components/access/EmptyAccessContent';
import { LoginCredentials } from '@/components/access/LoginCredentials';
import { CookieCredentials } from '@/components/access/CookieCredentials';
import { ImportantNotes } from '@/components/access/ImportantNotes';
import { AccessErrorBoundary } from '@/components/access/AccessErrorBoundary';
import { AccessLoadingState } from '@/components/access/AccessLoadingState';
import { useExtensionStatus } from '@/hooks/useExtensionStatus';
import { useAccessData } from '@/hooks/useAccessData';
import { useClipboard } from '@/hooks/useClipboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { getPlatformUrl, getPlatformDomain } from '@/components/access/utils';
import { Cookie as AccessCookie } from '@/types/access';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AccessPage = () => {
  const { user } = useAuth();
  const { planId } = useParams<{ planId: string }>();
  const [activeTab, setActiveTab] = useState("login");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isInstalled: extensionInstalled, statusMessage: extensionStatus, handleDirectAccess: handleDirectAccessBase } = useExtensionStatus();
  const { isLoading, order, plan, credentials, cookies: unsortedCookies, error, retryLoadData } = useAccessData(planId);
  const { copyToClipboard } = useClipboard();
  const { cookies: allCookies, platforms } = useData();
  const userId = user?._id || 'anonymous';
  
  // Use userId-specific localStorage keys
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>(  `viewed_cookies_${userId}`,   {});
  const [showLoginTutorials, setShowLoginTutorials] = useLocalStorage<boolean>(  `show_login_tutorials_${userId}`,  true);
  const [showCookieTutorials, setShowCookieTutorials] = useLocalStorage<boolean>(  `show_cookie_tutorials_${userId}`,  true);
  const [cookiesTabVisited, setCookiesTabVisited] = useLocalStorage<Record<string, boolean>>(`cookies_tab_visited_${userId}`,{});

  // Enhanced real-time synchronization
  useRealtimeSync({
    onCredentialsUpdate: () => {
      // console.log('Credentials updated, refreshing access data...');
      setRefreshTrigger(prev => prev + 1);
    },
    onCookiesUpdate: () => {
      // console.log('Cookies updated, refreshing access data...');
      setRefreshTrigger(prev => prev + 1);
    },
    onUserSpecificUpdate: () => {
      // console.log('User-specific data updated, refreshing access data...');
      setRefreshTrigger(prev => prev + 1);
    }
  });

  // Enhanced platform finding function with better matching
  const findPlatform = useMemo(() => {
    return (platformId: string, platformName?: string) => {
      if (!platforms || platforms.length === 0) {
        // console.log('No platforms available for matching');
        return null;
      }

      // Try exact ID match first
      let platform = platforms.find(p => p._id === platformId);
      if (platform) {
        // console.log(`Found platform by ID: ${platformId}`, platform);
        return platform;
      }

      // Try exact name match
      if (platformName) {
        platform = platforms.find(p => p.name === platformName);
        if (platform) {
          // console.log(`Found platform by name: ${platformName}`, platform);
          return platform;
        }
      }

      // Try case-insensitive matching
      const platformIdLower = platformId.toLowerCase();
      const platformNameLower = platformName?.toLowerCase();
      
      platform = platforms.find(p => 
        p._id.toLowerCase() === platformIdLower || 
        p.name.toLowerCase() === platformIdLower ||
        (platformNameLower && (p._id.toLowerCase() === platformNameLower || p.name.toLowerCase() === platformNameLower))
      );

      if (platform) {
        // console.log(`Found platform by case-insensitive match:`, platform);
        return platform;
      }

      // console.log(`No platform found for ID: ${platformId}, Name: ${platformName}`);
      return null;
    };
  }, [platforms]);

  // Memoized cookie details map for performance
  const cookieDetailsMap = useMemo(() => {
    const map = new Map();
    allCookies.forEach(cookie => {
      map.set(cookie._id, cookie);
    });
    return map;
  }, [allCookies]);
  
  // Memoized sorted cookies
  const cookies = useMemo(() => {
    return [...unsortedCookies].sort((a, b) => {
      const cookieA = cookieDetailsMap.get(a._id);
      const cookieB = cookieDetailsMap.get(b._id);
      
      if (cookieA?.isPinned && !cookieB?.isPinned) return -1;
      if (!cookieA?.isPinned && cookieB?.isPinned) return 1;
      
      if (cookieA?.isPinned && cookieB?.isPinned) {
        if (cookieA?.pinnedAt && cookieB?.pinnedAt) {
          return new Date(cookieA.pinnedAt).getTime() - new Date(cookieB.pinnedAt).getTime();
        }
      }
      
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [unsortedCookies, cookieDetailsMap]);

  // Check if user should see cookies notification
  const shouldShowCookiesNotification = useMemo(() => {
    if (!planId || !userId || cookies.length === 0) return false;
    return !cookiesTabVisited[planId];
  }, [planId, userId, cookies.length, cookiesTabVisited]);

  // Handle cookies tab click to dismiss notification
  const handleCookiesTabClick = () => {
    if (planId && shouldShowCookiesNotification) {
      const updatedVisited = { ...cookiesTabVisited, [planId]: true };
      setCookiesTabVisited(updatedVisited);
    }
  };

  // Memoized handle direct access
  const handleDirectAccess = useMemo(() => (cookie: AccessCookie) => {
    const domain = cookie.domain || getPlatformDomain(cookie.platform);
    
    const newViewedCookies = { ...viewedCookies, [cookie._id]: true };
    setViewedCookies(newViewedCookies);
    localStorage.setItem(`cookie_viewed_at_${userId}_${cookie._id}`, new Date().toISOString());
    
    handleDirectAccessBase(domain, cookie.cookieData);
  }, [viewedCookies, setViewedCookies, userId, handleDirectAccessBase]);

  // Memoized copy to clipboard handler
  const handleCopyToClipboard = useMemo(() => (text: string, type: string) => {
    copyToClipboard(text, type);
    
    if (type.toLowerCase().includes('cookie')) {
      const cookie = cookies.find(c => c.cookieData === text);
      if (cookie) {
        const newViewedCookies = { ...viewedCookies, [cookie._id]: true };
        setViewedCookies(newViewedCookies);
        localStorage.setItem(`cookie_viewed_at_${userId}_${cookie._id}`, new Date().toISOString());
      }
    }
  }, [copyToClipboard, cookies, viewedCookies, setViewedCookies, userId]);

  // Enhanced access data conversion with improved platform logos
  const accessCredentials = useMemo(() => {
    // console.log('Processing credentials for platform logos:', credentials.length);
    // console.log('Available platforms:', platforms.length);
    
    return credentials.map(cred => {
      const platformId = cred.platformId || cred.platform || '';
      const platformName = cred.platform || cred.platformId || '';
      
      // console.log(`Processing credential: ID=${platformId}, Name=${platformName}`);
      
      // Use enhanced platform finding
      const platform = findPlatform(platformId, platformName);
      
      const result = {
        ...cred,
        platform: platformName || 'Unknown Platform',
        platformLogo: platform?.logo || undefined
      };
      
      // console.log(`Credential result:`, {
      //   id: cred._id,
      //   platform: result.platform,
      //   platformLogo: result.platformLogo ? 'Has logo' : 'No logo',
      //   logoUrl: result.platformLogo
      // });
      
      return result;
    });
  }, [credentials, findPlatform]);

  const accessCookies: AccessCookie[] = useMemo(() => {
    return cookies.map(cookie => {
      const platformId = cookie.platformId || cookie.platform || '';
      const platformName = cookie.platform || cookie.platformId || '';
      
      // Use enhanced platform finding
      const platform = findPlatform(platformId, platformName);
      
      // Ensure platformId is properly set for visibility checking
      const finalPlatformId = platform?._id || cookie.platformId || platformId;
      
      // console.log('Cookie Platform Mapping:', {
      //   cookieId: cookie._id,
      //   originalPlatformId: cookie.platformId,
      //   originalPlatform: cookie.platform,
      //   foundPlatform: platform?._id,
      //   finalPlatformId,
      //   platformName
      // });

      return {
        _id: cookie._id,
        planId: cookie.planId,
        platformId: finalPlatformId,
        platform: platformName || 'Unknown Platform',
        name: cookie.name,
        value: cookie.value,
        cookieData: cookie.cookieData || cookie.value || '',
        domain: cookie.domain,
        updatedAt: cookie.updatedAt || new Date().toISOString(),
        isPinned: cookie.isPinned,
        pinnedAt: cookie.pinnedAt,
        userId: cookie.userId,
        platformLogo: platform?.logo || undefined
      };
    });
  }, [cookies, findPlatform]);

  const toggleShowLoginTutorials = () => {
    setShowLoginTutorials(prev => !prev);
  };
  
  const toggleShowCookieTutorials = () => {
    setShowCookieTutorials(prev => !prev);
  };

  // Calculate hasNoContent after all hooks
  const hasNoContent = credentials.length === 0 && cookies.length === 0;

  // Show loading state
  if (isLoading) {
    return (
      <AccessErrorBoundary>
        <div className="container mx-auto px-4 py-12">
          <AccessLoadingState />
        </div>
      </AccessErrorBoundary>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
        <AccessErrorBoundary>
            <div className="container mx-auto px-4 py-12">
                <Card className="mb-8 border-destructive">
                    <CardContent className="pt-6 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Error Loading Access Data
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {error.message}
                                </p>
                            </div>
                            {error.retryable && (
                                <Button
                                    onClick={retryLoadData}
                                    variant="outline"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AccessErrorBoundary>
    );
  }

  // Show no access or empty content
  if (!plan || !order) {
    return (
      <AccessErrorBoundary>
        <EmptyAccessContent isLoading={isLoading} plan={plan} order={order} />
      </AccessErrorBoundary>
    );
  }
  
  if (hasNoContent) {
    return (
      <AccessErrorBoundary>
        <div className="container mx-auto px-4 py-12">
          <AccessPageHeader planName={plan.name} />
          <EmptyAccessContent isLoading={isLoading} plan={plan} order={order} />
        </div>
      </AccessErrorBoundary>
    );
  }

  return (
    <AccessErrorBoundary>
      <div className="container mx-auto px-4 py-12">
        <AccessPageHeader planName={plan.name} />

        <ExtensionBanner 
          extensionInstalled={extensionInstalled} 
          hasCookies={cookies.length > 0}
          activeTab={activeTab}
        />

        <ExtensionStatus status={extensionStatus} />

        <AccessPageTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showCookiesNotification={shouldShowCookiesNotification}
          onCookiesTabClick={handleCookiesTabClick}
          loginContent={
            <LoginCredentials 
              credentials={accessCredentials} 
              getPlatformUrl={getPlatformUrl} 
              showTutorials={showLoginTutorials}
              onToggleShowTutorials={toggleShowLoginTutorials}
            />
          }
          cookiesContent={
            <CookieCredentials 
              cookies={accessCookies}
              extensionInstalled={extensionInstalled}
              handleDirectAccess={handleDirectAccess}
              formatDate={getPlatformUrl} 
              copyToClipboard={handleCopyToClipboard}
              showTutorials={showCookieTutorials}
              onToggleShowTutorials={toggleShowCookieTutorials}
            />
          }
        />
        
        <ImportantNotes extensionInstalled={extensionInstalled} />
      </div>
    </AccessErrorBoundary>
  );
};

export default AccessPage;


import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Cookie as CookieIcon } from 'lucide-react';

interface AccessPageTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  loginContent: ReactNode;
  cookiesContent: ReactNode;
  showCookiesNotification?: boolean;
  onCookiesTabClick?: () => void;
}

export const AccessPageTabs = ({
  activeTab,
  setActiveTab,
  loginContent,
  cookiesContent,
  showCookiesNotification = false,
  onCookiesTabClick
}: AccessPageTabsProps) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If user clicks on cookies tab and there's a notification, trigger the callback
    if (value === 'cookies' && showCookiesNotification && onCookiesTabClick) {
      onCookiesTabClick();
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="sticky top-16 z-10 bg-background py-2 shadow-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            <Lock className="mr-2 h-4 w-4" /> Login Credentials
          </TabsTrigger>
          <TabsTrigger value="cookies">
            <div className="flex items-start">
              <CookieIcon className="mr-2 h-4 w-4" />
              <div className="relative">
                <span>Cookies Credentials</span>
                {showCookiesNotification && (
                  <div className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-6">
        <TabsContent value="login">
          {loginContent}
        </TabsContent>
        <TabsContent value="cookies">
          {cookiesContent}
        </TabsContent>
      </div>
    </Tabs>
  );
};

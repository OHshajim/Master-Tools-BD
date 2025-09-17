import { Order } from "./order";
import { Plan } from "./plan";

export interface Platform {
  _id: string;
  name: string;
  url?: string;
  domain?: string;
  logo?: string;
}

export interface Credential {
  _id: string;
  platform: string;
  username: string;
  password: string;
  planId: string;
  domain?: string;
  updatedAt?: string;
  platformLogo?: string;
}

export interface Cookie {
  _id: string;
  platform: string;
  platformId?: string;
  domain?: string;
  cookieData: string;
  updatedAt: string;
  planId: string;
  platformLogo?: string;
  isPinned?: boolean;
  pinnedAt?: string;
  userId?: string;
}

export interface TutorialVideo {
  _id: string;
  title: string;
  description: string;
  contentUrl: string;
  thumbnailUrl?: string;
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
}

export interface TutorialVideoProps {
  title: string;
  description: string;
  contentLabel: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  deviceType?: 'desktop' | 'mobile';
}

export interface ExtensionStatusProps {
  status: string;
}

export interface ImportantNotesProps {
  extensionInstalled: boolean;
}

export interface ExtensionBannerProps {
  extensionInstalled: boolean;
  hasCookies: boolean;
  activeTab: string;
}

export interface LoginCredentialsProps {
  credentials: Credential[];
  getPlatformUrl: (platformName?: string) => string;
  showTutorials: boolean;
  onToggleShowTutorials: () => void;
}

export interface CookieCredentialsProps {
  cookies: Cookie[];
  extensionInstalled: boolean;
  handleDirectAccess: (cookie: Cookie) => void;
  formatDate: (dateString: string) => string;
  copyToClipboard: (text: string, type: string) => void;
  showTutorials: boolean;
  onToggleShowTutorials: () => void;
}

export interface EmptyAccessContentProps {
  isLoading: boolean;
  plan: Plan;
  order: Order;
}

export interface CopyButtonProps {
  text: string;
  type: string;
  onCopy: (text: string, type: string) => void;
  className?: string;
}

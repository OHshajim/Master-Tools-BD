
import { Platform } from './platform';
import { Plan } from './plan';
import { Coupon } from './coupon';
import { Credential } from './credential';
import { Order } from './order';
import { Cookie } from './cookie';
import { Notification, NotificationTargetType } from './notification';
import { QuickLink } from './quickLink';
import { Token, CreateTokenRequest } from './tokenTypes';
import { DraftPlatformStatus } from './draftPlatform';
import { CopyButtonVisibility, CopyButtonVisibilityState } from './copyButtonVisibility';
import { UserSpecificCredential } from '@/hooks/providers/credentials/useUserSpecificCredentialProvider';
import { UserSpecificCookie } from '@/hooks/providers/cookies/useUserSpecificCookieProvider';

export interface DataContextType {
    platforms: Platform[];
    plans: Plan[];
    coupons: Coupon[];
    credentials: Credential[];
    orders: Order[];
    cookies: Cookie[];
    notifications: Notification[];
    tokens: Token[];
    quickLinks: QuickLink[];
    draftPlatforms: DraftPlatformStatus[];
    copyButtonVisibility: CopyButtonVisibilityState;

    addPlatform: (platformData: Omit<Platform, "id">) => void;
    updatePlatform: (id: string, platformData: Platform) => void;
    deletePlatform: (id: string) => void;
    addPlan: (planData: Omit<Plan, "_id" | "createdAt" | "updatedAt">) => void;
    loadPlans: () => void;
    updatePlan: (planData: Plan) => void;
    deletePlan: (id: string) => void;
    getPlanById: (id: string) => Plan | undefined;
    addCoupon: (couponData: Omit<Coupon, "id">) => void;
    updateCoupon: (couponData: Coupon) => void;
    deleteCoupon: (id: string) => void;
    getCouponsForPlan: (planId: string) => void;
    validateCoupon: (couponCode: string, planId: string) => void;
    addCredential: (credentialData: Omit<Credential, "_id">) => void;
    updateCredential: (credentialData: Credential) => void;
    deleteCredential: (id: string) => void;
    getCredentialsForPlan: (planId: string) => Credential[];
    createOrder: (orderData: Order) => void;
    updateOrderStatus: (id: string, status: string) => void;
    getOrder: (id: string) => Order | undefined;
    getUserOrders: (userId: string) => Order[];
    addCookie: (cookieData: Omit<Cookie, "id">) => void;
    updateCookie: (cookieData: Cookie) => void;
    deleteCookie: (id: string) => void;
    getCookiesForPlan: (planId: string) => Cookie[];
    togglePinnedStatus: (id: string) => void;
    createToken: (tokenData: CreateTokenRequest) => Token;
    updateTokenStatus: (tokenId: string, isActive: boolean) => void;
    deleteToken: (tokenId: string) => void;
    updateLastUsed: (tokenId: string) => void;
    formatPlanDuration: (
        durationType?: string,
        durationValue?: number
    ) => string;

    addNotification: (
        notificationData: Omit<Notification, "_id" | "isRead" | "createdAt">
    ) => void;
    updateNotification: (id: string, notificationData: Notification) => void;
    deleteNotification: (id: string) => void;
    markNotificationAsRead: (id: string) => void;
    
    addQuickLink: (quickLinkData: Omit<QuickLink, "id" | "createdAt">) => void;
    updateQuickLink: (quickLinkData: QuickLink) => void;
    deleteQuickLink: (id: string) => void;
    getActiveQuickLinks: () => QuickLink[];
    reorderQuickLinks: (quickLinks: QuickLink[]) => void;

    // User-specific management methods
    addUserSpecificCredential: (data: Omit<UserSpecificCredential, "_id">) => Promise<void>;
    updateUserSpecificCredential: ( credentialData: UserSpecificCredential ) => Promise<void>;
    deleteUserSpecificCredential: (id: string) => Promise<void>;
    getUserSpecificCredentials: (userId: string, planId: string) => UserSpecificCredential[];

    addUserSpecificCookie: ( cookieData: Omit<UserSpecificCookie, "_id">) => Promise<void>;
    updateUserSpecificCookie: (cookieData: UserSpecificCookie ) => Promise<void>;
    deleteUserSpecificCookie: (id: string) => void;
    getUserSpecificCookies: ( userId: string, planId: string) => UserSpecificCookie[];

    // Bulk management methods
    getAllUserSpecificCredentials: () => void;
    getAllUserSpecificCookies: () => UserSpecificCookie[];
    getBulkUserPlatformData: () => void;

    // Draft platform management methods
    addDraftPlatform: (
        statusData: Omit<DraftPlatformStatus, "_id" | "draftedAt">
    ) => DraftPlatformStatus;
    removeDraftPlatform: (statusId: string) => DraftPlatformStatus[];
    togglePlatformDraft: (
        userId: string,
        planId: string,
        platformId: string,
        type: "credential" | "cookie",
        draftedBy: string
    ) => DraftPlatformStatus[];
    getUserDraftPlatforms: (
        userId: string,
        planId?: string
    ) => DraftPlatformStatus[];
    isDraftedForUser: (
        userId: string,
        planId: string,
        platformId: string,
        type: "credential" | "cookie"
    ) => boolean;
    getPlatformDraftStatus: (
        userId: string,
        planId: string,
        platformId: string,
        credentialType: "credential" | "cookie"
    ) => DraftPlatformStatus | undefined;

    // Copy button visibility management
    setPlatformCopyButtonVisibility: (
        platformId: string,
        planId: string,
        isVisible: boolean
    ) => void;
    setPlanCopyButtonVisibility: (planId: string, isVisible: boolean) => void;
    setGlobalCopyButtonVisibility: (isVisible: boolean) => void;
    isPlatformCopyButtonVisible: (
        platformId: string,
        planId: string
    ) => boolean;
    getPlatformVisibilityForPlan: (planId: string) => CopyButtonVisibility[];

    // Target audience calculation
    calculateTargetAudience: (
        targetType: NotificationTargetType,
        targetPlanId?: string
    ) => number;


}

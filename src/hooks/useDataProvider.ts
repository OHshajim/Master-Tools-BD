import { DataContextType } from '@/types/dataContext';
import { NotificationTargetType } from '@/types/notification';
import { usePlatformProvider } from './providers/usePlatformProvider';
import { usePlanProvider } from './providers/usePlanProvider';
import { useCouponProvider } from './providers/useCouponProvider';
import { useOrderProvider } from './providers/useOrderProvider';
import { useNotificationProvider } from './providers/useNotificationProvider';
import { useTokenProvider } from './providers/useTokenProvider';
import { useQuickLinkProvider } from './providers/useQuickLinkProvider';
import { useDraftPlatformProvider } from './providers/useDraftPlatformProvider';
import { useCopyButtonVisibilityProvider } from './providers/useCopyButtonVisibilityProvider';
import { Plan } from '@/types';
import { useCredentialProvider } from './providers/credentials/useCredentialProvider';
import { useCookieProvider } from './providers/cookies/useCookieProvider';
import { useUserSpecificCredentialProvider } from './providers/credentials/useUserSpecificCredentialProvider';
import { useUserSpecificCookieProvider } from './providers/cookies/useUserSpecificCookieProvider';

/**
 * Main data provider hook that combines all individual providers
 */
export const useDataProvider = (): DataContextType => {
  // Initialize all providers
  const platformProvider = usePlatformProvider();
  const planProvider = usePlanProvider();
  const couponProvider = useCouponProvider();
  const credentialProvider = useCredentialProvider();
  const cookieProvider = useCookieProvider();
  const orderProvider = useOrderProvider();
  const notificationProvider = useNotificationProvider();
  const tokenProvider = useTokenProvider();
  const quickLinkProvider = useQuickLinkProvider();
  
  // User-specific providers
  const userCredentialProvider = useUserSpecificCredentialProvider();
  const userCookieProvider = useUserSpecificCookieProvider();
  
  // Draft platform provider
  const draftPlatformProvider = useDraftPlatformProvider();
  
  // Copy button visibility provider
  const copyButtonVisibilityProvider = useCopyButtonVisibilityProvider();

  // Calculate target audience for notifications
  const calculateTargetAudience = (targetType: NotificationTargetType, targetPlanId?: string): number => {
    // This function needs users array, so we'll return 0 for now
    // The actual calculation should be done in components that have access to users
    return 0;
  };

  return {
      // Platforms
      platforms: platformProvider.platforms,
      addPlatform: platformProvider.addPlatform,
      updatePlatform: (id: string, platformData) =>
          platformProvider.updatePlatform({ id, platform: platformData }),
      deletePlatform: platformProvider.deletePlatform,

      // Plans
      plans: planProvider.plans,
      addPlan: planProvider.addPlan,
      updatePlan: planProvider.updatePlan,
      loadPlans: planProvider.loadPlans,
      deletePlan: planProvider.deletePlan,
      getPlanById: planProvider.getPlanById,
      formatPlanDuration: (durationType?: string, durationValue?: number) => {
          const plan = { durationType, durationValue };
          return planProvider.formatPlanDuration(plan as Plan);
      },

      // Coupons
      coupons: couponProvider.coupons,
      addCoupon: couponProvider.addCoupon,
      updateCoupon: couponProvider.updateCoupon,
      deleteCoupon: couponProvider.deleteCoupon,
      getCouponsForPlan: (planId: string) =>
          couponProvider.getCouponsForPlan(planId),
      validateCoupon: (couponCode: string, planId: string) =>
          couponProvider.validateCoupon(couponCode, planId),

      // Credentials
      credentials: credentialProvider.credentials,
      addCredential: credentialProvider.addCredential,
      updateCredential: credentialProvider.updateCredential,
      deleteCredential: credentialProvider.deleteCredential,
      getCredentialsForPlan: credentialProvider.getCredentialsForPlan,

      // Cookies
      cookies: cookieProvider.cookies,
      addCookie: cookieProvider.addCookie,
      updateCookie: cookieProvider.updateCookie,
      deleteCookie: cookieProvider.deleteCookie,
      getCookiesForPlan: cookieProvider.getCookiesForPlan,
      togglePinnedStatus: cookieProvider.togglePinnedStatus,

      // Orders
      orders: orderProvider.orders,
      createOrder: (orderData) => orderProvider.createOrder(orderData),
      updateOrderStatus: (
          orderId: string,
          status:
              | "pending"
              | "completed"
              | "cancelled"
              | "approved"
              | "rejected"
      ) => orderProvider.updateOrderStatus({ orderId, status }),
      getOrder: orderProvider.getOrder,
      getUserOrders: (userId) => orderProvider.getUserOrders(userId),

      // Notifications
      notifications: notificationProvider.notifications,
      addNotification: notificationProvider.addNotification,
      updateNotification: (id: string, notificationData) =>
          notificationProvider.updateNotification(notificationData),
      deleteNotification: notificationProvider.deleteNotification,
      markNotificationAsRead: notificationProvider.markNotificationAsRead,
      calculateTargetAudience,

      // Tokens
      tokens: tokenProvider.tokens,
      createToken: tokenProvider.createToken,
      updateTokenStatus: tokenProvider.updateTokenStatus,
      deleteToken: tokenProvider.deleteToken,
      updateLastUsed: tokenProvider.updateLastUsed,

      // Quick Links
      quickLinks: quickLinkProvider.quickLinks,
      addQuickLink: quickLinkProvider.addQuickLink,
      updateQuickLink: quickLinkProvider.updateQuickLink,
      deleteQuickLink: quickLinkProvider.deleteQuickLink,
      getActiveQuickLinks: quickLinkProvider.getActiveQuickLinks,
      reorderQuickLinks: quickLinkProvider.reorderQuickLinks,

      // User-specific management methods
      addUserSpecificCredential: userCredentialProvider.addUserSpecificCredential,
      updateUserSpecificCredential:userCredentialProvider.updateUserSpecificCredential,
      deleteUserSpecificCredential:userCredentialProvider.deleteUserSpecificCredential,
      getUserSpecificCredentials:userCredentialProvider.getUserCredentials,

      addUserSpecificCookie: userCookieProvider.addUserSpecificCookie,
      updateUserSpecificCookie: userCookieProvider.updateUserSpecificCookie,
      deleteUserSpecificCookie: userCookieProvider.deleteUserSpecificCookie,
      getUserSpecificCookies: userCookieProvider.getUserSpecificCookies,

      // Bulk management methods
      getAllUserSpecificCredentials:userCredentialProvider.getUserCredentials,
      getAllUserSpecificCookies: userCookieProvider.getUserSpecificCookies,
      getBulkUserPlatformData: userCredentialProvider.getBulkUserPlatformData,

      // Draft platform management methods
      draftPlatforms: draftPlatformProvider.draftPlatforms,
      addDraftPlatform: draftPlatformProvider.addDraftPlatform,
      removeDraftPlatform: draftPlatformProvider.removeDraftPlatform,
      togglePlatformDraft: draftPlatformProvider.togglePlatformDraft,
      getUserDraftPlatforms: draftPlatformProvider.getUserDraftPlatforms,
      isDraftedForUser: draftPlatformProvider.isDraftedForUser,
      getPlatformDraftStatus: draftPlatformProvider.getPlatformDraftStatus,

      // Copy button visibility management methods
      copyButtonVisibility: copyButtonVisibilityProvider.visibilityData,
      setPlatformCopyButtonVisibility: copyButtonVisibilityProvider.setPlatformVisibility,
      setPlanCopyButtonVisibility: copyButtonVisibilityProvider.setPlanVisibility,
      setGlobalCopyButtonVisibility: copyButtonVisibilityProvider.setGlobalVisibility,
      isPlatformCopyButtonVisible: copyButtonVisibilityProvider.isPlatformCopyButtonVisible,
      getPlatformVisibilityForPlan: copyButtonVisibilityProvider.getPlatformVisibilityForPlan,
  };
};

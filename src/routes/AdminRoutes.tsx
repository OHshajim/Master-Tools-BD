
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminOrders from "@/pages/AdminOrders";
import AdminOrderDetail from "@/pages/AdminOrderDetail";
import AdminPlans from "@/pages/AdminPlans";
import AdminPlanDetail from "@/pages/AdminPlanDetail";
import NewPlanPage from "@/pages/plans/NewPlanPage";
import AdminCredentials from "@/pages/AdminCredentials";
import AdminCookies from "@/pages/AdminCookies";
import AdminCoupons from "@/pages/AdminCoupons";
import AdminPlatforms from "@/pages/AdminPlatforms";
import AdminUsers from "@/pages/AdminUsers";
import AdminTutorials from "@/pages/AdminTutorials";
import AdminMobileTutorials from "@/pages/AdminMobileTutorials";
import AdminNotifications from "@/pages/AdminNotifications";
import AdminCouponSalesReport from "@/pages/AdminCouponSalesReport";
import AdminTokens from "@/pages/AdminTokens";
import AdminDeletedPlansArchive from "@/pages/AdminDeletedPlansArchive";
import AdminBrandIdentity from "@/pages/AdminBrandIdentity";
import AdminQuickLinks from "@/pages/AdminQuickLinks";
import SingleUserCredentialManagement from "@/pages/SingleUserCredentialManagement";
import SingleUserCookieManagement from "@/pages/SingleUserCookieManagement";
import AdminBulkUserManagement from "@/pages/AdminBulkUserManagement";
import DraftCredentialsManagement from "@/pages/DraftCredentialsManagement";
import DraftCookiesManagement from "@/pages/DraftCookiesManagement";
import AdminBulkDraftManagement from "@/pages/AdminBulkDraftManagement";
import AdminCopyButtonVisibility from "@/pages/AdminCopyButtonVisibility";

// Define a function that returns all the admin routes
const AdminRoutes = () => {
  return (
    [
      <Route key="admin" path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />,
      <Route key="admin-orders" path="/admin/orders" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminOrders />
        </ProtectedRoute>
      } />,
      <Route key="admin-order-detail" path="/admin/orders/:id" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminOrderDetail />
        </ProtectedRoute>
      } />,
      <Route key="admin-plans" path="/admin/plans" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlans />
        </ProtectedRoute>
      } />,
      <Route key="admin-new-plan" path="/admin/plans/new" element={
        <ProtectedRoute adminManagerOnly>
          <NewPlanPage />
        </ProtectedRoute>
      } />,
      <Route key="admin-plan-detail" path="/admin/plans/:id" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlanDetail />
        </ProtectedRoute>
      } />,
      <Route key="admin-platforms" path="/admin/platforms" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlatforms />
        </ProtectedRoute>
      } />,
      <Route key="admin-credentials-with-plan" path="/admin/credentials/:planId" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCredentials />
        </ProtectedRoute>
      } />,
      <Route key="admin-credentials" path="/admin/credentials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCredentials />
        </ProtectedRoute>
      } />,
      <Route key="admin-cookies-with-plan" path="/admin/cookies/:planId" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCookies />
        </ProtectedRoute>
      } />,
      <Route key="admin-cookies" path="/admin/cookies" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCookies />
        </ProtectedRoute>
      } />,
      <Route key="admin-coupons" path="/admin/coupons" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCoupons />
        </ProtectedRoute>
      } />,
      <Route key="admin-coupons-by-plan" path="/admin/coupons/plan/:planId" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCoupons />
        </ProtectedRoute>
      } />,
      <Route key="admin-users" path="/admin/users" element={
        <ProtectedRoute adminManagerOnly>
          <AdminUsers />
        </ProtectedRoute>
      } />,
      <Route key="admin-tutorials" path="/admin/tutorials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminTutorials />
        </ProtectedRoute>
      } />,
      <Route key="admin-mobile-tutorials" path="/admin/mobile-tutorials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminMobileTutorials />
        </ProtectedRoute>
      } />,
      <Route key="admin-notifications" path="/admin/notifications" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminNotifications />
        </ProtectedRoute>
      } />,
      <Route key="admin-coupon-sales-report" path="/admin/coupon-sales-report" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCouponSalesReport />
        </ProtectedRoute>
      } />,
      <Route key="admin-tokens" path="/admin/tokens" element={
        <ProtectedRoute adminManagerOnly>
          <AdminTokens />
        </ProtectedRoute>
      } />,
      <Route key="admin-deleted-plans-archive" path="/admin/deleted-plans-archive" element={
        <ProtectedRoute adminManagerOnly>
          <AdminDeletedPlansArchive />
        </ProtectedRoute>
      } />,
      <Route key="admin-brand-identity" path="/admin/brand-identity" element={
        <ProtectedRoute adminOnly>
          <AdminBrandIdentity />
        </ProtectedRoute>
      } />,
      <Route key="admin-quick-links" path="/admin/quick-links" element={
        <ProtectedRoute adminManagerOnly>
          <AdminQuickLinks />
        </ProtectedRoute>
      } />,
      <Route key="admin-single-user-credentials" path="/admin/single-user-credentials" element={
        <ProtectedRoute adminManagerOnly>
          <SingleUserCredentialManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-single-user-cookies" path="/admin/single-user-cookies" element={
        <ProtectedRoute adminManagerOnly>
          <SingleUserCookieManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-bulk-user-management" path="/admin/bulk-user-management" element={
        <ProtectedRoute adminManagerOnly>
          <AdminBulkUserManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-draft-credentials-platform" path="/admin/draft-credentials-platform" element={
        <ProtectedRoute adminManagerOnly>
          <DraftCredentialsManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-draft-cookies-platform" path="/admin/draft-cookies-platform" element={
        <ProtectedRoute adminManagerOnly>
          <DraftCookiesManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-bulk-draft-management" path="/admin/bulk-draft-management" element={
        <ProtectedRoute adminManagerOnly>
          <AdminBulkDraftManagement />
        </ProtectedRoute>
      } />,
      <Route key="admin-copy-button-visibility" path="/admin/copy-button-visibility" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCopyButtonVisibility />
        </ProtectedRoute>
      } />
    ]
  );
};

export default AdminRoutes;

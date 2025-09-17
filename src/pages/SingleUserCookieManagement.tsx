
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/hooks/useDataContext';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import UserSearchSection from '@/components/admin/single-user/UserSearchSection';
import UserInfoSection from '@/components/admin/single-user/UserInfoSection';
import UserSpecificCookieForm from '@/components/admin/single-user/UserSpecificCookieForm';
import { useUserSearch } from '@/hooks/admin/useUserSearch';

const SingleUserCookieManagement = () => {
  const { user, isAdmin, isManager } = useAuth();
  const { plans } = useDataContext();
  const navigate = useNavigate();
  
  const {
    searchQuery,
    setSearchQuery,
    searchedUser,
    userOrders,
    selectedPlanId,
    isSearching,
    searchError,
    handleUserSearch,
    handlePlanSelect,
    resetSelection
  } = useUserSearch();

  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
    }
  }, [user, isAdmin, isManager, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Single User Manage Cookies</h1>
        <p className="text-gray-600">
          Search for a user and manage their specific cookies
        </p>
      </div>
      
      <BackToAdminButton />

      <UserSearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        searchError={searchError}
        onUserSearch={handleUserSearch}
        onReset={resetSelection}
        hasResults={!!searchedUser}
      />

      {searchedUser && (
        <UserInfoSection
          user={searchedUser}
          orders={userOrders}
          plans={plans}
          selectedPlanId={selectedPlanId}
          onPlanSelect={handlePlanSelect}
        />
      )}

      {searchedUser && selectedPlanId && (
        <UserSpecificCookieForm
          userId={searchedUser._id}
          planId={selectedPlanId}
          planName={plans.find(p => p._id === selectedPlanId)?.name || ''}
        />
      )}
    </div>
  );
};

export default SingleUserCookieManagement;

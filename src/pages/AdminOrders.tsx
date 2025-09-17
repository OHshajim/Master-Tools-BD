
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import OrderFilters from '@/components/admin/orders/OrderFilters';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import RefreshButton from '@/components/admin/orders/RefreshButton';
import { useOrdersFilter } from '@/hooks/useOrdersFilter';

const AdminOrders = () => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const { orders } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  
  const {
    filteredOrders, 
    statusFilter, 
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    paymentSearchQuery,
    setPaymentSearchQuery
  } = useOrdersFilter(orders, lastRefresh);

  // Initialize search query from URL parameter
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  useEffect(() => {
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
      return;
    }
    
    // Function to refresh the data periodically
    const refreshData = () => {
      setLastRefresh(Date.now());
    };
    
    // Set up a small interval to refresh the component
    const intervalId = setInterval(refreshData, 3000);
    
    // Listen for storage events from other tabs/windows
    const handleStorageEvent = () => {
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storageUpdate', handleStorageEvent);
    window.addEventListener('ordersUpdated', handleStorageEvent);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storageUpdate', handleStorageEvent);
      window.removeEventListener('ordersUpdated', handleStorageEvent);
    };
  }, [user, isAdmin, isManager, isSupport, navigate]);

  const handleManualRefresh = () => {
    setLastRefresh(Date.now());
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <RefreshButton onClick={handleManualRefresh} />
      </div>
      <p className="text-gray-600 mb-8">Review and manage all customer orders</p>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      {/* Filters */}
      <OrderFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentSearchQuery={paymentSearchQuery}
        setPaymentSearchQuery={setPaymentSearchQuery}
      />
      
      {/* Orders Table */}
      <OrdersTable 
        filteredOrders={filteredOrders}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default AdminOrders;

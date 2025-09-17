
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/hooks/useDataContext';
import { User as UserType } from '@/types/auth';
import { Order } from '@/types/dataTypes';

export const useUserSearch = () => {
  const { getUsers } = useAuth();
  const { getUserOrders } = useDataContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<UserType | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>('');

  const handleUserSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter user name or email');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Get all users from AuthContext
      const allUsers = await getUsers();
      
      // Search for user by email or name (case-insensitive, partial match)
      const foundUser = allUsers.find(u => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundUser) {
        setSearchedUser(foundUser);
        
        // Get user's orders
        const orders = getUserOrders(foundUser._id);
        const completedOrders = orders.filter(order => 
          order.status === 'completed' || order.status === 'approved'
        );
        
        setUserOrders(completedOrders);
        
        if (completedOrders.length === 0) {
          setSearchError('No completed orders found for this user');
        }
      } else {
        setSearchedUser(null);
        setUserOrders([]);
        setSearchError('No user found with this name or email');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setSearchError('Error occurred while searching for user');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const resetSelection = () => {
    setSearchedUser(null);
    setUserOrders([]);
    setSelectedPlanId('');
    setSearchQuery('');
    setSearchError('');
  };

  return {
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
  };
};

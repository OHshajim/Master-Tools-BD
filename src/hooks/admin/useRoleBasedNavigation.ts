
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleBasedNavigation = () => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Path-specific role checks
    if (path === '/admin' && !isAdmin) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    if (path === '/manager' && !isManager) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    if (path === '/support' && !isSupport) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Admin-only route protection (e.g., user management)
    if ((path === '/admin/users' || path.startsWith('/admin/users/')) && !isAdmin && !isManager) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Order access for admin, manager, and support
    if ((path === '/admin/orders' || path.startsWith('/admin/orders/')) && !isAdmin && !isManager && !isSupport) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
  }, [user, isAdmin, isManager, isSupport, navigate, path]);
};


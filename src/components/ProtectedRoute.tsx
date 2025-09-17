
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  managerOnly?: boolean;
  supportOnly?: boolean;
  adminManagerOnly?: boolean;
  adminManagerSupportOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  managerOnly = false,
  supportOnly = false,
  adminManagerOnly = false,
  adminManagerSupportOnly = false
}) => {
  const { user, isLoading, isAdmin, isManager, isSupport } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (adminOnly && !isAdmin) {
        navigate("/dashboard");
      } else if (managerOnly && !isManager) {
        navigate("/dashboard");
      } else if (supportOnly && !isSupport) {
        navigate("/dashboard");
      } else if (adminManagerOnly && !isAdmin && !isManager) {
        navigate("/dashboard");
      } else if (adminManagerSupportOnly && !isAdmin && !isManager && !isSupport) {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, isAdmin, isManager, isSupport, navigate, adminOnly, managerOnly, supportOnly, adminManagerOnly, adminManagerSupportOnly]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Show content only when authentication is complete and user has proper permissions
  if (!user) return null;
  if ((adminOnly && !isAdmin) || 
      (managerOnly && !isManager) || 
      (supportOnly && !isSupport) ||
      (adminManagerOnly && !isAdmin && !isManager) ||
      (adminManagerSupportOnly && !isAdmin && !isManager && !isSupport)) {
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

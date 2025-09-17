
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavLinksProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  condition?: boolean;
}

const NavLinks = ({ isMobile = false, onMobileItemClick }: NavLinksProps) => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  
  const baseClasses = "text-sm font-medium hover:text-brand-600 transition-colors";
  const mobileClasses = "px-2 py-1";
  
  const handleClick = () => {
    if (isMobile && onMobileItemClick) {
      onMobileItemClick();
    }
  };

  const navItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/plans", label: "Plans" },
    { to: "/dashboard", label: "Dashboard", condition: !!user },
    { to: "/admin", label: "Admin", condition: isAdmin },
    { to: "/manager", label: "Manager", condition: isManager },
    { to: "/support", label: "Support", condition: isSupport }
  ];

  const visibleItems = navItems.filter(item => item.condition !== false);

  return (
    <>
      {visibleItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={handleClick}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;

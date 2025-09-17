
import { useAuth } from "@/contexts/AuthContext";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden px-4 py-2 pb-4 border-t">
      <nav className="flex flex-col space-y-3">
        <NavLinks isMobile={true} onMobileItemClick={onClose} />
        <AuthButtons 
          isMobile={true} 
          onMobileItemClick={handleLogout} 
        />
      </nav>
    </div>
  );
};

export default MobileMenu;

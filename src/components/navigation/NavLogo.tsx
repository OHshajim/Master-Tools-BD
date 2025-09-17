
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useBrandContext } from "@/hooks/useBrandContext";

const NavLogo = () => {
  const { brandInfo } = useBrandContext();
  
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="flex items-center">
        {brandInfo.logoUrl ? (
          <img 
            src={brandInfo.logoUrl} 
            alt={`${brandInfo.platformName} logo`}
            className="h-8 w-8 mr-2 object-contain"
          />
        ) : (
          <Package className="h-6 w-6 text-brand-600 mr-2" />
        )}
        <span className="text-xl font-bold">{brandInfo.platformName}</span>
      </Link>
    </div>
  );
};

export default NavLogo;

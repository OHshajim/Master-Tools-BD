
import { Package } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandContext } from "@/hooks/useBrandContext";

const SignupHeader = () => {
  const { brandInfo } = useBrandContext();
  
  return (
    <CardHeader className="space-y-1 flex flex-col items-center">
      <div className="flex items-center mb-2">
        {brandInfo.logoUrl ? (
          <img 
            src={brandInfo.logoUrl} 
            alt={`${brandInfo.platformName} logo`}
            className="h-6 w-6 mr-2 object-contain"
          />
        ) : (
          <Package className="h-6 w-6 text-brand-600 mr-2" />
        )}
        <span className="text-xl font-bold">{brandInfo.platformName}</span>
      </div>
      <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
      <CardDescription className="text-center">
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
  );
};

export default SignupHeader;


import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";


const SocialLoginButtons = () => {
  const {handleGoogle,handleMicrosoft}=useAuth()
  const onGoogleLogin = () => {
    handleGoogle();
  };
  
  const onMicrosoftLogin = () => {
    handleMicrosoft();
  };
  return (
    <>
      <div className="w-full flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full mb-3"
        onClick={onGoogleLogin}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M15.4001 8.116C15.4001 7.48 15.3478 7.016 15.2346 6.536H8.00006V9.304H12.2869C12.2001 10.024 11.7478 11.084 10.6346 11.8L10.6208 11.892L12.9154 13.6932L13.0685 13.708C14.5408 12.356 15.4001 10.416 15.4001 8.116Z" fill="#4285F4"/>
          <path d="M8.00005 15.9999C10.16 15.9999 11.9708 15.2799 13.0685 13.7079L10.6346 11.7999C9.99911 12.2399 9.13285 12.5599 8.00005 12.5599C5.91994 12.5599 4.15448 11.1879 3.52354 9.27988L3.43753 9.28778L1.05371 11.1425L1.01717 11.2319C2.10434 14.0559 4.82411 15.9999 8.00005 15.9999Z" fill="#34A853"/>
          <path d="M3.52356 9.28001C3.36144 8.8 3.2667 8.28 3.2667 7.74001C3.2667 7.2 3.36144 6.68001 3.51265 6.20001L3.50804 6.10151L1.08089 4.20831L1.01718 4.26C0.371936 5.30667 0 6.48667 0 7.74001C0 8.99334 0.371936 10.1733 1.01718 11.22L3.52356 9.28001Z" fill="#FBBC05"/>
          <path d="M8.00005 2.92C9.50245 2.92 10.5135 3.6 11.0716 4.12L13.2344 2.02C11.9639 0.844 10.1687 0 8.00005 0C4.82411 0 2.10434 1.944 1.01717 4.768L3.51264 6.708C4.15447 4.8 5.91994 2.92 8.00005 2.92Z" fill="#EB4335"/>
        </svg>
        Continue with Google
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className="w-full mb-4"
        onClick={onMicrosoftLogin}
      >
        <svg width="16" height="16" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M11 0H0V11H11V0Z" fill="#F25022" />
          <path d="M23 0H12V11H23V0Z" fill="#7FBA00" />
          <path d="M11 12H0V23H11V12Z" fill="#00A4EF" />
          <path d="M23 12H12V23H23V12Z" fill="#FFB900" />
        </svg>
        Continue with Microsoft
      </Button>
    </>
  );
};

export default SocialLoginButtons;

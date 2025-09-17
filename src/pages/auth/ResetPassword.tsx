
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import {api} from "@/hooks/axios/useAxios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!email || !token) {
      setError("Invalid password reset link");
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      setError("Invalid password reset link");
      return;
    }
    
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
        const res = await api.post(
            "/api/auth/reset-password",
            {
                token,
                newPassword: password,
            }
        );

        if (res.data.success) {
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setError(res.data.message || "Failed to reset password");
        }
    } catch (err) {
        setError(err.response?.data?.message || "Failed to reset password");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <Package className="h-6 w-6 text-brand-600 mr-2" />
              <span className="text-xl font-bold">AccessVault</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          
          {success ? (
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded-md mb-4">
                Your password has been reset successfully. You'll be redirected to the login page shortly.
              </div>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Go to Login
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md">
                    {error}
                  </div>
                )}
                
                {(!email || !token) ? (
                  <div className="text-center py-2">
                    <p className="mb-4 text-gray-600">The password reset link is invalid or has expired.</p>
                    <Link to="/login" className="text-brand-600 hover:underline">
                      Return to login
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">New Password</label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your new password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="Confirm your new password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isSubmitting} 
                      />
                    </div>
                  </>
                )}
              </CardContent>
              {(email && token) && (
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !email || !token}
                  >
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </CardFooter>
              )}
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

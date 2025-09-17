
import { PasswordResetRequest } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

// Get users from localStorage
const getStoredUsers = (): Array<any> => {
  return JSON.parse(localStorage.getItem('accessVaultUsers') || '[]');
};

// Save users to localStorage
const saveUsers = (users: Array<any>) => {
  localStorage.setItem('accessVaultUsers', JSON.stringify(users));
};

export const forgotPassword = async (
  users: Array<any>,
  passwordResetRequests: Array<PasswordResetRequest>,
  setPasswordResetRequests: React.Dispatch<React.SetStateAction<Array<PasswordResetRequest>>>,
  email: string
): Promise<void> => {
  try {
    // Check if user exists
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!userExists) {
      throw new Error('No account found with this email address');
    }
    
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set expiration to 24 hours from now
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    
    // Save the reset request
    const updatedRequests = [
      ...passwordResetRequests.filter(r => r.email !== email), // Remove previous requests for this email
      { email, token, expires }
    ];
    
    setPasswordResetRequests(updatedRequests);
    
    // In a real application, this would send an email
    console.log(`Password reset link: /reset-password?email=${encodeURIComponent(email)}&token=${token}`);
    
    toast.success("If an account exists with this email, a password reset link will be sent");
  } catch (error: any) {
    console.error('Forgot password error:', error);
    // Still show success to prevent email enumeration attacks
    toast.success("If an account exists with this email, a password reset link will be sent");
  }
};

export const resetPassword = async (
  users: Array<any>,
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  passwordResetRequests: Array<PasswordResetRequest>,
  setPasswordResetRequests: React.Dispatch<React.SetStateAction<Array<PasswordResetRequest>>>,
  email: string, 
  token: string, 
  newPassword: string
): Promise<void> => {
  try {
    // Find the reset request
    const request = passwordResetRequests.find(
      r => r.email.toLowerCase() === email.toLowerCase() && r.token === token
    );
    
    if (!request) {
      throw new Error('Invalid or expired password reset link');
    }
    
    if (request.expires < Date.now()) {
      // Remove expired request
      setPasswordResetRequests(passwordResetRequests.filter(r => !(r.email === email && r.token === token)));
      throw new Error('Password reset link has expired');
    }
    
    // Update the user's password in localStorage
    const storedUsers = getStoredUsers();
    const updatedUsers = storedUsers.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    
    // Update both state and localStorage
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    // Remove the used reset request
    setPasswordResetRequests(passwordResetRequests.filter(r => !(r.email === email && r.token === token)));
    
    toast.success("Password has been reset successfully");
  } catch (error: any) {
    console.error('Reset password error:', error);
    toast.error(error.message || 'Failed to reset password');
    throw error;
  }
};

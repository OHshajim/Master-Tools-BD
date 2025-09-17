
import { User } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

// Get users from localStorage
const getStoredUsers = (): Array<any> => {
  return JSON.parse(localStorage.getItem('accessVaultUsers') || '[]');
};

// Save users to localStorage
const saveUsers = (users: Array<any>) => {
  localStorage.setItem('accessVaultUsers', JSON.stringify(users));
};

// Initial user data
export const INITIAL_USERS = [
  { 
    id: '1', 
    email: 'shayan.ahmed.global@gmail.com', 
    name: 'Shayan Ahmed', 
    password: 'Shay@n%24', 
    role: 'admin' as const,
    blocked: false
  },
  { 
    id: '2', 
    email: 'user@example.com', 
    name: 'Test User', 
    password: 'user123', 
    role: 'user' as const,
    blocked: false
  },
];

export const getUserById = (users: Array<any>, id: string): User | undefined => {
  const foundUser = users.find(u => u.id === id);
  if (!foundUser) return undefined;
  
  // Return user without password
  const { password, ...userWithoutPassword } = foundUser;
  return userWithoutPassword;
};

export const getUsers = (users: Array<any>): User[] => {
  // Return all users without passwords
  return users.map(({ password, ...user }) => user);
};

export const blockUser = async (
  users: Array<any>, 
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  userId: string
): Promise<void> => {
  try {
    // Block the user
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, blocked: true };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Sync with localStorage
    toast.success("User blocked successfully");
  } catch (error: any) {
    console.error('Block user error:', error);
    toast.error(error.message || 'Failed to block user');
    throw error;
  }
};

export const unblockUser = async (
  users: Array<any>, 
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  userId: string
): Promise<void> => {
  try {
    // Unblock the user
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, blocked: false };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Sync with localStorage
    toast.success("User unblocked successfully");
  } catch (error: any) {
    console.error('Unblock user error:', error);
    toast.error(error.message || 'Failed to unblock user');
    throw error;
  }
};

export const changeUserRole = async (
  users: Array<any>, 
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  userId: string,
  newRole: 'admin' | 'manager' | 'support' | 'user',
  currentUser: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<void> => {
  try {
    // Check if user is trying to change their own role and prevent it
    if (currentUser && currentUser.id === userId && currentUser.role === 'admin' && newRole !== 'admin') {
      throw new Error('You cannot change your own admin role');
    }
    
    // Change the user role
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Sync with localStorage
    
    // If the user whose role is being changed is currently logged in,
    // update their session as well
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('accessVaultUser', JSON.stringify(updatedUser));
    }
    
    toast.success(`User role changed to ${newRole} successfully`);
  } catch (error: any) {
    console.error('Change user role error:', error);
    toast.error(error.message || 'Failed to change user role');
    throw error;
  }
};

export const updateProfile = async (
  user: User,
  users: Array<any>, 
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  name: string, 
  email: string
): Promise<void> => {
  try {
    // Check if email is changing and if it's already in use
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = users.some(u => 
        u.id !== user.id && u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('Email is already in use');
      }
    }
    
    // Update the user in the users array
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, name, email };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Sync with localStorage
    
    // Update the current user
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    localStorage.setItem('accessVaultUser', JSON.stringify(updatedUser));
    
    toast.success("Profile updated successfully");
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast.error(error.message || 'Failed to update profile');
    throw error;
  }
};

export const changePassword = async (
  user: User,
  users: Array<any>, 
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  currentPassword: string, 
  newPassword: string
): Promise<void> => {
  try {
    // Find the user and verify current password
    const currentUser = users.find(u => u.id === user.id);
    
    if (!currentUser || currentUser.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update the password
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Sync with localStorage
    
  } catch (error: any) {
    console.error('Change password error:', error);
    toast.error(error.message || 'Failed to change password');
    throw error;
  }
};

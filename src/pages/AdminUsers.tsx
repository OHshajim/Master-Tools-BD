
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSearch } from '@/components/admin/users/UserSearch';
import { UserTable } from '@/components/admin/users/UserTable';
import { BlockUserDialog } from '@/components/admin/users/BlockUserDialog';
import { ChangeRoleDialog } from '@/components/admin/users/ChangeRoleDialog';
import { User } from '@/types/auth';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminUsers = () => {
  const { user, isAdmin, isManager, getUsers, blockUser, unblockUser, changeUserRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialize search query from URL parameter
    return searchParams.get('search') || '';
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'block' | 'unblock'>('block');
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'support' | 'user'>('user');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
      return;
    }

    // Function to load users with latest data
    const loadLatestUsers = async() => {
      const allUsers = await getUsers();
      setUsers(allUsers);
      
      if (searchQuery.trim() === '') {
        setFilteredUsers(allUsers);
      } else {
        applyFilter(allUsers);
      }
    };

    // Load users initially
    loadLatestUsers();
    
    // Set up refresh interval
    const intervalId = setInterval(loadLatestUsers, 5000);
    
    return () => clearInterval(intervalId);
  }, [user, isAdmin, isManager, navigate, getUsers, searchQuery]);

  // Apply filter to users based on search query
  const applyFilter = (usersList: User[]) => {
    const query = searchQuery.toLowerCase();
    const filtered = usersList.filter(
      u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      applyFilter(users);
    }
  };

  const handleBlockAction = (user: User) => {
    setSelectedUser(user);
    setActionType(user.blocked ? 'unblock' : 'block');

    setConfirmDialogOpen(true);
  };

  const handleRoleAction = (user: User) => {
    // Only allow admins to change roles
    if (!isAdmin) return;
    
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      if (actionType === 'block') {
        await blockUser(selectedUser._id);
        setUsers(users.map(u => u._id === selectedUser._id ? {...u, blocked: true} : u));
      } else {
        await unblockUser(selectedUser._id);
        setUsers(users.map(u => u._id === selectedUser._id ? {...u, blocked: false} : u));
      }
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error processing action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !isAdmin) return;

    setIsProcessing(true);
    try {
      await changeUserRole(selectedUser._id, selectedRole);
      
      setUsers(users.map(u => u._id === selectedUser._id ? {...u, role: selectedRole} : u));
      setRoleDialogOpen(false);
    } catch (error) {
      console.error('Error changing role:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
      <p className="text-gray-600 mb-8">View and manage all registered users</p>

      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {filteredUsers?.length} {filteredUsers?.length === 1 ? 'user' : 'users'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          <UserTable 
            users={filteredUsers} 
            onBlockAction={handleBlockAction} 
            onRoleAction={handleRoleAction}
            isManager={isManager}
          />
        </CardContent>
      </Card>

      {/* Block/Unblock Dialog */}
      <BlockUserDialog 
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        selectedUser={selectedUser}
        actionType={actionType}
        isProcessing={isProcessing}
        onConfirm={confirmAction}
      />

      {/* Change Role Dialog - Only shown for admin users */}
      {isAdmin && (
        <ChangeRoleDialog 
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          selectedUser={selectedUser}
          selectedRole={selectedRole}
          isProcessing={isProcessing}
          onRoleChange={setSelectedRole}
          onConfirm={confirmRoleChange}
        />
      )}
    </div>
  );
};

export default AdminUsers;

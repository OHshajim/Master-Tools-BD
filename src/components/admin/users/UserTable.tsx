import { User } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UserTableProps {
  users: User[];
  onRoleAction: (user: User) => void;
  onBlockAction: (user: User) => void;
  isManager?: boolean;
}

export const UserTable = ({ users, onRoleAction, onBlockAction, isManager = false }: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Role</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-3">{user.name}</td>
              <td className="py-3">{user.email}</td>
              <td className="py-3 capitalize">{user.role}</td>
              <td className="py-3">
                {user.blocked ? (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Blocked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                )}
              </td>
              <td className="py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRoleAction(user)}
                    disabled={(user._id === '1' && user.role === 'admin') || isManager} // Prevent managers from changing roles
                  >
                    Change Role
                  </Button>
                  <Button
                    variant={user.blocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => onBlockAction(user)}
                    disabled={user.role === 'admin'} // Prevent blocking admin users
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
          <p className="text-sm text-gray-400">Try changing your search query</p>
        </div>
      )}
    </div>
  );
};

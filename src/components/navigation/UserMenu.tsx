
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const { user, logout, isAdmin, isManager, isSupport } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to="/dashboard">
          <DropdownMenuItem >
            Dashboard
          </DropdownMenuItem>
        </Link>
        {isAdmin && (
          <Link to="/admin">
            <DropdownMenuItem>
              Admin Dashboard
            </DropdownMenuItem>
          </Link>
        )}
        {isManager && (
          <Link to="/manager">
            <DropdownMenuItem >
              Manager Dashboard
            </DropdownMenuItem>
          </Link>
        )}
        {isSupport && (
          <Link to="/support">
            <DropdownMenuItem>
              Support Dashboard
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

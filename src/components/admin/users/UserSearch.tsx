
import { Input } from '@/components/ui/input';

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const UserSearch = ({ searchQuery, onSearchChange }: UserSearchProps) => {
  return (
    <div className="mb-6">
      <Input
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

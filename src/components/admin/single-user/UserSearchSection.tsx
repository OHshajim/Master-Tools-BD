
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, Info } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface UserSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchError: string;
  onUserSearch: () => void;
  onReset: () => void;
  hasResults: boolean;
}

const UserSearchSection: React.FC<UserSearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  searchError,
  onUserSearch,
  onReset,
  hasResults
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUserSearch();
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter user email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={onUserSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {(hasResults || searchError) && (
              <Button variant="outline" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
          
          {/* Search Error Message */}
          {searchError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{searchError}</span>
            </div>
          )}
          
          {/* Search Tips */}
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <p>Tips: You can search by partial email or name match</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSearchSection;

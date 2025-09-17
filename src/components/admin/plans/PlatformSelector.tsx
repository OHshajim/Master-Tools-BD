
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Platform } from '@/types/dataTypes';

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  togglePlatform: (platformId: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatforms,
  togglePlatform
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter platforms based on search term
  const filteredPlatforms = useMemo(() => {
    if (!searchTerm.trim()) {
      return platforms;
    }
    
    return platforms.filter(platform =>
      platform.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [platforms, searchTerm]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Included Platforms</p>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results count */}
        {searchTerm && (
          <p className="text-xs text-gray-500">
            Showing {filteredPlatforms.length} of {platforms.length} platforms
          </p>
        )}
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredPlatforms.map(platform => (
          <div key={platform._id} className="flex items-center space-x-2">
            <Checkbox 
              id={`platform-${platform._id}`}
              checked={selectedPlatforms.includes(platform._id)}
              onCheckedChange={() => togglePlatform(platform._id)}
            />
            <label 
              htmlFor={`platform-${platform._id}`}
              className="text-sm cursor-pointer flex-1"
              title={platform.name}
            >
              {platform.name}
            </label>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPlatforms.length === 0 && searchTerm && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            No platforms found matching "{searchTerm}"
          </p>
          <button
            onClick={clearSearch}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            type="button"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Selected platforms count */}
      {selectedPlatforms.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

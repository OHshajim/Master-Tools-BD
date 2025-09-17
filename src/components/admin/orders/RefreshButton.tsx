
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" onClick={onClick} className="flex items-center gap-2">
      <RefreshCw className="h-4 w-4" />
      <span>Refresh</span>
    </Button>
  );
};

export default RefreshButton;

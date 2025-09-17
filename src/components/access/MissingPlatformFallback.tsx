
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface MissingPlatformFallbackProps {
  platformId: string;
  platformName?: string;
  type: 'credential' | 'cookie';
}

export const MissingPlatformFallback = ({ 
  platformId, 
  platformName, 
  type 
}: MissingPlatformFallbackProps) => {
  return (
    <Card className="border-dashed border-muted-foreground/50">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {platformName || platformId || 'Unknown Platform'}
              </span>
              <Badge variant="outline" className="text-xs">
                {type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform information is not available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

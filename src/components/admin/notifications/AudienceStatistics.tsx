
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AudienceStatisticsProps {
  audienceStats: {
    totalUsers: number;
    purchasingUsers: number;
    nonPurchasingUsers: number;
  } | null;
}

export const AudienceStatistics: React.FC<AudienceStatisticsProps> = ({ audienceStats }) => {
  if (!audienceStats) return null;

  return (
    <div className="p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 text-sm font-medium mb-4">
        <BarChart3 className="h-4 w-4" />
        Audience Statistics
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg">{audienceStats.totalUsers}</div>
          <div className="text-muted-foreground">Total Users</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{audienceStats.purchasingUsers}</div>
          <div className="text-muted-foreground">Ever Purchased</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{audienceStats.nonPurchasingUsers}</div>
          <div className="text-muted-foreground">Never Purchased</div>
        </div>
      </div>
    </div>
  );
};

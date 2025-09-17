
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan } from '@/types/dataTypes';
import { Home, Eye, EyeOff, Users, Shield, Clock } from 'lucide-react';

interface AdminPlanCardProps {
  plan: Plan;
  platformNames: string[];
  formatDuration: (durationType: string, durationValue: number) => string;
  toggleHomepageDisplay: (plan: Plan) => void;
  onEdit: (planId: string) => void;
  onDelete: (plan: Plan) => void;
  hasActiveSubscriptions?: boolean;
  hasPendingSubscriptions?: boolean;
  activeSubscriptionsCount?: number;
  pendingSubscriptionsCount?: number;
  canDelete?: boolean;
}

const AdminPlanCard: React.FC<AdminPlanCardProps> = ({
  plan,
  platformNames,
  formatDuration,
  toggleHomepageDisplay,
  onEdit,
  onDelete,
  hasActiveSubscriptions = false,
  hasPendingSubscriptions = false,
  activeSubscriptionsCount = 0,
  pendingSubscriptionsCount = 0,
  canDelete = true
}) => {
  const hasAnySubscriptions = hasActiveSubscriptions || hasPendingSubscriptions;
  
  return (
    <Card className="relative">
      {plan.stickerText && (
        <div 
          className="absolute top-0 right-0 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg"
          style={{ backgroundColor: plan.stickerColor || '#8B5CF6' }}
        >
          {plan.stickerText}
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="flex-1">{plan.name}</span>
          <span className="text-lg">${plan.price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        {/* Draft Status */}
        {plan.isDraft && (
          <div className="mb-4">
            <Badge className="bg-orange-500">
              <EyeOff className="w-3 h-3 mr-1" /> Draft
            </Badge>
          </div>
        )}
        
        {/* Active Subscriptions Badge */}
        {hasActiveSubscriptions && (
          <div className="mb-2">
            <Badge className="bg-green-500">
              <Users className="w-3 h-3 mr-1" /> 
              {activeSubscriptionsCount} Active Subscription{activeSubscriptionsCount > 1 ? 's' : ''}
            </Badge>
          </div>
        )}
        
        {/* Pending Subscriptions Badge */}
        {hasPendingSubscriptions && (
          <div className="mb-4">
            <Badge className="bg-yellow-500">
              <Clock className="w-3 h-3 mr-1" /> 
              {pendingSubscriptionsCount} Pending Subscription{pendingSubscriptionsCount > 1 ? 's' : ''}
            </Badge>
          </div>
        )}
        
        {/* Homepage Badge */}
        {plan.showOnHomepage && !plan.isDraft && (
          <div className="mb-4">
            <Badge className="bg-blue-500">
              <Home className="w-3 h-3 mr-1" /> Homepage
            </Badge>
          </div>
        )}

        {/* Slug Display */}
        {plan.slug && (
          <div className="mb-4">
            <p className="text-xs text-gray-500">
              URL: mastertoolsbd.com/plans/{plan.slug}
            </p>
          </div>
        )}
        
        {/* Display duration */}
        <div className="mb-4">
          <Badge variant="outline" className="bg-blue-50">
            {formatDuration(plan.durationType || 'months', plan.durationValue || 1)}
          </Badge>
        </div>
        
        {platformNames.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Included Platforms:</p>
            <div className="flex flex-wrap gap-2">
              {platformNames.map((name, i) => (
                <Badge key={i} variant="outline">{name}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Homepage Toggle - Only show for published plans */}
        {!plan.isDraft && (
          <div className="flex gap-2 mt-4">
            <Button 
              variant={plan.showOnHomepage ? "default" : "outline"} 
              size="sm"
              className="flex-1"
              onClick={() => toggleHomepageDisplay(plan)}
            >
              <Home className="w-4 h-4 mr-2" />
              {plan.showOnHomepage ? "On Homepage" : "Add to Homepage"}
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(plan._id)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            className={`flex-1 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onDelete(plan)}
            disabled={!canDelete}
            title={!canDelete ? 'Cannot delete plan with active or pending subscriptions' : 'Delete plan'}
          >
            {!canDelete && <Shield className="w-4 h-4 mr-1" />}
            Delete
          </Button>
        </div>
        
        {/* Protection Notice */}
        {hasAnySubscriptions && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
            <Shield className="w-3 h-3 inline mr-1" />
            Protected: This plan has {hasActiveSubscriptions ? 'active' : ''} {hasActiveSubscriptions && hasPendingSubscriptions ? 'and ' : ''} {hasPendingSubscriptions ? 'pending' : ''} subscriptions
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPlanCard;

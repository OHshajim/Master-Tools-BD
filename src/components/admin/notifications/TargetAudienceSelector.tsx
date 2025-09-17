
import React from 'react';
import { NotificationTargetType } from '@/types/notification';
import { Plan } from '@/types/plan';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Info } from 'lucide-react';

interface TargetAudienceSelectorProps {
  targetType: NotificationTargetType;
  setTargetType: (value: NotificationTargetType) => void;
  targetPlanId: string;
  setTargetPlanId: (value: string) => void;
  plans: Plan[];
  targetCount: number;
}

export const TargetAudienceSelector: React.FC<TargetAudienceSelectorProps> = ({
  targetType,
  setTargetType,
  targetPlanId,
  setTargetPlanId,
  plans,
  targetCount
}) => {
  const getTargetDescription = () => {
    switch (targetType) {
      case 'all':
        return 'All registered users will receive this notification';
      case 'purchased':
        return 'Only users who have made at least one purchase will receive this notification';
      case 'non-purchased':
        return 'Only users who have registered but never made any purchase will receive this notification';
      case 'specific-plan':
        return 'Only users with active subscriptions for the selected plan will receive this notification';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Users className="h-4 w-4" />
        Target Audience
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetType">Who should receive this notification?</Label>
        <Select value={targetType} onValueChange={(value) => setTargetType(value as NotificationTargetType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select target audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="purchased">Users Who Ever Purchased</SelectItem>
            <SelectItem value="non-purchased">Users Who Never Purchased</SelectItem>
            <SelectItem value="specific-plan">Users with Active Plan Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {targetType === 'specific-plan' && (
        <div className="space-y-2">
          <Label htmlFor="targetPlan">Select Plan</Label>
          <Select value={targetPlanId} onValueChange={setTargetPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan._id} value={plan._id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {getTargetDescription()}
          </span>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {targetCount} users
        </Badge>
      </div>
    </div>
  );
};


import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from '@/types/dataTypes';

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
  label?: string;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  selectedPlanId,
  onPlanChange,
  label = "Filter by Plan"
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select 
        value={selectedPlanId} 
        onValueChange={(value) => onPlanChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Plans" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Plans</SelectLabel>
            <SelectItem value="all">All Plans</SelectItem>
            {plans.map(plan => (
              <SelectItem key={plan._id} value={plan._id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};


import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order, Plan, User } from '@/types';

interface PlanPurchaseSidebarProps {
  plan: Plan;
  platformNames: string[];
  formatDuration: (plan: Plan) => string;
  onBuyNow: () => void;
  user?: User;
  orders?: Order[];
}

const PlanPurchaseSidebar = ({ 
  plan, 
  platformNames, 
  formatDuration, 
  onBuyNow,
  user,
  orders = []
}: PlanPurchaseSidebarProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">${plan?.price?.toFixed(2)}</h2>
        <p className="text-sm text-gray-500">{formatDuration(plan)}</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <span>Access to {platformNames.length} learning platforms</span>
        </div>
        <div className="flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <span>Instant approval process</span>
        </div>
        <div className="flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <span>Regular credential updates</span>
        </div>
        <div className="flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <span>Priority customer support</span>
        </div>
      </div>
      
      <Button 
        onClick={onBuyNow} 
        className="w-full mb-4" 
        size="lg"
      >
        Buy Now
      </Button>
      
      <p className="text-sm text-center text-gray-500">
        30-day satisfaction guarantee
      </p>
    </div>
  );
};

export default PlanPurchaseSidebar;

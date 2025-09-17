
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface BasicPlanDetailsProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: number;
  setPrice: (price: number) => void;
  showOnHomepage: boolean;
  setShowOnHomepage: (show: boolean) => void;
  homepagePlansCount: number;
}

export const BasicPlanDetails: React.FC<BasicPlanDetailsProps> = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  showOnHomepage,
  setShowOnHomepage,
  homepagePlansCount
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Plan Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Basic Developer Pack"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g., Access to basic programming courses"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">
          Price (USD)
        </label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(parseFloat(e.target.value) || 0)}
          placeholder="e.g., 29.99"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="homepage"
          checked={showOnHomepage}
          onCheckedChange={(checked) => {
            setShowOnHomepage(!!checked);
          }}
        />
        <div>
          <label 
            htmlFor="homepage"
            className="text-sm cursor-pointer font-medium"
          >
            Display on Homepage
          </label>
          <p className="text-xs text-gray-500">Show this plan in the featured section on the homepage</p>
        </div>
      </div>
    </div>
  );
};

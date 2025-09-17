
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface PlanBenefitsSectionProps {
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
}

export const PlanBenefitsSection: React.FC<PlanBenefitsSectionProps> = ({
  benefits,
  setBenefits
}) => {
  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Plan Benefits</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBenefit}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Benefit
        </Button>
      </div>
      
      {benefits.length === 0 && (
        <p className="text-sm text-gray-500">
          No benefits added yet. Click "Add Benefit" to start adding plan benefits.
        </p>
      )}
      
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={benefit}
              onChange={(e) => updateBenefit(index, e.target.value)}
              placeholder="Enter a plan benefit..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeBenefit(index)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

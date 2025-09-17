
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { DurationType, Platform } from '@/types/dataTypes';
import { DurationInputs } from './DurationInputs';
import { PlatformSelector } from './PlatformSelector';
import { StickerSettings } from './StickerSettings';
import { SlugAndDraftSettings } from './SlugAndDraftSettings';

// Basic information component
export const PlanBasicInfo: React.FC<{
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: number;
  setPrice: (price: number) => void;
}> = ({ name, setName, description, setDescription, price, setPrice }) => {
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
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
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
        />
      </div>
    </div>
  );
};

// Form actions component
export const PlanFormActions: React.FC<{
  handleSave: () => void;
  isSaving: boolean;
  isNewPlan?: boolean;
}> = ({ handleSave, isSaving, isNewPlan }) => {
  return (
    <div className="pt-4">
      <Button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full sm:w-auto"
      >
        {isSaving ? "Saving..." : isNewPlan ? "Create Plan" : "Save Changes"}
      </Button>
    </div>
  );
};

// Export the new component
export { SlugAndDraftSettings };

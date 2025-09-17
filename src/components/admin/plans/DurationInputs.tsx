
import React from 'react';
import { Input } from '@/components/ui/input';
import { DurationType } from '@/types/dataTypes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DurationInputsProps {
  durationType: DurationType;
  setDurationType: (value: DurationType) => void;
  durationValue: number;
  setDurationValue: (value: number) => void;
}

export const DurationInputs: React.FC<DurationInputsProps> = ({
  durationType,
  setDurationType,
  durationValue,
  setDurationValue
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="durationType" className="text-sm font-medium">
          Duration Type
        </label>
        <Select 
          value={durationType} 
          onValueChange={(value: DurationType) => setDurationType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Duration</SelectLabel>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="durationValue" className="text-sm font-medium">
          Duration Value
        </label>
        <Input
          id="durationValue"
          type="number"
          min="1"
          value={durationValue}
          onChange={e => setDurationValue(parseInt(e.target.value) || 1)}
          placeholder="e.g., 1"
        />
      </div>
    </div>
  );
};

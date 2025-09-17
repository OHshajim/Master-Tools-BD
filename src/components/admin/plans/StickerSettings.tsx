
import React from 'react';
import { Input } from '@/components/ui/input';
import { CirclePlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StickerSettingsProps {
  stickerText: string;
  setStickerText: (text: string) => void;
  stickerColor: string;
  setStickerColor: (color: string) => void;
}

const colorOptions = [
  { label: "Purple", value: "#8B5CF6" },
  { label: "Blue", value: "#0EA5E9" },
  { label: "Green", value: "#10B981" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Pink", value: "#EC4899" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Gray", value: "#6B7280" }
];

export const StickerSettings: React.FC<StickerSettingsProps> = ({
  stickerText,
  setStickerText,
  stickerColor,
  setStickerColor
}) => {
  return (
    <div className="space-y-2 p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
        <CirclePlus size={16} />
        Sticker Settings
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="sticker-text" className="text-sm font-medium">
            Sticker Text
          </label>
          <Input
            id="sticker-text"
            value={stickerText}
            onChange={e => setStickerText(e.target.value)}
            placeholder="Premium, Exclusive, etc."
          />
          <p className="text-xs text-gray-500">Leave empty for no sticker</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sticker-color" className="text-sm font-medium">
            Sticker Color
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="sticker-color"
              type="color"
              value={stickerColor}
              onChange={e => setStickerColor(e.target.value)}
              className="w-12 h-9 p-1"
            />
            <Select
              value={stickerColor}
              onValueChange={(value: string) => setStickerColor(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose color" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Presets</SelectLabel>
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        ></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {stickerText && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">Preview:</p>
          <div className="inline-block mt-1">
            <span
              className="px-3 py-1 rounded text-xs font-bold text-white"
              style={{ backgroundColor: stickerColor }}
            >
              {stickerText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

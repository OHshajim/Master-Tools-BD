
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SlugAndDraftSettingsProps {
  slug: string;
  setSlug: (slug: string) => void;
  isDraft: boolean;
  setIsDraft: (isDraft: boolean) => void;
  slugError?: string;
  baseUrl?: string;
}

export const SlugAndDraftSettings: React.FC<SlugAndDraftSettingsProps> = ({
  slug,
  setSlug,
  isDraft,
  setIsDraft,
  slugError,
  baseUrl = 'mastertoolsbd.com'
}) => {
  return (
    <div className="space-y-4">
      {/* Custom Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium">
          Plan Slug (Custom URL)
        </Label>
        <Input
          id="slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="e.g., premium-5-days"
          className={slugError ? "border-red-500" : ""}
        />
        {slugError && (
          <p className="text-sm text-red-500">{slugError}</p>
        )}
        {slug && !slugError && (
          <p className="text-sm text-gray-500">
            URL Preview: <span className="font-mono">{window.location.origin}/plans/{slug}</span>
          </p>
        )}
        <p className="text-xs text-gray-400">
          Auto-generated from plan name. You can edit. Slug is required. Only letters, numbers, and hyphens allowed.
        </p>
      </div>

      {/* Save as Draft */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDraft"
          checked={isDraft}
          onCheckedChange={(checked) => setIsDraft(checked as boolean)}
        />
        <Label htmlFor="isDraft" className="text-sm font-medium">
          Save as Draft
        </Label>
      </div>
      {isDraft && (
        <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
          <strong>Draft Mode:</strong> This plan will not be visible to public users until published.
        </p>
      )}
    </div>
  );
};

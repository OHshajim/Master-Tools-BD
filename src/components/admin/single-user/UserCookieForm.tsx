
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { Platform } from '@/types/dataTypes';

interface UserCookieFormProps {
  platforms: Platform[];
  platform: string;
  setPlatform: (value: string) => void;
  cookieData: string;
  setCookieData: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  isSubmitting: boolean;
  editingCookie: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  planName: string;
}

const UserCookieForm: React.FC<UserCookieFormProps> = ({
  platforms,
  platform,
  setPlatform,
  cookieData,
  setCookieData,
  domain,
  setDomain,
  isSubmitting,
  editingCookie,
  onSubmit,
  onCancel,
  planName
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingCookie ? 'Edit' : 'Add'} Cookie for {planName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <SearchablePlatformSelect
              platforms={platforms}
              value={platform}
              onValueChange={setPlatform}
              placeholder="Select a platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookieData">Cookie Data *</Label>
            <Textarea
              id="cookieData"
              value={cookieData}
              onChange={(e) => setCookieData(e.target.value)}
              placeholder="Paste cookie data here..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., udemy.com"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingCookie ? 'Update' : 'Add'} Cookie
            </Button>
            {editingCookie && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserCookieForm;

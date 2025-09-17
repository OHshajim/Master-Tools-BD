
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SearchablePlatformSelect } from '@/components/ui/searchable-platform-select';
import { Eye, EyeOff } from 'lucide-react';
import { Platform } from '@/types/dataTypes';

interface UserCredentialFormProps {
  platforms: Platform[];
  platform: string;
  setPlatform: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  isSubmitting: boolean;
  editingCredential: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  planName: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const UserCredentialForm: React.FC<UserCredentialFormProps> = ({
  platforms,
  platform,
  setPlatform,
  username,
  setUsername,
  password,
  setPassword,
  domain,
  setDomain,
  isSubmitting,
  editingCredential,
  onSubmit,
  onCancel,
  planName,
  showPassword,
  onTogglePassword
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingCredential ? 'Edit' : 'Add'} Credential for {planName}
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
            <Label htmlFor="username">Username/Email *</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={onTogglePassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., company.udemy.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter domain manually for credential usage
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || !domain}>
              {isSubmitting ? 'Saving...' : editingCredential ? 'Update' : 'Add'} Credential
            </Button>
            {editingCredential && (
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

export default UserCredentialForm;

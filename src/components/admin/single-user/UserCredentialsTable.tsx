
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Credential, Platform } from '@/types/dataTypes';

interface UserCredentialsTableProps {
  credentials: Credential[];
  platforms: Platform[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string, platformName: string) => void;
  onCopy: (text: string, type: string) => void;
}

const UserCredentialsTable: React.FC<UserCredentialsTableProps> = ({
  credentials,
  platforms,
  onEdit,
  onDelete,
  onCopy
}) => {
  // Helper function to get platform name from platform ID
  const getPlatformName = (platformId: string, fallbackPlatform?: string): string => {
    const platform = platforms.find(p => p._id === platformId);
    if (platform) {
      return platform.name;
    }
    // Fallback to the platform field if it exists and looks like a name (not a UUID)
    if (fallbackPlatform && !fallbackPlatform.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return fallbackPlatform;
    }
    // If platform not found and no valid fallback, return the platformId or fallback
    return fallbackPlatform || platformId;
  };

  if (credentials.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing User-Specific Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.map((cred) => {
              const platformName = getPlatformName(cred.platformId, cred.platform);
              
              return (
                <TableRow key={cred._id}>
                  <TableCell className="font-medium">{platformName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[150px]">{cred.username}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(cred.username, 'Username')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>••••••••</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(cred.password, 'Password')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{cred.domain || '-'}</TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {cred.updatedAt && new Date(cred.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(cred)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(cred._id, platformName)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserCredentialsTable;

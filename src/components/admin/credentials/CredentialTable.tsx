import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clipboard, Clock } from 'lucide-react';
import { formatRelativeDate } from '@/utils/formatUtils';
import { Credential } from '@/types/dataTypes';

interface CredentialTableProps {
  credentials: Credential[];
  planNames: Record<string, string>;
  planName?: string;
  handleEditCredentialClick: (credential: Credential) => void;
  openDeleteDialog: (credential: Credential) => void;
  copyToClipboard: (text: string, type: string) => void;
}

export const CredentialTable: React.FC<CredentialTableProps> = ({
  credentials,
  planNames,
  planName,
  handleEditCredentialClick,
  openDeleteDialog,
  copyToClipboard
}) => {
  if (credentials.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No credentials found. {planName ? 'Add credentials for this plan.' : 'Add some credentials.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map(credential => (
            <TableRow key={credential._id}>
              <TableCell>{credential.platform || credential.platformId}</TableCell>
              <TableCell>{credential.username}</TableCell>
              <TableCell>{planNames[credential.planId] || 'Unknown Plan'}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatRelativeDate(credential.updatedAt)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(credential.password || '', 'Password')}
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCredentialClick(credential)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openDeleteDialog(credential)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Rename the export to be consistent with how it's used in AdminCredentials.tsx
export const CredentialsCard: React.FC<CredentialTableProps & { 
  plan?: { _id: string; name: string } | null;
}> = ({ 
  credentials, 
  planNames, 
  plan, 
  handleEditCredentialClick, 
  openDeleteDialog, 
  copyToClipboard 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credentials</CardTitle>
        <CardDescription>
          {plan ? 
            `Credentials for selected plan: ${plan.name}` : 
            'All credentials across plans'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CredentialTable 
          credentials={credentials}
          planNames={planNames}
          planName={plan?.name}
          handleEditCredentialClick={handleEditCredentialClick}
          openDeleteDialog={openDeleteDialog}
          copyToClipboard={copyToClipboard}
        />
      </CardContent>
    </Card>
  );
};

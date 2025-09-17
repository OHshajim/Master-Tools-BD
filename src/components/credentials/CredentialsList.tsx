
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Credential } from '@/types/dataTypes';
import { CredentialCard } from './CredentialCard';

interface CredentialsListProps {
  credentials: Credential[];
  onEdit?: (credential: Credential) => void;
  onDelete?: (credential: Credential) => void;
  onAddNew?: () => void;
  emptyStateText?: string;
  emptyStateButtonText?: string;
  readOnly?: boolean;
  planNames?: Record<string, string>;
}

export const CredentialsList = ({ 
  credentials, 
  onEdit, 
  onDelete, 
  onAddNew,
  emptyStateText = "No credentials have been added yet",
  emptyStateButtonText = "Add Your First Credential",
  readOnly = false,
  planNames = {}
}: CredentialsListProps) => {
  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">{emptyStateText}</p>
          {onAddNew && (
            <Button onClick={onAddNew}>
              {emptyStateButtonText}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {credentials.map(credential => (
        <CredentialCard 
          key={credential.id}
          credential={credential}
          onEdit={readOnly ? undefined : onEdit}
          onDelete={readOnly ? undefined : onDelete}
          readOnly={readOnly}
          planName={planNames[credential.planId]}
        />
      ))}
    </div>
  );
};

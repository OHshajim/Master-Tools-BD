
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const NoCredentialsMessage = () => {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6 text-center">
        <p className="mb-4">No login credentials have been added to this plan yet.</p>
        <p className="text-sm text-gray-500">
          The administrator will add login credentials soon. Please check back later.
        </p>
      </CardContent>
    </Card>
  );
};

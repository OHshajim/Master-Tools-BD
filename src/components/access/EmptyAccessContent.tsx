
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EmptyAccessContentProps } from '@/types/access';

export const EmptyAccessContent = ({ isLoading, plan, order }: EmptyAccessContentProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading access details...</p>
      </div>
    );
  }

  if (!plan || !order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You don't have access to this content.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6 text-center">
        <p className="mb-4">No access details have been added to this plan yet.</p>
        <p className="text-sm text-gray-500">
          The administrator will add access credentials soon. Please check back later.
        </p>
      </CardContent>
    </Card>
  );
};


import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AccessPageHeaderProps {
  planName: string;
}

export const AccessPageHeader = ({ planName }: AccessPageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{planName} - Access</h1>
      <p className="text-gray-600">
        Your login credentials for all included platforms
      </p>
      
      <div className="mt-8">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

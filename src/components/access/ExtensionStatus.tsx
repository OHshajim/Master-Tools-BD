
import { Card, CardContent } from '@/components/ui/card';
import { ExtensionStatusProps } from '@/types/access';

export const ExtensionStatus = ({ status }: ExtensionStatusProps) => {
  if (!status) {
    return null;
  }

  return (
    <Card className="mb-8 bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <p className="text-center font-medium text-green-700">{status}</p>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportantNotesProps } from '@/types/access';

export const ImportantNotes = ({ extensionInstalled }: ImportantNotesProps) => {
  return (
    <Card className="mt-8 bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle>Important Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          <li>Do not share these credentials or cookies with anyone else.</li>
          <li>These access details are for your personal use only.</li>
          <li>If you have trouble accessing any platform, please contact support.</li>
          <li>Credentials and cookies may be updated periodically for security reasons.</li>
          {!extensionInstalled && (
            <li className="text-blue-600 font-medium">Install our browser extension for the best experience and one-click access.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

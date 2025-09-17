
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, ExternalLink } from 'lucide-react';

const ExtensionInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code2 className="h-5 w-5" />
          <span>Extension Integration Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">API Endpoint for Cookie Upload:</h4>
          <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
            PUT https://server.mastertoolsbd.com/api/cookies/platform/{`{platformName}`}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Required Headers:</h4>
          <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm space-y-1">
            <div>Content-Type: application/json</div>
            <div>Authorization: Bearer {`{your_token_here}`}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Request Body Format:</h4>
          <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
            {`{
  "cookieData": "[{...cookie_objects...}]"
}`}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-800">How to use in your extension:</h4>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Copy the Bearer token from above</li>
            <li>Replace <Badge variant="secondary">authToken</Badge> in your background.js</li>
            <li>Update <Badge variant="secondary">platformName</Badge> to match your platform</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-yellow-800">Important Notes:</h4>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>Platform name must exactly match the name in "Manage Platforms"</li>
            <li>Token expires based on the selected duration</li>
            <li>Keep your token secure and never share it publicly</li>
            <li>Monitor token usage and regenerate if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtensionInstructions;

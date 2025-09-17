
import { Clock, Clipboard, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { Cookie, Plan } from '@/types/dataTypes';
import { formatRelativeDate } from '@/utils/formatUtils';

interface CookieListProps {
  cookies: Cookie[];
  plans: Plan[];
  onEdit: (cookie: Cookie) => void;
  onDelete: (id: string) => void;
  onTogglePinned: (cookie: Cookie) => void;
  planName?: string;
}

const CookieList = ({ cookies, plans, onEdit, onDelete, onTogglePinned, planName }: CookieListProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Cookie data copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookies</CardTitle>
        <CardDescription>
          {planName 
            ? `Cookies for selected plan: ${planName}`
            : 'All cookies across plans'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cookies.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Pin</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cookies.map(cookie => {
                  const plan = plans.find(p => p._id === cookie.planId);
                  return (
                    <TableRow key={cookie._id} className={cookie.isPinned ? "bg-gray-50" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onTogglePinned(cookie)}
                          title={cookie.isPinned ? "Unpin cookie" : "Pin cookie to top"}
                          className="hover:bg-gray-100"
                        >
                          {cookie.isPinned ? (
                            <PinOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Pin className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{cookie.platform}</TableCell>
                      <TableCell>{cookie.domain || '-'}</TableCell>
                      <TableCell>{plan?.name || 'Unknown Plan'}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{formatRelativeDate(cookie.updatedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(cookie.cookieData || '')}
                          >
                            <Clipboard className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEdit(cookie)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDelete(cookie._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No cookies found. {planName ? 'Add cookies for this plan.' : 'Add some cookies.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CookieList;

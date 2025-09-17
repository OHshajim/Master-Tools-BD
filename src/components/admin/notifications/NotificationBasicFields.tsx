
import React, { useRef, useState } from 'react';
import { NotificationPriority } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import { LinkInsertModal } from './LinkInsertModal';
import { insertLinkAtCursor } from '@/utils/linkUtils';
import { MessageRenderer } from '@/components/ui/MessageRenderer';

interface NotificationBasicFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  priority: NotificationPriority;
  setPriority: (value: NotificationPriority) => void;
  expiresIn: string;
  setExpiresIn: (value: string) => void;
  targetCount: number;
  onSubmit: () => void;
}

export const NotificationBasicFields: React.FC<NotificationBasicFieldsProps> = ({
  title,
  setTitle,
  message,
  setMessage,
  priority,
  setPriority,
  expiresIn,
  setExpiresIn,
  targetCount,
  onSubmit
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleInsertLink = (linkText: string, url: string) => {
    insertLinkAtCursor(textareaRef, linkText, url, message, setMessage);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">Message</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsLinkModalOpen(true)}
            className="flex items-center gap-1"
          >
            <Link className="h-3 w-3" />
            Add Link
          </Button>
        </div>
        <Textarea
          ref={textareaRef}
          id="message"
          placeholder="Enter your notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        {message && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Preview:</Label>
            <div className="p-2 bg-muted rounded text-sm">
              <MessageRenderer message={message} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as NotificationPriority)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expires">Expires in (days)</Label>
          <Input
            id="expires"
            type="number"
            placeholder="Days until expiration"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            min="1"
          />
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={onSubmit} 
        className="w-full"
        disabled={targetCount === 0}
      >
        Send Notification to {targetCount} Users
      </Button>

      <LinkInsertModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsertLink={handleInsertLink}
      />
    </>
  );
};

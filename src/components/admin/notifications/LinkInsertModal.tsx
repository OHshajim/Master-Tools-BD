
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';

interface LinkInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertLink: (linkText: string, url: string) => void;
}

export const LinkInsertModal: React.FC<LinkInsertModalProps> = ({
  isOpen,
  onClose,
  onInsertLink
}) => {
  const [linkText, setLinkText] = useState('');
  const [url, setUrl] = useState('');

  const handleInsert = () => {
    if (linkText.trim() && url.trim()) {
      onInsertLink(linkText.trim(), url.trim());
      setLinkText('');
      setUrl('');
      onClose();
    }
  };

  const handleClose = () => {
    setLinkText('');
    setUrl('');
    onClose();
  };

  const previewText = linkText && url ? `${linkText} (${url})` : 'Preview will appear here...';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Insert Link
          </DialogTitle>
          <DialogDescription>
            Add a clickable link to your notification message
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkText">Link Text</Label>
            <Input
              id="linkText"
              placeholder="Enter the text to display"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-3 bg-muted rounded-md text-sm">
              {linkText && url ? (
                <span>
                  আপনি এই{' '}
                  <span className="text-blue-600 underline cursor-pointer">
                    {linkText}
                  </span>{' '}
                  লিঙ্কে ক্লিক করে অফারটি ক্লাইম করুন।
                </span>
              ) : (
                <span className="text-muted-foreground">Preview will appear here...</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleInsert}
            disabled={!linkText.trim() || !url.trim()}
          >
            Insert Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

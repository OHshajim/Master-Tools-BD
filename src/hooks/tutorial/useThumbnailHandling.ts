
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { TutorialVideo } from '@/types/access';

export type RegenerateThumbnailFn = () => Promise<void>;

export const useThumbnailHandling = (
  existingVideo: TutorialVideo | undefined,
  thumbnailUrl: string,
  setThumbnailUrl: (url: string) => void
) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Initialize with existing thumbnail if available
  useEffect(() => {
    if (existingVideo?.thumbnailUrl) {
      setThumbnailUrl(existingVideo.thumbnailUrl);
    }
  }, [existingVideo, setThumbnailUrl]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      toast.success('Custom thumbnail uploaded successfully');
    }
  };

  const removeThumbnail = () => {
    if (thumbnailFile) {
      setThumbnailFile(null);
      
      // Clear the thumbnail URL and revoke the object URL to free memory
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
        setThumbnailUrl('');
      }
      
      toast.info('Thumbnail removed');
    } else if (existingVideo?.thumbnailUrl) {
      // For existing thumbnails, just clear the URL in the form
      setThumbnailUrl('');
      toast.info('Thumbnail removed');
    }
  };

  return {
    thumbnailFile,
    handleThumbnailChange,
    removeThumbnail
  };
};

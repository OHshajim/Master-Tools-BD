
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { TutorialVideo } from '@/types/access';
import { generateThumbnailFromVideo } from '@/utils/thumbnailUtils';

export const useVideoHandling = (
  existingVideo: TutorialVideo | undefined,
  setThumbnailUrl: (url: string) => void,
  thumbnailFile: File | null,
  thumbnailUrl: string
) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  
  // Initialize with existing video if available and valid
  useEffect(() => {
    if (existingVideo?.contentUrl && existingVideo.contentUrl.trim() !== '') {
      setPreviewUrl(existingVideo.contentUrl);
    }
  }, [existingVideo]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // If no thumbnail is uploaded yet, automatically generate one
      if (!thumbnailUrl && !thumbnailFile) {
        setIsGeneratingThumbnail(true);
        try {
          // Wait a moment to let the video load
          setTimeout(async () => {
            try {
              const generatedThumbnail = await generateThumbnailFromVideo(url);
              setThumbnailUrl(generatedThumbnail);
            } catch (error) {
              console.error('Error generating thumbnail:', error);
              toast.error('Failed to generate thumbnail automatically');
            } finally {
              setIsGeneratingThumbnail(false);
            }
          }, 1000);
        } catch (error) {
          console.error('Error setting up thumbnail generation:', error);
          setIsGeneratingThumbnail(false);
        }
      }
    }
  };

  const regenerateThumbnail = async () => {
    if (!previewUrl || previewUrl.trim() === '') {
      toast.error('Please upload a video first');
      return;
    }
    
    setIsGeneratingThumbnail(true);
    try {
      const generatedThumbnail = await generateThumbnailFromVideo(previewUrl);
      setThumbnailUrl(generatedThumbnail);
      toast.success('Thumbnail regenerated successfully');
    } catch (error) {
      console.error('Error regenerating thumbnail:', error);
      toast.error('Failed to regenerate thumbnail');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const removeVideo = () => {
    if (videoFile) {
      setVideoFile(null);
      
      // Clear the preview URL and revoke the object URL to free memory
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      
      // If we had an auto-generated thumbnail, remove that too
      if (thumbnailUrl && !thumbnailFile) {
        setThumbnailUrl('');
      }
      
      toast.info('Video removed. You can upload a new one.');
    } else if (existingVideo?.contentUrl) {
      // For existing videos, just clear the preview URL in the form
      // The actual video will be removed when the form is submitted
      setPreviewUrl('');
      
      // If thumbnail was generated from this video, remove it too
      if (thumbnailUrl && !thumbnailFile) {
        setThumbnailUrl('');
      }
      
      toast.info('Video removed. Upload a new one or save to confirm removal.');
    }
  };

  return {
    videoFile,
    previewUrl,
    isGeneratingThumbnail,
    handleFileChange,
    regenerateThumbnail,
    removeVideo
  };
};

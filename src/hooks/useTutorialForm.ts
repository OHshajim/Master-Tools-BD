
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TutorialVideo } from '@/types/access';
import { useFormData } from './tutorial/useFormData';
import { useVideoHandling } from './tutorial/useVideoHandling';
import { useThumbnailHandling } from './tutorial/useThumbnailHandling';

export const useTutorialForm = (type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile') => {
  const [tutorials, setTutorials] = useLocalStorage<TutorialVideo[]>('tutorialVideos', []);
  
  // Find existing tutorial video of this type
  const existingVideo = tutorials.find(video => video.type === type);
  
  // State for the video thumbnail URL
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(existingVideo?.thumbnailUrl || '');
  
  // Use the form data hook
  const { title, description, handleTitleChange, handleDescriptionChange } = 
    useFormData(type, existingVideo);
  
  // Use the thumbnail handling hook
  const { 
    thumbnailFile, 
    handleThumbnailChange, 
    removeThumbnail 
  } = useThumbnailHandling(existingVideo, thumbnailUrl, setThumbnailUrl);
  
  // Use the video hook
  const { 
    videoFile, 
    previewUrl, 
    isGeneratingThumbnail, 
    handleFileChange, 
    regenerateThumbnail, 
    removeVideo 
  } = useVideoHandling(existingVideo, setThumbnailUrl, thumbnailFile, thumbnailUrl);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if we have a valid video or thumbnail
    const hasValidVideo = videoFile || (existingVideo?.contentUrl && previewUrl);
    
    if (!hasValidVideo) {
      toast.error('Please upload a video file');
      return;
    }
    
    const contentUrl = videoFile ? previewUrl : (existingVideo?.contentUrl || '');
    
    if (!contentUrl) {
      toast.error('Please upload a valid video file');
      return;
    }
    
    // Create or update tutorial video
    const newVideo: TutorialVideo = {
      id: existingVideo?.id || `tutorial-${type}-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      contentUrl,
      thumbnailUrl: thumbnailUrl || existingVideo?.thumbnailUrl || '',
      type
    };
    
    if (existingVideo) {
      // Update existing video
      setTutorials(tutorials.map(v => v.id === existingVideo.id ? newVideo : v));
      toast.success('Tutorial video updated successfully');
    } else {
      // Add new video
      setTutorials([...tutorials, newVideo]);
      toast.success('Tutorial video added successfully');
    }
  };

  // Function to reset form
  const resetForm = () => {
    if (existingVideo) {
      // Reset to existing values
      handleTitleChange({ target: { value: existingVideo.title } } as React.ChangeEvent<HTMLInputElement>);
      handleDescriptionChange({ target: { value: existingVideo.description } } as React.ChangeEvent<HTMLTextAreaElement>);
      if (previewUrl && previewUrl !== existingVideo.contentUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (videoFile) {
        removeVideo();
      }
      if (thumbnailFile) {
        removeThumbnail();
      }
      setThumbnailUrl(existingVideo.thumbnailUrl || '');
    } else {
      // Reset to defaults
      handleTitleChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      handleDescriptionChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        removeVideo();
      }
      if (thumbnailUrl) {
        removeThumbnail();
      }
    }
    
    toast.info('Form has been reset');
  };

  return {
    title,
    description,
    videoFile,
    previewUrl,
    thumbnailFile,
    thumbnailUrl,
    existingVideo,
    isGeneratingThumbnail,
    handleTitleChange,
    handleDescriptionChange,
    handleFileChange,
    handleThumbnailChange,
    regenerateThumbnail,
    handleSubmit,
    removeVideo,
    removeThumbnail,
    resetForm
  };
};

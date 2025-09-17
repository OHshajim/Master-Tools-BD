import { toast } from '@/components/ui/sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TutorialVideo } from '@/types/access';
import { useYouTubeFormData } from './tutorial/useYouTubeFormData';
import { isValidYouTubeUrl, extractYouTubeVideoId, generateYouTubeThumbnail } from '@/utils/youtubeUtils';
import { useEffect, useState } from 'react';
import { api, secureApi } from './axios/useAxios';

export const useTutorialYouTubeForm = (type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile') => {
  const [tutorials, setTutorials] = useState([]);
  
  useEffect(() => {
      api.get("/api/tutorial")
          .then((res) => setTutorials(res.data))
          .catch((err) => toast.error("Failed to load tutorials"));
  }, []);
  // Find existing tutorial video of this type
  const existingVideo = tutorials.find(video => video.type === type);
  
  // Use the YouTube form data hook
  const { 
    title, 
    description, 
    videoUrl, 
    thumbnailUrl, 
    embedUrl,
    handleTitleChange, 
    handleDescriptionChange,
    handleVideoUrlChange
  } = useYouTubeFormData(type, existingVideo);



  // Form submission handler
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube video URL');
      return;
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      toast.error('Could not extract video ID from YouTube URL');
      return;
    }

    // Create or update tutorial video
    const newVideo: TutorialVideo = {
      _id: existingVideo?._id || `tutorial-${type}-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      contentUrl: videoUrl.trim(),
      thumbnailUrl: generateYouTubeThumbnail(videoId),
      type
    };
    try {
        // Call API to create/update tutorial
        await secureApi.post("api/tutorial", newVideo);

        // Update local state
        if (existingVideo) {
            setTutorials(
                tutorials.map((v) =>
                    v._id === existingVideo._id ? newVideo : v
                )
            );
            toast.success("Tutorial video updated successfully");
        } else {
            setTutorials([...tutorials, newVideo]);
            toast.success("Tutorial video added successfully");
        }
    } catch (err) {
        toast.error("Failed to save tutorial video");
    }
  };

  // Function to reset form
  const resetForm = async() => {
    if (existingVideo) {
      await secureApi.delete(`/api/tutorial/${existingVideo._id}`, {
          params: {
              id: existingVideo._id,
          },
      });
      // Reset to existing values
      handleTitleChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      handleDescriptionChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
      handleVideoUrlChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      // Reset to defaults
      handleTitleChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      handleDescriptionChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
      handleVideoUrlChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
    
    toast.info('Form has been reset');
  };

  return {
    title,
    description,
    videoUrl,
    thumbnailUrl,
    embedUrl,
    existingVideo,
    handleTitleChange,
    handleDescriptionChange,
    handleVideoUrlChange,
    handleSubmit,
    resetForm
  };
};

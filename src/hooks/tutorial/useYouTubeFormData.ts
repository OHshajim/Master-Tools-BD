
import { useState, useEffect } from 'react';
import { TutorialVideo } from '@/types/access';
import { extractYouTubeVideoId, generateYouTubeThumbnail, generateYouTubeEmbedUrl } from '@/utils/youtubeUtils';

export const useYouTubeFormData = (
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile', 
  existingVideo: TutorialVideo | undefined
) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Reset form with existing data if available
  useEffect(() => {
    if (existingVideo) {
      setTitle(existingVideo.title);
      setDescription(existingVideo.description);
      setVideoUrl(existingVideo.contentUrl || '');
    } else {
      // Default titles and descriptions based on type
      if (type === 'login') {
        setTitle('How to Use Login Credentials');
        setDescription('Learn how to use login credentials for various platforms');
      } else if (type === 'cookie') {
        setTitle('How to Use Cookie Credentials');
        setDescription('Watch this tutorial to learn how to use cookie credentials');
      } else if (type === 'login-mobile') {
        setTitle('Using Login Credentials on Mobile');
        setDescription('Learn how to use login credentials on your smartphone or tablet');
      } else if (type === 'cookie-mobile') {
        setTitle('Using Cookie Credentials on Mobile');
        setDescription('Watch this tutorial to learn how to use cookie credentials on your mobile device');
      }
    }
  }, [existingVideo, type]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
  };

  // Get embed URL for preview
  const getEmbedUrl = () => {
    if (videoUrl) {
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        return generateYouTubeEmbedUrl(videoId);
      }
    }
    return '';
  };

  // Get auto-generated thumbnail URL
  const getThumbnailUrl = () => {
    if (videoUrl) {
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        return generateYouTubeThumbnail(videoId);
      }
    }
    return '';
  };
  
  return {
    title,
    description,
    videoUrl,
    thumbnailUrl: getThumbnailUrl(),
    embedUrl: getEmbedUrl(),
    handleTitleChange,
    handleDescriptionChange,
    handleVideoUrlChange
  };
};

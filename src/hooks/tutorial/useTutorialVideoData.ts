
import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TutorialVideo } from '@/types/access';
import { VideoPlayerRef } from '@/components/access/VideoPlayer';
import { api } from '../axios/useAxios';
import { toast } from '../use-toast';

export const useTutorialVideoData = (contentLabel: string) => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [tutorials, setTutorials] = useState([]);

    useEffect(() => {
        api.get("/api/tutorial")
            .then((res) => setTutorials(res.data))
            .catch((err) => toast.error("Failed to load tutorials"));
    }, []);
  
  // Refs to control video players
  const desktopVideoRef = useRef<VideoPlayerRef>(null);
  const mobileVideoRef = useRef<VideoPlayerRef>(null);
  
  const videoType = contentLabel.toLowerCase().includes('login') ? 'login' : 'cookie';
  const desktopVideo = tutorials.find(video => video.type === videoType);
  const mobileVideo = tutorials.find(video => video.type === `${videoType}-mobile`);
  
  const activeVideo = activeDevice === 'desktop' ? desktopVideo : mobileVideo;
  
  const handleDeviceChange = (device: 'desktop' | 'mobile') => {
    // Pause the currently active video before switching
    if (activeDevice === 'desktop' && desktopVideoRef.current) {
      desktopVideoRef.current.pauseVideo();
    } else if (activeDevice === 'mobile' && mobileVideoRef.current) {
      mobileVideoRef.current.pauseVideo();
    }
    
    setActiveDevice(device);
  };

  return {
    activeDevice,
    desktopVideo,
    mobileVideo,
    activeVideo,
    desktopVideoRef,
    mobileVideoRef,
    handleDeviceChange
  };
};

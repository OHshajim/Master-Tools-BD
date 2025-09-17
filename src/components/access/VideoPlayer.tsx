
import { TutorialVideo } from '@/types/access';
import { Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractYouTubeVideoId, generateYouTubeEmbedUrl, isValidYouTubeUrl } from '@/utils/youtubeUtils';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface VideoPlayerProps {
  video: TutorialVideo | undefined;
  activeDevice: 'desktop' | 'mobile';
  aspectRatio?: string;
  onTabChange?: () => void;
}

export interface VideoPlayerRef {
  pauseVideo: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ video, activeDevice, aspectRatio = "aspect-video", onTabChange }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Expose pauseVideo method to parent components
    useImperativeHandle(ref, () => ({
      pauseVideo: () => {
        if (iframeRef.current) {
          // Pause YouTube video via postMessage
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
        if (videoRef.current) {
          // Pause HTML5 video
          videoRef.current.pause();
        }
      }
    }));

    // Call onTabChange when component mounts (indicating this tab is active)
    useEffect(() => {
      onTabChange?.();
    }, [onTabChange]);

    if (!video || !video.contentUrl) {
      return (
        <div className={cn(aspectRatio, "bg-gray-100 rounded-md flex items-center justify-center")}>
          <div className="text-center">
            {activeDevice === 'mobile' && <Smartphone className="h-10 w-10 text-gray-400 mx-auto mb-2" />}
            <p className="text-gray-500">
              {activeDevice === 'desktop' ? 'Desktop Tutorial Video Not Available' : 'Mobile Tutorial Not Available'}
            </p>
          </div>
        </div>
      );
    }

    const videoUrl = video.contentUrl;
    const isYouTube = isValidYouTubeUrl(videoUrl);
    const videoId = isYouTube ? extractYouTubeVideoId(videoUrl) : null;
    const embedUrl = videoId ? generateYouTubeEmbedUrl(videoId) + '?enablejsapi=1' : '';

    if (isYouTube && videoId) {
      return (
        <div className={cn(aspectRatio, "w-full max-w-full bg-gray-100 rounded-md overflow-hidden")}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    } else {
      return (
        <div className={cn(aspectRatio, "w-full max-w-full bg-gray-100 rounded-md overflow-hidden")}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full"
            poster={video.thumbnailUrl || "/placeholder.svg"}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  }
);

VideoPlayer.displayName = 'VideoPlayer';

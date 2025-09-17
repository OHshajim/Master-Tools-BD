
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TutorialVideoProps } from '@/types/access';
import { useTutorialVideoData } from '@/hooks/tutorial/useTutorialVideoData';
import { DeviceTabs } from './DeviceTabs';
import { VideoContent } from './VideoContent';

export const TutorialVideo = ({ title, description, contentLabel, videoUrl, thumbnailUrl: defaultThumbnail }: TutorialVideoProps) => {
  const {
    activeDevice,
    desktopVideo,
    mobileVideo,
    activeVideo,
    desktopVideoRef,
    mobileVideoRef,
    handleDeviceChange
  } = useTutorialVideoData(contentLabel);
  
  // Set display data based on active video or props
  const displayTitle = activeVideo?.title || title;
  const displayDescription = activeVideo?.description || description;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{displayTitle}</CardTitle>
        <CardDescription>{displayDescription}</CardDescription>
        
        <DeviceTabs 
          activeDevice={activeDevice}
          onDeviceChange={handleDeviceChange}
        />
      </CardHeader>
      <CardContent>
        <VideoContent 
          activeDevice={activeDevice}
          desktopVideo={desktopVideo}
          mobileVideo={mobileVideo}
          desktopVideoRef={desktopVideoRef}
          mobileVideoRef={mobileVideoRef}
        />
      </CardContent>
    </Card>
  );
};

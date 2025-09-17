
import { TabsContent } from '@/components/ui/tabs';
import { VideoPlayer, VideoPlayerRef } from './VideoPlayer';
import { TutorialVideo } from '@/types/access';
import { Smartphone } from 'lucide-react';
import { RefObject } from 'react';

interface VideoContentProps {
  activeDevice: 'desktop' | 'mobile';
  desktopVideo: TutorialVideo | undefined;
  mobileVideo: TutorialVideo | undefined;
  desktopVideoRef: RefObject<VideoPlayerRef>;
  mobileVideoRef: RefObject<VideoPlayerRef>;
}

export const VideoContent = ({ 
  activeDevice, 
  desktopVideo, 
  mobileVideo,
  desktopVideoRef,
  mobileVideoRef
}: VideoContentProps) => {
  return (
    <>
      <TabsContent value="desktop" forceMount={true} hidden={activeDevice !== 'desktop'}>
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="w-full">
            <VideoPlayer 
              ref={desktopVideoRef}
              video={desktopVideo} 
              activeDevice="desktop" 
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="mobile" forceMount={true} hidden={activeDevice !== 'mobile'}>
        <div className="max-w-[375px] mx-auto">
          <div className="relative">
            <Smartphone className="text-gray-300 absolute -top-6 -left-4 -z-10 h-12 w-12" />
            <div className="border-4 border-gray-300 rounded-md overflow-hidden">
              <VideoPlayer 
                ref={mobileVideoRef}
                video={mobileVideo} 
                activeDevice="mobile" 
                aspectRatio="aspect-[9/16]" 
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
};

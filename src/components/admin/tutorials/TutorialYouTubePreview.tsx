
import React from 'react';
import { Card } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { extractYouTubeVideoId, generateYouTubeEmbedUrl } from '@/utils/youtubeUtils';

interface TutorialYouTubePreviewProps {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const TutorialYouTubePreview: React.FC<TutorialYouTubePreviewProps> = ({ 
  title,
  description,
  videoUrl, 
  thumbnailUrl
}) => {
  const videoId = extractYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? generateYouTubeEmbedUrl(videoId) : '';
  const hasValidVideo = videoUrl && videoId;
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube Video Preview
        </h3>
        
        <Card className="overflow-hidden">
          {hasValidVideo ? (
            <div className="aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={title || "YouTube Video"}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <div className="text-center p-6">
                <Youtube className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No YouTube video URL provided</p>
                <p className="text-sm text-slate-400 mt-1">
                  Enter a YouTube URL from the Edit Video tab
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {hasValidVideo && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">How it will appear to users:</h3>
          <Card className="p-4">
            <h4 className="font-medium text-lg">{title || "Tutorial Title"}</h4>
            <p className="text-sm text-gray-600 mt-1">{description || "Tutorial description will appear here"}</p>
            {thumbnailUrl && (
              <div className="mt-3 aspect-video max-h-[120px] w-full overflow-hidden rounded-md border">
                <img 
                  src={thumbnailUrl} 
                  alt={title || "Thumbnail"} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    if (videoId) {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Card } from '@/components/ui/card';
import { Play, X, Video, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorialVideoPreviewProps {
  title: string;
  description: string;
  previewUrl: string;
  thumbnailUrl: string;
  isGeneratingThumbnail?: boolean;
  onRemoveVideo?: () => void;
  onRemoveThumbnail?: () => void;
}

export const TutorialVideoPreview: React.FC<TutorialVideoPreviewProps> = ({ 
  title,
  description,
  previewUrl, 
  thumbnailUrl,
  isGeneratingThumbnail = false,
  onRemoveVideo,
  onRemoveThumbnail
}) => {
  // Check if previewUrl is actually valid (not empty)
  const hasValidVideo = previewUrl && previewUrl.trim() !== '';
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Tutorial Preview
          </h3>
          {hasValidVideo && onRemoveVideo && (
            <Button variant="ghost" size="sm" onClick={onRemoveVideo} className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <X className="h-4 w-4 mr-1" />
              Remove Video
            </Button>
          )}
        </div>
        
        <Card className="overflow-hidden">
          {hasValidVideo ? (
            <div className="aspect-video bg-black">
              <video 
                src={previewUrl} 
                controls 
                className="w-full h-full object-contain"
                poster={thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <div className="text-center p-6">
                <Play className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No video uploaded yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Upload a video from the Edit Video tab
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Only show thumbnail section if we have a valid video */}
      {hasValidVideo && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Image className="h-5 w-5" />
              Thumbnail Preview
            </h3>
            {thumbnailUrl && onRemoveThumbnail && (
              <Button variant="ghost" size="sm" onClick={onRemoveThumbnail} className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <X className="h-4 w-4 mr-1" />
                Remove Thumbnail
              </Button>
            )}
          </div>
          
          <Card className="overflow-hidden">
            {isGeneratingThumbnail ? (
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-slate-500 font-medium">Generating thumbnail...</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Please wait a moment
                  </p>
                </div>
              </div>
            ) : thumbnailUrl ? (
              <div className="aspect-video bg-slate-100">
                <img 
                  src={thumbnailUrl} 
                  alt={title || "Video thumbnail"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <Image className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No thumbnail yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Upload a custom thumbnail or auto-generate one
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
      
      {hasValidVideo && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">How it will appear to users:</h3>
          <Card className="p-4">
            <h4 className="font-medium text-lg">{title || "Tutorial Title"}</h4>
            <p className="text-sm text-gray-600 mt-1">{description || "Tutorial description will appear here"}</p>
            {thumbnailUrl && (
              <div className="mt-3 aspect-video max-h-[120px] w-full overflow-hidden rounded-md border">
                <img src={thumbnailUrl} alt={title || "Thumbnail"} className="h-full w-full object-cover" />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Label } from '@/components/ui/label';
import { Play, X } from 'lucide-react';

interface TutorialPreviewsProps {
  thumbnailUrl: string | null;
  previewUrl: string | null;
  isGeneratingThumbnail?: boolean;
  onRemoveVideo?: () => void;
  onRemoveThumbnail?: () => void;
}

const TutorialPreviews: React.FC<TutorialPreviewsProps> = ({ 
  thumbnailUrl, 
  previewUrl,
  isGeneratingThumbnail = false,
  onRemoveVideo,
  onRemoveThumbnail
}) => {
  // Check if previewUrl is actually valid (not empty)
  const hasValidVideo = previewUrl && previewUrl.trim() !== '';
  
  return (
    <>
      {hasValidVideo ? (
        <div className="space-y-2">
          <Label>Video Preview</Label>
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
            <video 
              src={previewUrl} 
              controls 
              className="w-full h-full object-contain"
            />
            {onRemoveVideo && (
              <button 
                onClick={onRemoveVideo}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                aria-label="Remove video"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Video Preview</Label>
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <Play className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No video uploaded yet</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Only show thumbnail section if we have a valid video */}
      {hasValidVideo && (
        <div className="space-y-2">
          <Label>Thumbnail Preview</Label>
          {isGeneratingThumbnail ? (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Generating thumbnail...</p>
              </div>
            </div>
          ) : thumbnailUrl ? (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
              <img 
                src={thumbnailUrl} 
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              {onRemoveThumbnail && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveThumbnail();
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                  aria-label="Remove thumbnail"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <Play className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No thumbnail uploaded yet</p>
                <p className="text-xs text-gray-400">One will be generated from the video</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TutorialPreviews;

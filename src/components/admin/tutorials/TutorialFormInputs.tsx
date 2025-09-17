
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, Image } from 'lucide-react';

interface TutorialFormInputsProps {
  title: string;
  description: string;
  videoFile: File | null;
  thumbnailFile: File | null;
  existingVideo: boolean;
  existingVideoName?: string;
  existingThumbnailName?: string;
  type: 'login' | 'cookie';
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRegenerateThumbnail?: () => void;
}

const TutorialFormInputs: React.FC<TutorialFormInputsProps> = ({
  title,
  description,
  videoFile,
  thumbnailFile,
  existingVideo,
  existingVideoName,
  existingThumbnailName,
  type,
  onTitleChange,
  onDescriptionChange,
  onVideoChange,
  onThumbnailChange,
  onRegenerateThumbnail
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${type}-title`}>Title</Label>
        <Input 
          id={`${type}-title`}
          value={title}
          onChange={onTitleChange}
          placeholder="Enter tutorial title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}-description`}>Description</Label>
        <Textarea 
          id={`${type}-description`}
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter tutorial description"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}-video`}>Tutorial Video</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`${type}-video`)?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {existingVideo ? 'Change Video' : 'Upload Video'}
          </Button>
          <Input
            id={`${type}-video`}
            type="file"
            accept="video/*"
            onChange={onVideoChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500">
            {videoFile ? videoFile.name : existingVideoName ? existingVideoName : 'No video selected'}
          </span>
          <p className="w-full mt-1 text-xs text-gray-400">
            Upload an MP4 video to display as tutorial. The thumbnail will be automatically generated from the video.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}-thumbnail`}>Video Thumbnail (Optional)</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`${type}-thumbnail`)?.click()}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            {existingThumbnailName ? 'Change Thumbnail' : 'Upload Custom Thumbnail'}
          </Button>
          
          {onRegenerateThumbnail && (
            <Button
              type="button"
              variant="outline"
              onClick={onRegenerateThumbnail}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Regenerate From Video
            </Button>
          )}
          
          <Input
            id={`${type}-thumbnail`}
            type="file"
            accept="image/*"
            onChange={onThumbnailChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500">
            {thumbnailFile ? thumbnailFile.name : existingThumbnailName ? existingThumbnailName : 'No custom thumbnail selected'}
          </span>
          <p className="w-full mt-1 text-xs text-gray-400">
            You can upload a custom thumbnail or let the system automatically generate one from the video.
          </p>
        </div>
      </div>
    </>
  );
};

export default TutorialFormInputs;

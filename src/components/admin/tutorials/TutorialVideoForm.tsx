import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TutorialVideoFormProps {
  title: string;
  description: string;
  videoFile: File | null;
  thumbnailFile: File | null;
  existingVideo: any;
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRegenerateThumbnail: () => void;
}

export const TutorialVideoForm: React.FC<TutorialVideoFormProps> = ({
  title,
  description,
  videoFile,
  thumbnailFile,
  existingVideo,
  type,
  onTitleChange,
  onDescriptionChange,
  onVideoChange,
  onThumbnailChange,
  onRegenerateThumbnail
}) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={onTitleChange}
          placeholder="Enter tutorial title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter tutorial description"
        />
      </div>
      
      <div>
        <Label htmlFor="video">Video File</Label>
        <Input
          type="file"
          id="video"
          accept="video/*"
          onChange={onVideoChange}
        />
        {existingVideo?.contentUrl && !videoFile && (
          <p className="text-sm text-muted-foreground mt-1">
            Currently: {existingVideo.contentUrl}
          </p>
        )}
      </div>
      
      <div>
        <Label htmlFor="thumbnail">Thumbnail File</Label>
        <Input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={onThumbnailChange}
        />
        {existingVideo?.thumbnailUrl && !thumbnailFile && (
          <p className="text-sm text-muted-foreground mt-1">
            Currently: {existingVideo.thumbnailUrl}
          </p>
        )}
      </div>
      
      {videoFile && (
        <div className="flex items-center space-x-2">
          <Button type="button" variant="secondary" onClick={onRegenerateThumbnail} disabled={!videoFile}>
            Regenerate Thumbnail
            {/* {isGeneratingThumbnail && <Loader2 className="ml-2 h-4 w-4 animate-spin" />} */}
          </Button>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Youtube } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { isValidYouTubeUrl } from '@/utils/youtubeUtils';

interface TutorialYouTubeFormProps {
  title: string;
  description: string;
  videoUrl: string;
  existingVideo: any;
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVideoUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TutorialYouTubeForm: React.FC<TutorialYouTubeFormProps> = ({
  title,
  description,
  videoUrl,
  existingVideo,
  type,
  onTitleChange,
  onDescriptionChange,
  onVideoUrlChange
}) => {
  const [urlError, setUrlError] = useState('');

  // Validate YouTube URL on change
  useEffect(() => {
    if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
      setUrlError('Please enter a valid YouTube URL (including YouTube Shorts)');
    } else {
      setUrlError('');
    }
  }, [videoUrl]);

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
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter tutorial description"
          rows={3}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="videoUrl">YouTube Video URL</Label>
        <div className="space-y-2">
          <Input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={onVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or https://youtube.com/shorts/..."
            className={`mt-1 ${urlError ? 'border-red-500' : ''}`}
          />
          {urlError && (
            <p className="text-sm text-red-600">{urlError}</p>
          )}
          {existingVideo?.contentUrl && !videoUrl && (
            <p className="text-sm text-muted-foreground">
              Current: {existingVideo.contentUrl}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Supports regular YouTube videos, YouTube Shorts, and youtu.be links
          </p>
        </div>
      </div>

      {videoUrl && isValidYouTubeUrl(videoUrl) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 text-green-700">
            <Youtube className="h-4 w-4" />
            <span className="text-sm font-medium">Valid YouTube URL detected</span>
          </div>
        </div>
      )}
    </div>
  );
};

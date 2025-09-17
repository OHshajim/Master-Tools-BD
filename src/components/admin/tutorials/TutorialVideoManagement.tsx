
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTutorialYouTubeForm } from '@/hooks/useTutorialYouTubeForm';
import { TutorialYouTubeForm } from './TutorialYouTubeForm';
import { TutorialYouTubePreview } from './TutorialYouTubePreview';

interface TutorialVideoManagementProps {
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
}

const TutorialVideoManagement: React.FC<TutorialVideoManagementProps> = ({ type }) => {
  const {
    title,
    description,
    videoUrl,
    thumbnailUrl,
    embedUrl,
    existingVideo,
    handleTitleChange,
    handleDescriptionChange,
    handleVideoUrlChange,
    handleSubmit,
    resetForm
  } = useTutorialYouTubeForm(type);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="form">Edit Video</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TutorialYouTubeForm
                title={title}
                description={description}
                videoUrl={videoUrl}
                existingVideo={existingVideo}
                type={type}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onVideoUrlChange={handleVideoUrlChange}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <Button type="submit" className="flex-1">
                  {existingVideo ? 'Save Changes' : 'Create Tutorial'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 sm:flex-none">
                  Reset Form
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview">
            <TutorialYouTubePreview
              title={title}
              description={description}
              videoUrl={videoUrl}
              thumbnailUrl={thumbnailUrl}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TutorialVideoManagement;

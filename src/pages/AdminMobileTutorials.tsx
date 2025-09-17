
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TutorialVideoManagement from '@/components/admin/tutorials/TutorialVideoManagement';
import { Smartphone } from 'lucide-react';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminMobileTutorials = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Smartphone className="h-7 w-7" />
          Mobile Tutorial Videos
        </h1>
        <p className="text-slate-600 mt-2">
          Create and manage tutorial videos for users to learn how to use credentials on mobile devices
        </p>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="login" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Smartphone className="h-4 w-4 mr-2" />
            Login Mobile Tutorials
          </TabsTrigger>
          <TabsTrigger value="cookie" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Smartphone className="h-4 w-4 mr-2" />
            Cookie Mobile Tutorials
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <TutorialVideoManagement type="login-mobile" />
        </TabsContent>
        
        <TabsContent value="cookie">
          <TutorialVideoManagement type="cookie-mobile" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMobileTutorials;

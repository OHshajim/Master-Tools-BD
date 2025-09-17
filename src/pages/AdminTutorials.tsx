import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TutorialVideoManagement from '@/components/admin/tutorials/TutorialVideoManagement';
import { Book } from 'lucide-react';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminTutorials = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Book className="h-7 w-7" />
          Tutorial Videos
        </h1>
        <p className="text-slate-600 mt-2">
          Create and manage tutorial videos for users to learn how to use different credentials
        </p>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="login" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Book className="h-4 w-4 mr-2" />
            Login Tutorials
          </TabsTrigger>
          <TabsTrigger value="cookie" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Book className="h-4 w-4 mr-2" />
            Cookie Tutorials
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <TutorialVideoManagement type="login" />
        </TabsContent>
        
        <TabsContent value="cookie">
          <TutorialVideoManagement type="cookie" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTutorials;

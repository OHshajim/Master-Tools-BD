
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface PlanManagementSidebarProps {
  planId: string;
  planSlug?: string;
  navigate: (path: string) => void;
}

const PlanManagementSidebar: React.FC<PlanManagementSidebarProps> = ({ planId, planSlug, navigate }) => {
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plan Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/admin/coupons/plan/${planId}`)}
          >
            Manage Coupons
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/admin/credentials/${planId}`)}
          >
            Manage Credentials
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/admin/cookies/${planId}`)}
          >
            Manage Cookies
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/admin/tutorials`)}
          >
            <Video className="w-4 h-4 mr-2" />
            Manage Tutorials
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/plans/${planSlug}`)}
          >
            View Public Page
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p className="mb-4">
            Plan setup best practices:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use clear, descriptive names</li>
            <li>List key benefits in the description</li>
            <li>Include popular platforms</li>
            <li>Mark your best value plan as "Popular"</li>
            <li>Feature new or promotional plans</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default PlanManagementSidebar;

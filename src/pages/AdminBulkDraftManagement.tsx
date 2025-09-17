import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/hooks/useDataContext';
import { BulkDraftCredentialTable } from '@/components/admin/draft-bulk/BulkDraftCredentialTable';
import { BulkDraftCookieTable } from '@/components/admin/draft-bulk/BulkDraftCookieTable';
import { Search, EyeOff, Users, RefreshCw } from 'lucide-react';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminBulkDraftManagement = () => {
  const { draftPlatforms, plans, platforms, getAllUserSpecificCredentials, getAllUserSpecificCookies } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('credentials');

  // Helper function to check if platform matches search term
  const platformMatchesSearch = (platformId: string, searchTerm: string) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Try to find platform by ID first
    const platformById = platforms.find(p => p._id === platformId);
    if (platformById?.name?.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    
    // If not found by ID, try to find by name (for legacy records)
    const platformByName = platforms.find(p => p.name === platformId);
    if (platformByName?.name?.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    
    // Also check if platformId itself contains the search term (direct match)
    if (platformId?.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    
    return false;
  };
  // Filter draft platforms based on search term
  const filteredDraftCredentials = draftPlatforms.filter(
      (draft) =>
          draft.isDrafted &&
          (draft.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              plans
                  .find((p) => p._id === draft.planId)
                  ?.name?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
              platformMatchesSearch(draft.platformId, searchTerm))
  );

  const filteredDraftCookies = draftPlatforms.filter(
      (draft) =>
          !draft.isDrafted 
      // &&
      //     (draft.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //         plans
      //             .find((p) => p._id === draft.planId)
      //             ?.name?.toLowerCase()
      //             .includes(searchTerm.toLowerCase()) ||
      //         platformMatchesSearch(draft.platformId, searchTerm))
  );
  console.log(filteredDraftCookies,filteredDraftCookies);
  

  // Get plan name by ID
  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p._id === planId);
    return plan?.name || 'Unknown Plan';
  };

  // Get platform name by ID or name
  const getPlatformName = (platformId: string) => {
    // First try to find by ID
    let platform = platforms.find(p => p._id === platformId);
    
    // If not found, try to find by name (for legacy draft records)
    if (!platform) {
      platform = platforms.find(p => p.name === platformId);
    }
    
    return platform?.name || 'Unknown Platform';
  };

  // Count statistics
  const totalDraftUsers = new Set([
    ...filteredDraftCredentials.map(d => d.userId),
    ...filteredDraftCookies.map(d => d.userId)
  ]).size;

  const totalDraftCredentials = filteredDraftCredentials.length;
  const totalDraftCookies = filteredDraftCookies.length;
  const totalDraftPlatforms = totalDraftCredentials + totalDraftCookies;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bulk Draft Platform Management</h1>
            <p className="text-gray-600">Manage all drafted platforms in one place</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <BackToAdminButton />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Affected Users</p>
                  <p className="text-2xl font-bold">{totalDraftUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Draft Credentials</p>
                  <p className="text-2xl font-bold">{totalDraftCredentials}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Draft Cookies</p>
                  <p className="text-2xl font-bold">{totalDraftCookies}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Draft Platforms</p>
                  <p className="text-2xl font-bold">{totalDraftPlatforms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by user ID, plan name, or platform name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Platform Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials" className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                Draft Credentials
                <Badge variant="secondary">{filteredDraftCredentials.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cookies" className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                Draft Cookies
                <Badge variant="secondary">{filteredDraftCookies.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="mt-6">
              <BulkDraftCredentialTable 
                draftPlatforms={filteredDraftCredentials}
                getPlanName={getPlanName}
                getPlatformName={getPlatformName}
              />
            </TabsContent>
            
            <TabsContent value="cookies" className="mt-6">
              <BulkDraftCookieTable 
                draftPlatforms={filteredDraftCookies}
                getPlanName={getPlanName}
                getPlatformName={getPlatformName}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkDraftManagement;
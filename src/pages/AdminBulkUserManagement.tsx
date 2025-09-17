import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/hooks/useDataContext';
import { BulkUserCredentialTable } from '@/components/admin/bulk-user/BulkUserCredentialTable';
import { BulkUserCookieTable } from '@/components/admin/bulk-user/BulkUserCookieTable';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import { Search, Database, Users, RefreshCw } from 'lucide-react';

const AdminBulkUserManagement = () => {
    const {
        plans,
        credentials: allCredentials,
        cookies: allCookies,
    } = useDataContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("credentials");

    // Filter credentials that have a userId and match search term
    const filteredCredentials = allCredentials.filter(
        (cred) =>
            cred.userId && // ensure userId exists
            (cred.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cred.platform
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                cred.username?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter cookies that have a userId and match search term
    const filteredCookies = allCookies.filter(
        (cookie) =>
            cookie.userId && // ensure userId exists
            (cookie.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cookie.platform
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                cookie.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Get plan name by ID
    const getPlanName = (planId: string) => {
        const plan = plans.find((p) => p._id === planId);
        return plan?.name || "Unknown Plan";
    };

    // Count statistics
    const totalUsers = new Set([
        ...allCredentials.map((c) => c.userId).filter(Boolean),
        ...allCookies.map((c) => c.userId).filter(Boolean),
    ]).size;

    const totalCredentials = allCredentials.length;
    const totalCookies = allCookies.length;

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Bulk User Platform Management
                        </h1>
                        <p className="text-gray-600">
                            Manage all user-specific credentials and cookies in
                            one place
                        </p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Users
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalUsers}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Credentials
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalCredentials}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Cookies
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalCookies}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Platforms
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalCredentials + totalCookies}
                                    </p>
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
                                placeholder="Search by user ID, platform, or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <BackToAdminButton />

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle>User Platform Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="credentials"
                                className="flex items-center gap-2"
                            >
                                <Database className="h-4 w-4" />
                                Credentials
                                <Badge variant="secondary">
                                    {filteredCredentials.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger
                                value="cookies"
                                className="flex items-center gap-2"
                            >
                                <Database className="h-4 w-4" />
                                Cookies
                                <Badge variant="secondary">
                                    {filteredCookies.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="credentials" className="mt-6">
                            <BulkUserCredentialTable
                                credentials={filteredCredentials}
                                getPlanName={getPlanName}
                            />
                        </TabsContent>

                        <TabsContent value="cookies" className="mt-6">
                            <BulkUserCookieTable
                                cookies={filteredCookies}
                                getPlanName={getPlanName}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminBulkUserManagement;


import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, CreditCard, Cookie, Tag, User, Video, Bell, BookOpen, Smartphone, FileText, BarChart3, Key, Archive, Settings, Link2, UserCog, Database, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const QuickActions = () => {
  const { isAdmin, isManager, isSupport } = useAuth();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/plans/new">
              <Package className="h-5 w-5 mb-2" />
              <span>Create New Plan</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/plans">
              <BookOpen className="h-5 w-5 mb-2" />
              <span>Manage Plans</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/platforms">
              <Users className="h-5 w-5 mb-2" />
              <span>Manage Platforms</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/credentials">
              <CreditCard className="h-5 w-5 mb-2" />
              <span>Manage Credentials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/cookies">
              <Cookie className="h-5 w-5 mb-2" />
              <span>Manage Cookies</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/coupons">
              <Tag className="h-5 w-5 mb-2" />
              <span>Manage Coupons</span>
            </Link>
          </Button>
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/users">
                <User className="h-5 w-5 mb-2" />
                <span>Manage Users</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager || isSupport) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/orders">
                <FileText className="h-5 w-5 mb-2" />
                <span>All Orders</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/single-user-credentials">
                <UserCog className="h-5 w-5 mb-2" />
                <span>Single User Credentials</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/single-user-cookies">
                <UserCog className="h-5 w-5 mb-2" />
                <span>Single User Cookies</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/draft-credentials-platform">
                <EyeOff className="h-5 w-5 mb-2" />
                <span>Draft Credential Platforms</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/draft-cookies-platform">
                <EyeOff className="h-5 w-5 mb-2" />
                <span>Draft Cookie Platforms</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/bulk-user-management">
                <Database className="h-5 w-5 mb-2" />
                <span>Bulk User Management</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/bulk-draft-management">
                <EyeOff className="h-5 w-5 mb-2" />
                <span>Bulk Draft Management</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/coupon-sales-report">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span>Coupon Sales Report</span>
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/tutorials">
              <Video className="h-5 w-5 mb-2" />
              <span>Manage Tutorials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/mobile-tutorials">
              <Smartphone className="h-5 w-5 mb-2" />
              <span>Manage Mobile Tutorials</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/notifications">
              <Bell className="h-5 w-5 mb-2" />
              <span>Notifications</span>
            </Link>
          </Button>
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/tokens">
                <Key className="h-5 w-5 mb-2" />
                <span>Manage API Tokens</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/deleted-plans-archive">
                <Archive className="h-5 w-5 mb-2" />
                <span>Deleted Plans Archive</span>
              </Link>
            </Button>
          )}
          
          {/* {isAdmin && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/brand-identity">
                <Settings className="h-5 w-5 mb-2" />
                <span>Brand Identity</span>
              </Link>
            </Button>
          )} */}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/quick-links">
                <Link2 className="h-5 w-5 mb-2" />
                <span>Manage Quick Links</span>
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/admin/copy-button-visibility">
                <Eye className="h-5 w-5 mb-2" />
                <span>Copy Button Visibility</span>
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

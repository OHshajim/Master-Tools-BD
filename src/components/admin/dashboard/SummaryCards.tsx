
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, CreditCard, User } from 'lucide-react';

interface SummaryCardsProps {
  plansCount: number;
  platformsCount: number;
  ordersCount: number;
  totalUsers: number;
  blockedUsers: number;
}

export const SummaryCards = ({
  plansCount,
  platformsCount,
  ordersCount,
  totalUsers,
  blockedUsers
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-md mr-4">
              <Package className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Plans</p>
              <p className="text-2xl font-bold">{plansCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-md mr-4">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Platforms</p>
              <p className="text-2xl font-bold">{platformsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-md mr-4">
              <CreditCard className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{ordersCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-md mr-4">
              <User className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
              {blockedUsers > 0 && (
                <p className="text-xs text-red-600 mt-1">{blockedUsers} blocked</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

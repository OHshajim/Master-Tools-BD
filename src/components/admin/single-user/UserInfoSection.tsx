
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShoppingBag } from 'lucide-react';
import UserOrdersList from '@/components/admin/single-user/UserOrdersList';
import { User as UserType } from '@/types/auth';
import { Order, Plan } from '@/types/dataTypes';

interface UserInfoSectionProps {
  user: UserType;
  orders: Order[];
  plans: Plan[];
  selectedPlanId: string;
  onPlanSelect: (planId: string) => void;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  user,
  orders,
  plans,
  selectedPlanId,
  onPlanSelect
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              user.blocked 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user.blocked ? 'Blocked' : 'Active'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Purchased Plans</h3>
        </div>
        
        <UserOrdersList
          orders={orders}
          plans={plans}
          selectedPlanId={selectedPlanId}
          onPlanSelect={onPlanSelect}
        />
      </CardContent>
    </Card>
  );
};

export default UserInfoSection;

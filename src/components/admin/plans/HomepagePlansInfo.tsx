
import React from 'react';
import { Home } from 'lucide-react';

interface HomepagePlansInfoProps {
  homepagePlansCount: number;
}

const HomepagePlansInfo: React.FC<HomepagePlansInfoProps> = ({ homepagePlansCount }) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start gap-3">
          <Home className="text-blue-500 mt-1" />
          <div>
            <h2 className="font-medium text-blue-700">Homepage Plans</h2>
            <p className="text-sm text-blue-600">
              Select plans to display on the homepage. Currently showing: {homepagePlansCount} plan{homepagePlansCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepagePlansInfo;

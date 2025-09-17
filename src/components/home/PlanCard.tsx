
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlanCardProps {
  plan: any;
  platformNames: string[];
  formatDuration: (plan) => string;
}

const PlanCard = ({ plan, platformNames, formatDuration }: PlanCardProps) => {
  return (
    <Card className="card-hover">
      {plan.stickerText && (
        <div 
          className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg" 
          style={{ backgroundColor: plan.stickerColor || '#8B5CF6' }}
        >
          {plan.stickerText}
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-3xl font-bold">${plan.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{formatDuration(plan)}</p>
        </div>
        
        <div className="space-y-2">
          {platformNames.map((platform, i) => (
            <div key={i} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm">{platform}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/plans/${plan.slug}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBrandContext } from '@/hooks/useBrandContext';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const { user } = useAuth();
  const { brandInfo } = useBrandContext();

  return (
    <section className="py-16 bg-brand-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/80">
          Join thousands of learners who have accelerated their careers with {brandInfo.platformName}'s subscription plans.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/plans">
            <Button size="lg" variant="secondary">Browse Plans</Button>
          </Link>
          {!user && (
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-600">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

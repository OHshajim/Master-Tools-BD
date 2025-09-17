import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative">
      <div className="hero-gradient w-full py-16 md:py-24">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center leading-tight mb-4">
            Unlock Premium Digital Education
          </h1>
          <p className="text-white/90 text-lg md:text-xl text-center max-w-2xl mb-8">
            Get access to top learning platforms like Coursera, Udemy, and more with our custom subscription plans.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/plans">
              <Button size="lg" variant="secondary">Browse Plans</Button>
            </Link>
            {!user && (
              <Link to="/signup">
                <Button size="lg">Sign Up Now</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-white rounded-t-3xl -mt-8 pt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-brand-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Plan</h3>
              <p className="text-gray-600">
                Browse our selection of custom education plans tailored for different learning needs.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-brand-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Purchase</h3>
              <p className="text-gray-600">
                Enter your payment details and any available coupon code to complete your purchase.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-brand-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Content</h3>
              <p className="text-gray-600">
                Once approved, access login credentials for all platforms included in your plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

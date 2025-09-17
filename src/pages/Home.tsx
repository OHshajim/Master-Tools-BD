
import HeroSection from '@/components/home/HeroSection';
import FeaturedPlans from '@/components/home/FeaturedPlans';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';
import SponsorsSection from '@/components/home/SponsorsSection';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <SponsorsSection/>
      <FeaturedPlans />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;

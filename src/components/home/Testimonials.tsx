
import React from 'react';
import { useBrandContext } from '@/hooks/useBrandContext';
import TestimonialCard from './TestimonialCard';
import { testimonialsData } from '@/data/testimonialsData';

const Testimonials = () => {
  const { brandInfo } = useBrandContext();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          What Our Customers Say
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Don't just take our word for it. Here's what our subscribers have to say about {brandInfo.platformName}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content.replace('{brandInfo.platformName}', brandInfo.platformName)}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

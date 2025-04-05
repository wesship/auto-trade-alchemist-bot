
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Hedge Fund Manager",
    content: "The predictive algorithms have given us a significant edge in the market. Our returns have increased by 28% since implementation.",
    avatar: "AT"
  },
  {
    name: "Sarah Chen",
    role: "Day Trader",
    content: "The risk management features alone are worth the investment. I've been able to minimize losses while maximizing gains.",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Financial Analyst",
    content: "The accuracy of the market predictions continues to impress me. This platform is revolutionizing how we approach algorithmic trading.",
    avatar: "MR"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        
        <div className="relative mx-auto max-w-3xl px-8">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="bg-card p-6 rounded-lg border text-center transition-all duration-300 hover:shadow-md">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <p className="mb-4 italic text-card-foreground">{testimonial.content}</p>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

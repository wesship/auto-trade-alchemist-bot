
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-12 bg-accent/5">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">Get the latest trading insights and platform updates</p>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Input type="email" placeholder="Enter your email" className="w-full transition-all duration-300 focus:border-primary" />
          </div>
          <Button className="gap-2 transition-all duration-300 hover:scale-105">
            <Mail className="h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;

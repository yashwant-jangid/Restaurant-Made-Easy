
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid md:grid-cols-2">
        <div className="flex items-center justify-center p-8 md:p-16">
          <div className="max-w-lg animate-slide-up">
            <div className="mb-4">
              <span className="chip">No More Waiting</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Order food from your table, <span className="text-primary">seamlessly</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Restaurant Made Easy brings the future of dining to your table. Skip the queues and order directly from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button size="lg" className="w-full sm:w-auto">
                  View Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/status">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Track Your Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center justify-center p-8 bg-muted/30 overflow-hidden">
          <div className="relative w-full max-w-md aspect-[4/5] animate-fade-in">
            <div className="absolute inset-0 rounded-2xl overflow-hidden transform rotate-2 shadow-xl bg-card z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&h=1200&fit=crop" 
                alt="Delicious food" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h2 className="text-white text-xl font-medium">Discover Our Menu</h2>
                <p className="text-white/80 text-sm mt-1">Fresh ingredients, prepared with care</p>
              </div>
            </div>
            <div className="absolute top-1/3 -right-12 rounded-xl overflow-hidden transform -rotate-3 shadow-lg h-40 w-56 z-20">
              <img 
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" 
                alt="Using app to order" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-10 rounded-xl overflow-hidden transform rotate-6 shadow-lg h-44 w-60 z-0">
              <img 
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop" 
                alt="Table dining" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/50 py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-medium mb-4">How it works</h2>
            <p className="text-muted-foreground">
              Restaurant Made Easy simplifies your dining experience with our innovative ordering system
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Browse The Menu</h3>
              <p className="text-muted-foreground">
                View our full menu with detailed descriptions and images of each dish
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Place Your Order</h3>
              <p className="text-muted-foreground">
                Add items to your cart, specify your table number, and complete your payment
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Enjoy Your Meal</h3>
              <p className="text-muted-foreground">
                Track your order status and receive a notification when it's ready
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/menu">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

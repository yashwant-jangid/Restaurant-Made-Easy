
import React, { useEffect, useState } from 'react';
import { Check, Clock, ChefHat, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface OrderStatusProps {
  orderId?: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId = "1234" }) => {
  const [status, setStatus] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');
  const [progress, setProgress] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate order progression
    const timer = setTimeout(() => {
      if (status === 'pending') {
        setStatus('preparing');
        setProgress(40);
        setTimeRemaining(10);
      } else if (status === 'preparing') {
        setStatus('ready');
        setProgress(100);
        setTimeRemaining(0);
      }
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [status]);
  
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        if (status === 'pending') {
          setProgress(prev => Math.min(40, prev + 2));
        } else if (status === 'preparing') {
          setProgress(prev => Math.min(100, prev + 6));
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, status]);
  
  const handleComplete = () => {
    setStatus('completed');
    setTimeout(() => {
      navigate('/menu');
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">Order #{orderId}</h2>
        <p className="text-muted-foreground">
          Thanks for your order! We'll let you know when it's ready.
        </p>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
        <div className="relative">
          <Progress value={progress} className="h-2 mb-8" />
          
          <div className="flex justify-between absolute w-full -top-3">
            <div className={`flex flex-col items-center ${status !== 'pending' ? 'text-primary' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status !== 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Check className="h-3 w-3" />
              </div>
              <span className="text-xs mt-1">Received</span>
            </div>
            
            <div className={`flex flex-col items-center ${status === 'preparing' || status === 'ready' || status === 'completed' ? 'text-primary' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'preparing' || status === 'ready' || status === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <ChefHat className="h-3 w-3" />
              </div>
              <span className="text-xs mt-1">Preparing</span>
            </div>
            
            <div className={`flex flex-col items-center ${status === 'ready' || status === 'completed' ? 'text-primary' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'ready' || status === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Bell className="h-3 w-3" />
              </div>
              <span className="text-xs mt-1">Ready</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-lg font-medium">
            <Clock className="h-5 w-5 text-muted-foreground" />
            {status === 'ready' ? (
              <span className="text-primary">Your order is ready!</span>
            ) : status === 'completed' ? (
              <span>Enjoy your meal!</span>
            ) : (
              <>
                <span>Estimated time: </span>
                <span>{timeRemaining} minutes</span>
              </>
            )}
          </div>
          
          <div className="mt-6">
            {status === 'ready' && (
              <Button onClick={handleComplete} size="lg" className="w-full">
                Order Received
              </Button>
            )}
            {status === 'completed' && (
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm">Thank you for dining with us!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Have a question about your order?</p>
        <p>Ask our staff for assistance</p>
      </div>
    </div>
  );
};

export default OrderStatus;


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
  const [kitchenLoad, setKitchenLoad] = useState('medium'); // 'low', 'medium', 'high'
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate order progression with more realistic timing
    // In a real app, this would be based on actual kitchen status and order complexity
    const simulateKitchenStatus = () => {
      // Randomly determine current kitchen load
      const loads = ['low', 'medium', 'high'];
      const randomLoad = loads[Math.floor(Math.random() * loads.length)];
      setKitchenLoad(randomLoad);
      
      // Adjust preparation times based on kitchen load
      let pendingTime = 8000; // base time in ms
      let preparingTime = 12000; // base time in ms
      
      if (randomLoad === 'high') {
        pendingTime = 12000;
        preparingTime = 20000;
        setTimeRemaining(prev => Math.min(25, prev + 5));
      } else if (randomLoad === 'low') {
        pendingTime = 6000;
        preparingTime = 9000;
        setTimeRemaining(prev => Math.max(10, prev - 3));
      }
      
      const timer = setTimeout(() => {
        if (status === 'pending') {
          setStatus('preparing');
          setProgress(40);
          setTimeRemaining(prev => Math.max(5, prev - 5));
        } else if (status === 'preparing') {
          setStatus('ready');
          setProgress(100);
          setTimeRemaining(0);
        }
      }, status === 'pending' ? pendingTime : preparingTime);
      
      return () => clearTimeout(timer);
    };
    
    return simulateKitchenStatus();
  }, [status]);
  
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        
        // Progress updates more smoothly based on status and time remaining
        if (status === 'pending') {
          // Move from 10% to 40% during pending status
          const targetProgress = 40;
          const currentSegmentProgress = ((10 - timeRemaining) / 10) * (targetProgress - 10);
          setProgress(10 + currentSegmentProgress);
        } else if (status === 'preparing') {
          // Move from 40% to 100% during preparing status
          const targetProgress = 100;
          const currentSegmentProgress = ((timeRemaining > 0 ? 10 - timeRemaining : 10) / 10) * (targetProgress - 40);
          setProgress(40 + currentSegmentProgress);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, status]);
  
  const handleComplete = () => {
    setStatus('completed');
    setTimeout(() => {
      navigate('/feedback');
    }, 2000);
  };
  
  const getKitchenLoadMessage = () => {
    switch (kitchenLoad) {
      case 'high': return "Our kitchen is very busy right now. Thanks for your patience!";
      case 'low': return "Our kitchen is not busy. Your order will be ready soon!";
      default: return "Our kitchen is processing orders at a normal pace.";
    }
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
          
          <div className="mt-3 text-sm text-muted-foreground">
            {status !== 'ready' && status !== 'completed' && getKitchenLoadMessage()}
          </div>
          
          <div className="mt-6">
            {status === 'ready' && (
              <Button onClick={handleComplete} size="lg" className="w-full">
                Order Received
              </Button>
            )}
            {status === 'completed' && (
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm">Thank you for dining with us! We'd love your feedback.</p>
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

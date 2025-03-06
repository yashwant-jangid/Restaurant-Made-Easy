
import React, { useEffect, useState } from 'react';
import { Check, Clock, ChefHat, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OrderStatusProps {
  orderId?: string;
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId }) => {
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [progress, setProgress] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [kitchenLoad, setKitchenLoad] = useState('medium'); // 'low', 'medium', 'high'
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const navigate = useNavigate();
  
  // Fetch latest order if no orderId provided
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!orderId) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('id, order_number, status, estimated_time')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (error) {
            console.error('Error fetching latest order:', error);
            simulateKitchenStatus();
            setLoading(false);
            return;
          }
          
          if (data) {
            setStatus(data.status as OrderStatus);
            setTimeRemaining(data.estimated_time);
            setOrderNumber(data.order_number);
            
            // Set initial progress based on status
            if (data.status === 'pending') {
              setProgress(10);
            } else if (data.status === 'preparing') {
              setProgress(40);
            } else if (data.status === 'ready' || data.status === 'completed') {
              setProgress(100);
              setTimeRemaining(0);
            }
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching latest order:', error);
          simulateKitchenStatus();
          setLoading(false);
        }
      }
    };
    
    fetchLatestOrder();
  }, [orderId]);
  
  // Subscribe to real-time updates for the order status
  useEffect(() => {
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (orderId && payload.new.id === orderId) {
            updateOrderStatus(payload.new.status, payload.new.estimated_time);
          } else if (!orderId && payload.new.order_number === orderNumber) {
            updateOrderStatus(payload.new.status, payload.new.estimated_time);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, orderNumber]);
  
  // Function to update order status from real-time events
  const updateOrderStatus = (newStatus: string, estimatedTime: number) => {
    setStatus(newStatus as OrderStatus);
    setTimeRemaining(estimatedTime);
    
    if (newStatus === 'pending') {
      setProgress(10);
    } else if (newStatus === 'preparing') {
      setProgress(40);
    } else if (newStatus === 'ready' || newStatus === 'completed') {
      setProgress(100);
      setTimeRemaining(0);
    }
  };
  
  // Simulate order progression for demo purposes
  const simulateKitchenStatus = () => {
    // Randomly determine current kitchen load
    const loads = ['low', 'medium', 'high'];
    const randomLoad = loads[Math.floor(Math.random() * loads.length)];
    setKitchenLoad(randomLoad);
    
    // Adjust preparation times based on kitchen load - make them more realistic
    let pendingTime = 30000; // 30 seconds in ms
    let preparingTime = 45000; // 45 seconds in ms
    
    if (randomLoad === 'high') {
      pendingTime = 40000; // 40 seconds
      preparingTime = 60000; // 60 seconds
      setTimeRemaining(prev => Math.min(25, prev + 5));
    } else if (randomLoad === 'low') {
      pendingTime = 25000; // 25 seconds
      preparingTime = 35000; // 35 seconds
      setTimeRemaining(prev => Math.max(10, prev - 3));
    }
    
    if (status === 'pending') {
      const timer = setTimeout(() => {
        setStatus('preparing');
        setProgress(40);
        setTimeRemaining(prev => Math.max(5, prev - 5));
      }, pendingTime);
      
      return () => clearTimeout(timer);
    } else if (status === 'preparing') {
      const timer = setTimeout(() => {
        setStatus('ready');
        setProgress(100);
        setTimeRemaining(0);
      }, preparingTime);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Update progress based on time remaining
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
  
  const handleComplete = async () => {
    try {
      // Update order status to completed in Supabase
      let updateQuery;
      
      if (orderId) {
        updateQuery = supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('id', orderId);
      } else {
        updateQuery = supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('order_number', orderNumber);
      }
      
      const { error } = await updateQuery;
      
      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
      
      setStatus('completed');
      setTimeout(() => {
        navigate('/feedback');
      }, 2000);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order. Please try again.');
    }
  };
  
  const getKitchenLoadMessage = () => {
    switch (kitchenLoad) {
      case 'high': return "Our kitchen is very busy right now. Thanks for your patience!";
      case 'low': return "Our kitchen is not busy. Your order will be ready soon!";
      default: return "Our kitchen is processing orders at a normal pace.";
    }
  };
  
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">Order #{orderNumber || orderId?.substring(0, 4)}</h2>
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

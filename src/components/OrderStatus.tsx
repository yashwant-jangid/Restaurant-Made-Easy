
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
  const [orderId2, setOrderId2] = useState<string | undefined>(orderId);
  const [estimatedReadyTime, setEstimatedReadyTime] = useState<string>('');
  const navigate = useNavigate();
  
  // Fetch latest order if no orderId provided
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        // If we have an orderId, fetch that specific order
        if (orderId) {
          const { data, error } = await supabase
            .from('orders')
            .select('id, order_number, status, estimated_time, created_at')
            .eq('id', orderId)
            .single();
          
          if (error) {
            console.error('Error fetching order:', error);
            setLoading(false);
            return;
          }
          
          if (data) {
            setStatus(data.status as OrderStatus);
            setTimeRemaining(data.estimated_time);
            setOrderNumber(data.order_number);
            setOrderId2(data.id);
            updateProgressBasedOnStatus(data.status as OrderStatus);
            calculateEstimatedReadyTime(data.estimated_time);
          }
        } else {
          // Otherwise fetch the latest order
          const { data, error } = await supabase
            .from('orders')
            .select('id, order_number, status, estimated_time, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (error) {
            console.error('Error fetching latest order:', error);
            setLoading(false);
            return;
          }
          
          if (data) {
            setStatus(data.status as OrderStatus);
            setTimeRemaining(data.estimated_time);
            setOrderNumber(data.order_number);
            setOrderId2(data.id);
            updateProgressBasedOnStatus(data.status as OrderStatus);
            calculateEstimatedReadyTime(data.estimated_time);
          }
        }
        
        // Determine kitchen load randomly for simulation
        const loads = ['low', 'medium', 'high'];
        const randomLoad = loads[Math.floor(Math.random() * loads.length)];
        setKitchenLoad(randomLoad);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };
    
    fetchLatestOrder();
  }, [orderId]);
  
  // Calculate the estimated ready time in clock format
  const calculateEstimatedReadyTime = (minutes: number) => {
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + minutes * 60000);
    
    // Format the time as HH:MM AM/PM
    let hours = estimatedTime.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes_ = estimatedTime.getMinutes().toString().padStart(2, '0');
    
    setEstimatedReadyTime(`${hours}:${minutes_} ${ampm}`);
  };

  const updateProgressBasedOnStatus = (orderStatus: OrderStatus) => {
    if (orderStatus === 'pending') {
      setProgress(10);
    } else if (orderStatus === 'preparing') {
      setProgress(40);
    } else if (orderStatus === 'ready') {
      setProgress(100);
      setTimeRemaining(0);
    } else if (orderStatus === 'completed') {
      setProgress(100);
      setTimeRemaining(0);
    }
  };
  
  // Subscribe to real-time updates for the order status
  useEffect(() => {
    if (!orderId2) return;
    
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId2}`
        },
        (payload) => {
          console.log('Order update received:', payload);
          const newStatus = payload.new.status as OrderStatus;
          updateOrderStatus(newStatus, payload.new.estimated_time);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId2]);
  
  // Function to update order status from real-time events
  const updateOrderStatus = (newStatus: OrderStatus, estimatedTime: number) => {
    setStatus(newStatus);
    setTimeRemaining(estimatedTime);
    updateProgressBasedOnStatus(newStatus);
    calculateEstimatedReadyTime(estimatedTime);
  };
  
  // Update progress based on time remaining
  useEffect(() => {
    if (timeRemaining > 0 && status !== 'ready' && status !== 'completed') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        
        // Progress updates more smoothly based on status and time remaining
        if (status === 'pending') {
          // Move from 10% to 40% during pending status
          const targetProgress = 40;
          const currentSegmentProgress = ((10 - timeRemaining) / 10) * (targetProgress - 10);
          setProgress(Math.min(40, 10 + currentSegmentProgress));
        } else if (status === 'preparing') {
          // Move from 40% to 100% during preparing status
          const targetProgress = 100;
          const currentSegmentProgress = ((timeRemaining > 0 ? 10 - timeRemaining : 10) / 10) * (targetProgress - 40);
          setProgress(Math.min(100, 40 + currentSegmentProgress));
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, status]);
  
  const handleComplete = async () => {
    try {
      if (!orderId2) {
        toast.error('No order ID available');
        return;
      }
      
      // Update order status to completed in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId2);
      
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
        <h2 className="text-2xl font-medium mb-2">Order #{orderNumber || orderId2?.substring(0, 4)}</h2>
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
                <span className="text-muted-foreground mr-1">Ready by:</span>
                <span className="text-primary font-semibold">{estimatedReadyTime}</span>
                <span className="text-sm text-muted-foreground ml-1">({timeRemaining} min)</span>
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

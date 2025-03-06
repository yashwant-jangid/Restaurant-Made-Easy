
import React, { useState, useEffect } from 'react';
import OrderStatus from '@/components/OrderStatus';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Status = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [hasOrder, setHasOrder] = useState(false);

  // Check if there are any orders
  useEffect(() => {
    const checkForOrders = async () => {
      try {
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error checking for orders:', error);
        } else {
          setHasOrder(count !== undefined && count > 0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking for orders:', error);
        setLoading(false);
      }
    };
    
    checkForOrders();
  }, []);

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasOrder && !orderId) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-medium mb-4">No Active Orders</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any active orders right now. Please place an order from the menu.
          </p>
          <img
            src="https://illustrations.popsy.co/amber/taking-order.svg"
            alt="No orders"
            className="w-64 h-64 mx-auto mb-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <OrderStatus orderId={orderId || undefined} />
    </div>
  );
};

export default Status;

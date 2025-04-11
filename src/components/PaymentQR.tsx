
import React, { useState } from 'react';
import { IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PaymentQRProps {
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, onPaymentComplete }) => {
  const { cart } = useCart();
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handlePaymentComplete = async () => {
    try {
      if (!upiId.trim()) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
      
      setIsProcessing(true);
      
      // Generate a random 4-digit order number
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Create order data object
      const orderData = {
        order_number: orderNumber,
        table_number: cart.tableNumber,
        status: 'pending',
        total: amount,
        estimated_time: cart.estimatedTime,
        payment_method: 'UPI',
        payment_details: { upi_id: upiId }
      };
      
      // Try to save to Supabase with error handling and retries
      let savedOrderId = null;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries && !savedOrderId) {
        try {
          console.log(`Attempt ${retryCount + 1} to save order`);
          const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select('id')
            .single();
          
          if (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);
            throw error;
          }
          
          savedOrderId = data.id;
          console.log('Order saved successfully:', data);
        } catch (err) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw err;
          }
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      // If we couldn't save to the database after retries, use local fallback
      if (!savedOrderId) {
        console.log('Using local fallback for order');
        // Save order to localStorage as fallback
        const fallbackOrder = {
          id: `local-${Date.now()}`,
          ...orderData,
          created_at: new Date().toISOString()
        };
        
        const savedOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
        savedOrders.push(fallbackOrder);
        localStorage.setItem('pendingOrders', JSON.stringify(savedOrders));
        
        toast.success(`Order #${orderNumber} placed successfully!`);
        toast.info('Your order is saved locally and will sync when connection is restored');
        
        // Continue with payment completion
        setIsOpen(false);
        onPaymentComplete();
        return;
      }
      
      // Insert order items
      const orderItems = cart.items.map(item => ({
        order_id: savedOrderId,
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.warn('Error saving order items, will try to save locally:', itemsError);
        // Save items to localStorage as fallback
        localStorage.setItem(`order_items_${savedOrderId}`, JSON.stringify(orderItems));
      }
      
      // Update the table status to occupied
      try {
        const { error: tableError } = await supabase
          .from('active_tables')
          .update({ status: 'occupied' })
          .eq('table_number', cart.tableNumber);
        
        if (tableError) {
          console.warn('Error updating table status:', tableError);
        }
      } catch (tableUpdateError) {
        console.warn('Failed to update table status:', tableUpdateError);
      }
      
      // Show success toast
      toast.success(`Order #${orderNumber} placed successfully!`);
      
      // Continue with regular payment completion
      setIsOpen(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all font-medium"
          onClick={() => setIsOpen(true)}
        >
          <IndianRupee className="h-4 w-4 mr-2" />
          Pay with UPI ₹{amount.toFixed(2)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pay with UPI</DialogTitle>
          <DialogDescription>
            Enter your UPI ID to complete payment of ₹{amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input 
              id="upi-id" 
              placeholder="yourname@upi" 
              value={upiId} 
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Examples: yourname@okaxis, yourname@okicici, yourname@ybl</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="default"
            onClick={handlePaymentComplete}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQR;

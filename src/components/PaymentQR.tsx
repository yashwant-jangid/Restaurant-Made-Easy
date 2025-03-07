
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
  
  const handlePaymentComplete = async () => {
    try {
      if (!upiId.trim()) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
      
      setIsProcessing(true);
      
      // Generate a random 4-digit order number
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Create a new order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          table_number: cart.tableNumber,
          status: 'pending',
          total: amount,
          estimated_time: cart.estimatedTime,
          payment_method: 'UPI',
          payment_details: { upi_id: upiId }
        })
        .select('id')
        .single();
      
      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }
      
      // Insert order items
      const orderItems = cart.items.map(item => ({
        order_id: orderData.id,
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
        throw new Error(`Failed to save order items: ${itemsError.message}`);
      }
      
      // Update the table status to occupied
      const { error: tableError } = await supabase
        .from('active_tables')
        .update({ status: 'occupied' })
        .eq('table_number', cart.tableNumber);
      
      if (tableError) {
        console.error('Error updating table status:', tableError);
      }
      
      // Show success toast
      toast.success(`Order #${orderNumber} placed successfully!`);
      
      // Continue with regular payment completion
      onPaymentComplete();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all font-medium">
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


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

// Regular expression for common UPI ID formats
const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, onPaymentComplete }) => {
  const { cart } = useCart();
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [upiError, setUpiError] = useState('');
  
  const validateUpiId = (id: string) => {
    if (!id.trim()) {
      return "UPI ID is required";
    }
    
    if (!UPI_REGEX.test(id)) {
      return "Invalid UPI ID format. Example: username@bankname";
    }
    
    return "";
  };
  
  const handlePaymentComplete = async () => {
    try {
      // Reset any previous errors
      setUpiError('');
      
      // Validate UPI ID
      const validationError = validateUpiId(upiId);
      if (validationError) {
        setUpiError(validationError);
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
      
      console.log("Attempting to save order:", orderData);
      
      // Save to Supabase with error handling
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();
      
      if (error) {
        console.error("Error saving order:", error);
        throw error;
      }
      
      if (!data?.id) {
        throw new Error("Failed to get order ID after insertion");
      }
      
      const savedOrderId = data.id;
      console.log('Order saved successfully with ID:', savedOrderId);
      
      // Insert order items
      const orderItems = cart.items.map(item => ({
        order_id: savedOrderId,
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      console.log("Saving order items:", orderItems);
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error('Error saving order items:', itemsError);
        throw itemsError;
      }
      
      // Update the table status to occupied
      console.log(`Updating table ${cart.tableNumber} status to occupied`);
      const { error: tableError } = await supabase
        .from('active_tables')
        .update({ status: 'occupied' })
        .eq('table_number', cart.tableNumber);
      
      if (tableError) {
        console.warn('Error updating table status:', tableError);
      }
      
      // Show success toast
      toast.success(`Order #${orderNumber} placed successfully!`);
      
      // Continue with payment completion
      setIsOpen(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Error during payment process:', error);
      toast.error('Failed to process payment. Please try again.');
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
              onChange={(e) => {
                setUpiId(e.target.value);
                if (upiError) setUpiError('');
              }}
              className={`w-full ${upiError ? 'border-red-500' : ''}`}
            />
            {upiError && (
              <p className="text-sm text-red-500">{upiError}</p>
            )}
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

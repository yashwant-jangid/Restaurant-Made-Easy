
import React from 'react';
import { QrCode } from 'lucide-react';
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
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PaymentQRProps {
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, onPaymentComplete }) => {
  const { cart } = useCart();
  
  // In a real app, this would be dynamically generated with the payment amount
  // and merchant details from a payment gateway
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=RestaurantMadeEasy&am=${amount}&cu=INR&tn=FoodOrder`;
  
  const handlePaymentComplete = async () => {
    try {
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
          estimated_time: cart.estimatedTime
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
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all font-medium">
          <QrCode className="h-4 w-4 mr-2" />
          Pay with UPI QR ₹{amount.toFixed(2)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Scan QR to Pay</DialogTitle>
          <DialogDescription>
            Open your UPI app and scan this QR code to complete payment of ₹{amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="border rounded-lg p-2 bg-white shadow-md">
            <img src={qrImageUrl} alt="Payment QR" className="w-64 h-64" />
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>UPI ID: example@upi</p>
          <p>Merchant: Restaurant Made Easy</p>
        </div>
        <DialogFooter>
          <Button 
            variant="default"
            onClick={handlePaymentComplete}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            I've Completed Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQR;

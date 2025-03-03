
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

interface PaymentQRProps {
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, onPaymentComplete }) => {
  const { cart } = useCart();
  
  // In a real app, this would be dynamically generated with the payment amount
  // and merchant details from a payment gateway
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=RestaurantMadeEasy&am=${amount}&cu=INR&tn=FoodOrder`;
  
  const handlePaymentComplete = () => {
    // Save the order data to localStorage for the dashboard
    const existingOrders = JSON.parse(localStorage.getItem('restaurantOrders') || '[]');
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000).toString(), // Generate random 4-digit order ID
      items: cart.items,
      status: 'pending',
      tableNumber: cart.tableNumber,
      total: amount,
      timestamp: new Date(),
      estimatedTime: cart.estimatedTime
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('restaurantOrders', JSON.stringify(updatedOrders));
    
    // Notify with a toast
    toast.success(`Order #${newOrder.id} placed successfully!`);
    
    // Continue with regular payment completion
    onPaymentComplete();
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

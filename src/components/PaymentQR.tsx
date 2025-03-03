
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

interface PaymentQRProps {
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, onPaymentComplete }) => {
  // In a real app, this would be dynamically generated with the payment amount
  // and merchant details from a payment gateway
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=RestaurantMadeEasy&am=${amount}&cu=INR&tn=FoodOrder`;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-12">
          <QrCode className="h-4 w-4 mr-2" />
          Pay with UPI QR ₹{amount.toFixed(2)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR to Pay</DialogTitle>
          <DialogDescription>
            Open your UPI app and scan this QR code to complete payment of ₹{amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="border rounded-lg p-2 bg-white">
            <img src={qrImageUrl} alt="Payment QR" className="w-64 h-64" />
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>UPI ID: example@upi</p>
          <p>Merchant: Restaurant Made Easy</p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onPaymentComplete}
            className="w-full"
          >
            I've Completed Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQR;

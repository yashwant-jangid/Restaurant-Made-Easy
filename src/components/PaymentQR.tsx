import React, { useState } from 'react';
import { IndianRupee, Check } from 'lucide-react';
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
  tableNumber: number; // Pass table number as prop instead of using useCart
  estimatedTime: number; // Pass estimated time as prop instead of using useCart
}

// Regular expression for common UPI ID formats
const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

// Payment verification states
type PaymentStatus = 'initial' | 'processing' | 'verifying' | 'completed';

const PaymentQR: React.FC<PaymentQRProps> = ({ 
  amount, 
  onPaymentComplete, 
  tableNumber,
  estimatedTime 
}) => {
  const [upiId, setUpiId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [upiError, setUpiError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('initial');
  
  const validateUpiId = (id: string) => {
    if (!id.trim()) {
      return "UPI ID is required";
    }
    
    if (!UPI_REGEX.test(id)) {
      return "Invalid UPI ID format. Example: username@bankname";
    }
    
    return "";
  };

  const handleInitiatePayment = () => {
    // Reset any previous errors
    setUpiError('');
    
    // Validate UPI ID
    const validationError = validateUpiId(upiId);
    if (validationError) {
      setUpiError(validationError);
      return;
    }
    
    // Initiate UPI payment
    setPaymentStatus('processing');
    
    // In a real app, this would initiate a UPI payment request
    // Here we'll just simulate the process
    toast.info(`Payment request sent to ${upiId}`, {
      description: `Please complete the payment of ₹${amount.toFixed(2)} in your UPI app`
    });
  };
  
  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter the transaction ID");
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus('verifying');
    
    try {
      // In a real app, you would verify this transaction ID with a payment gateway
      // Here we'll simulate a verification process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify payment based on transaction ID format
      const isValidTransaction = /^[A-Za-z0-9]{10,}$/.test(transactionId.trim());
      
      if (!isValidTransaction) {
        toast.error("Invalid transaction ID format");
        setPaymentStatus('processing');
        setIsProcessing(false);
        return;
      }
      
      // Generate a random 4-digit order number
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Create order data object
      const orderData = {
        order_number: orderNumber,
        table_number: tableNumber,
        status: 'pending',
        total: amount,
        estimated_time: estimatedTime,
        payment_method: 'UPI',
        payment_details: { 
          upi_id: upiId,
          transaction_id: transactionId
        }
      };
      
      console.log("Attempting to save order:", orderData);
      
      // Save to Supabase with error handling
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();
      
      if (insertError) {
        console.error("Error saving order:", insertError);
        throw insertError;
      }
      
      if (!data?.id) {
        throw new Error("Failed to get order ID after insertion");
      }
      
      const savedOrderId = data.id;
      console.log('Order saved successfully with ID:', savedOrderId);
      
      // Update the table status to occupied
      console.log(`Updating table ${tableNumber} status to occupied`);
      const { error: tableError } = await supabase
        .from('active_tables')
        .update({ status: 'occupied' })
        .eq('table_number', tableNumber);
      
      if (tableError) {
        console.warn('Error updating table status:', tableError);
      }
      
      setPaymentStatus('completed');
      toast.success(`Order #${orderNumber} placed successfully!`);
      
      // Continue with payment completion
      setTimeout(() => {
        setIsOpen(false);
        onPaymentComplete();
      }, 1500);
    } catch (error) {
      console.error('Error during payment process:', error);
      toast.error('Failed to process payment. Please try again.');
      setPaymentStatus('processing');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetPaymentFlow = () => {
    setPaymentStatus('initial');
    setTransactionId('');
  };
  
  const renderPaymentStep = () => {
    switch (paymentStatus) {
      case 'initial':
        return (
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
        );
        
      case 'processing':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 p-4 rounded-lg my-4">
              <p className="text-center font-medium">Payment request sent</p>
              <p className="text-center text-sm text-muted-foreground mb-2">
                Complete the payment of ₹{amount.toFixed(2)} in your UPI app
              </p>
              <p className="text-center text-green-600 font-medium text-sm">
                UPI ID: {upiId}
              </p>
            </div>
            <div className="w-full space-y-3">
              <Label htmlFor="transaction-id">Enter Transaction ID after payment</Label>
              <Input 
                id="transaction-id"
                placeholder="e.g. UPID12345678"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'verifying':
        return (
          <div className="py-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-center">Verifying payment...</p>
            <p className="text-center text-sm text-muted-foreground">
              This may take a moment
            </p>
          </div>
        );
        
      case 'completed':
        return (
          <div className="py-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-center font-medium">Payment successful!</p>
            <p className="text-center text-sm text-muted-foreground">
              Your order has been placed
            </p>
          </div>
        );
    }
  };
  
  const renderFooterButtons = () => {
    switch (paymentStatus) {
      case 'initial':
        return (
          <Button 
            variant="default"
            onClick={handleInitiatePayment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Pay Now
          </Button>
        );
        
      case 'processing':
        return (
          <div className="flex flex-col gap-3 w-full">
            <Button 
              variant="default"
              onClick={handleVerifyPayment}
              disabled={isProcessing || !transactionId}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Verify Payment
            </Button>
            <Button 
              variant="outline"
              onClick={resetPaymentFlow}
              disabled={isProcessing}
            >
              Go Back
            </Button>
          </div>
        );
        
      case 'verifying':
        return null;
        
      case 'completed':
        return null;
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
            {paymentStatus === 'initial' ? (
              `Enter your UPI ID to pay ₹${amount.toFixed(2)}`
            ) : paymentStatus === 'processing' ? (
              `Complete payment of ₹${amount.toFixed(2)} in your UPI app`
            ) : (
              `Processing payment of ₹${amount.toFixed(2)}`
            )}
          </DialogDescription>
        </DialogHeader>
        
        {renderPaymentStep()}
        
        <DialogFooter>
          {renderFooterButtons()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQR;

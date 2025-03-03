
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Clock, IndianRupee, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PaymentQR from './PaymentQR';

const Cart: React.FC = () => {
  const { cart, updateQuantity, clearCart, setTableNumber } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTableNumber(value);
    }
  };

  const handlePaymentComplete = () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success("Payment successful! Order placed.");
      clearCart();
      setIsProcessing(false);
      setIsOpen(false);
      navigate('/status');
    }, 2000);
  };

  // Calculate service fee and total
  const serviceFee = cart.total * 0.05;
  const totalAmount = cart.total + serviceFee;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative bg-primary text-primary-foreground rounded-full w-12 h-12 shadow-sm hover:bg-primary/90 hover:scale-105 transition-all"
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.items.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center rounded-full"
            >
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 pb-0">
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-xl flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Your Order
            </SheetTitle>
            <SheetDescription>
              {cart.items.length === 0 
                ? "Your cart is empty" 
                : `${cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart`
              }
            </SheetDescription>
          </SheetHeader>
          
          {cart.items.length > 0 && (
            <>
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-muted-foreground text-xs mt-1 flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        <p className="font-medium">{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center text-sm mb-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">Estimated preparation time</div>
                  <div className="font-medium">{cart.estimatedTime} min</div>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                  <div className="form-group space-y-2">
                    <Label htmlFor="table-number">Table Number</Label>
                    <Input 
                      id="table-number" 
                      type="number" 
                      min="1" 
                      value={cart.tableNumber} 
                      onChange={handleTableNumberChange}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      <span>{cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee (5%)</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      <span>{serviceFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span>{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <SheetFooter className="p-6 pt-4">
          {cart.items.length > 0 ? (
            <PaymentQR 
              amount={totalAmount} 
              onPaymentComplete={handlePaymentComplete} 
            />
          ) : (
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
              Continue Browsing
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

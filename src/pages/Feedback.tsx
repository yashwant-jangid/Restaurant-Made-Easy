
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { MessageSquare, Star, Send } from 'lucide-react';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<string | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to save feedback
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      // Reset form
      setName('');
      setEmail('');
      setRating(undefined);
      setComment('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-medium mb-3">Your Feedback Matters</h1>
          <p className="text-muted-foreground">
            We'd love to hear about your experience with us. Your feedback helps us improve our service.
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>How would you rate your experience?</Label>
              <div className="flex justify-center">
                <RadioGroup 
                  value={rating} 
                  onValueChange={setRating}
                  className="flex gap-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center space-y-1">
                      <RadioGroupItem 
                        value={value.toString()} 
                        id={`rating-${value}`} 
                        className="sr-only peer"
                      />
                      <Label 
                        htmlFor={`rating-${value}`}
                        className="flex flex-col items-center cursor-pointer peer-data-[state=checked]:text-primary"
                      >
                        <Star 
                          className={`h-8 w-8 ${rating === value.toString() ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground hover:fill-muted-foreground'}`}
                        />
                        <span className="text-xs mt-1">{value}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Tell us about your experience</Label>
              <Textarea 
                id="comment" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="What did you like or dislike? Any suggestions for improvement?"
                className="min-h-32"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

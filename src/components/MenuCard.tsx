
import React from 'react';
import { MenuItem, getRecommendations } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const recommendations = getRecommendations(item);
  
  return (
    <Card className="menu-card group overflow-hidden animate-fade-in">
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="menu-image"
          loading="lazy"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              variant="secondary" 
              className="mb-2"
            >
              {item.category}
            </Badge>
            {item.popular && (
              <Badge 
                variant="outline" 
                className="ml-2 mb-2 border-primary/20 text-primary"
              >
                Popular
              </Badge>
            )}
          </div>
          <span className="font-medium text-primary">${item.price.toFixed(2)}</span>
        </div>
        <CardTitle className="text-lg font-medium mt-1">{item.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 mt-1">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md animate-scale-in">
            <DialogHeader>
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <DialogDescription className="pt-2">
                {item.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="rounded-lg w-full aspect-video object-cover mb-4"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">Preparation time: ~{item.preparationTime} min</span>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </div>
              
              {recommendations.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">You might also like:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent transition-colors">
                        <img 
                          src={rec.image} 
                          alt={rec.name} 
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium truncate">{rec.name}</h5>
                          <p className="text-xs text-muted-foreground">${rec.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => addItem(item)} className="w-full">
                Add to Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={() => addItem(item)} 
          size="sm" 
          className="rounded-full w-10 h-10 p-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;

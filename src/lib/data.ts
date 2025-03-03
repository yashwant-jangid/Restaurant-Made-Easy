
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  preparationTime: number;
  popular: boolean;
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  tableNumber: number;
  total: number;
  timestamp: Date;
  estimatedTime: number;
}

// Mock data for menu items
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce on a brioche bun",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    category: "Burgers",
    preparationTime: 15,
    popular: true,
    tags: ["beef", "cheese", "classic"]
  },
  {
    id: "2",
    name: "Veggie Delight Pizza",
    description: "Fresh bell peppers, mushrooms, onions, olives, and tomatoes on our signature house-made dough",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&h=600&fit=crop",
    category: "Pizza",
    preparationTime: 20,
    popular: false,
    tags: ["vegetarian", "vegetables", "pizza"]
  },
  {
    id: "3",
    name: "Truffle Fries",
    description: "Crispy golden fries tossed with truffle oil, parmesan cheese, and fresh herbs",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop",
    category: "Sides",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "truffle", "fries"]
  },
  {
    id: "4",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, garlic croutons, parmesan cheese, and our housemade Caesar dressing",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop",
    category: "Salads",
    preparationTime: 8,
    popular: false,
    tags: ["healthy", "salad", "lunch"]
  },
  {
    id: "5",
    name: "BBQ Chicken Wings",
    description: "Tender chicken wings coated in our smoky BBQ sauce, served with celery and blue cheese dip",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=600&fit=crop",
    category: "Appetizers",
    preparationTime: 18,
    popular: true,
    tags: ["chicken", "bbq", "spicy"]
  },
  {
    id: "6",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1617305855058-336d9ce3eb0a?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 15,
    popular: true,
    tags: ["dessert", "chocolate", "sweet"]
  },
  {
    id: "7",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil on our signature house-made dough",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
    category: "Pizza",
    preparationTime: 20,
    popular: true,
    tags: ["vegetarian", "classic", "pizza"]
  },
  {
    id: "8",
    name: "Spicy Tuna Roll",
    description: "Fresh tuna, spicy mayo, cucumber, and avocado wrapped in seaweed and rice",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop",
    category: "Sushi",
    preparationTime: 15,
    popular: false,
    tags: ["seafood", "spicy", "sushi"]
  }
];

// Mock orders
export const orders: Order[] = [
  {
    id: "order1",
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[2], quantity: 1 }
    ],
    status: "preparing",
    tableNumber: 5,
    total: 34.97,
    timestamp: new Date(),
    estimatedTime: 20
  },
  {
    id: "order2",
    items: [
      { ...menuItems[6], quantity: 1 },
      { ...menuItems[3], quantity: 1 }
    ],
    status: "ready",
    tableNumber: 3,
    total: 24.98,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    estimatedTime: 15
  }
];

// Get recommendations based on a menu item
export function getRecommendations(item: MenuItem): MenuItem[] {
  // In a real app, this would use ML/AI to generate recommendations
  // For now, we'll just return items from the same category (except the current one)
  return menuItems
    .filter(menuItem => menuItem.category === item.category && menuItem.id !== item.id)
    .slice(0, 2);
}

// Calculate estimated preparation time
export function calculateEstimatedTime(items: CartItem[]): number {
  // In a real app, this would use ML/AI based on historical data
  // For now, we'll use the highest prep time item and add 5 minutes for each additional item
  if (items.length === 0) return 0;
  
  const baseTime = Math.max(...items.map(item => item.preparationTime));
  const additionalTime = Math.max(0, items.length - 1) * 5;
  
  return baseTime + additionalTime;
}

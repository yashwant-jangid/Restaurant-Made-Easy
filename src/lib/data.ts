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
  complexity?: number;
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
    name: "Classic Veg Burger",
    description: "Crispy veg patty with fresh lettuce, tomato, and our special sauce on a brioche bun",
    price: 199,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop",
    category: "Burgers",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "burger", "classic"],
    complexity: 2
  },
  {
    id: "2",
    name: "Paneer Tikka Pizza",
    description: "Fresh bell peppers, marinated paneer, onions, and our signature spicy sauce on house-made dough",
    price: 349,
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&h=600&fit=crop",
    category: "Pizza",
    preparationTime: 20,
    popular: true,
    tags: ["vegetarian", "paneer", "pizza", "spicy"],
    complexity: 3
  },
  {
    id: "3",
    name: "Masala Fries",
    description: "Crispy golden fries tossed with our special masala spice blend and fresh coriander",
    price: 149,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop",
    category: "Sides",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "spicy", "fries"],
    complexity: 1
  },
  {
    id: "4",
    name: "Garden Fresh Salad",
    description: "Mix of fresh vegetables, paneer cubes, and roasted nuts with our tangy mint dressing",
    price: 179,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop",
    category: "Salads",
    preparationTime: 8,
    popular: false,
    tags: ["healthy", "salad", "lunch"],
    complexity: 1
  },
  {
    id: "5",
    name: "Tandoori Chicken Wings",
    description: "Tender chicken wings marinated in tandoori spices, served with mint chutney",
    price: 299,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=600&fit=crop",
    category: "Appetizers",
    preparationTime: 18,
    popular: true,
    tags: ["chicken", "tandoori", "spicy"],
    complexity: 3
  },
  {
    id: "6",
    name: "Gulab Jamun Cheesecake",
    description: "Creamy cheesecake with gulab jamun pieces, topped with saffron syrup",
    price: 199,
    image: "https://images.unsplash.com/photo-1617305855058-336d9ce3eb0a?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 10,
    popular: true,
    tags: ["dessert", "sweet", "fusion"],
    complexity: 2
  },
  {
    id: "7",
    name: "Butter Chicken",
    description: "Tender chicken pieces in a rich, creamy tomato gravy with butter and cream",
    price: 349,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 25,
    popular: true,
    tags: ["chicken", "creamy", "spicy", "north indian"],
    complexity: 4
  },
  {
    id: "8",
    name: "Paneer Butter Masala",
    description: "Paneer cubes in a rich tomato and butter gravy with aromatic spices",
    price: 299,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 20,
    popular: true,
    tags: ["vegetarian", "paneer", "creamy", "north indian"],
    complexity: 3
  },
  {
    id: "9",
    name: "Dal Makhani",
    description: "Black lentils simmered overnight with butter and cream",
    price: 249,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 30,
    popular: false,
    tags: ["vegetarian", "lentils", "creamy", "north indian"],
    complexity: 3
  },
  {
    id: "10",
    name: "Masala Dosa",
    description: "Crispy rice pancake filled with spiced potato filling, served with sambar and chutneys",
    price: 199,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
    category: "South Indian",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "south indian", "breakfast", "crispy"],
    complexity: 2
  },
  {
    id: "11",
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil soup and coconut chutney",
    price: 149,
    image: "https://images.unsplash.com/photo-1589301761878-95c3accdaedb?w=800&h=600&fit=crop",
    category: "South Indian",
    preparationTime: 20,
    popular: false,
    tags: ["vegetarian", "south indian", "breakfast", "healthy"],
    complexity: 2
  },
  {
    id: "12",
    name: "Hyderabadi Biryani",
    description: "Fragrant basmati rice cooked with tender meat, aromatic spices, and herbs",
    price: 399,
    image: "https://images.unsplash.com/photo-1630851840633-f96999247032?w=800&h=600&fit=crop",
    category: "Biryani",
    preparationTime: 35,
    popular: true,
    tags: ["non-vegetarian", "rice", "spicy", "hyderabadi"],
    complexity: 5
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

// Get recommendations based on machine learning algorithm
export function getRecommendations(item: MenuItem): MenuItem[] {
  // In a real app, we would call a trained ML model
  // For now, we'll use a more sophisticated algorithm to simulate ML recommendations
  
  // Calculate a "similarity score" between the selected item and other items
  const recommendations = menuItems
    .filter(menuItem => menuItem.id !== item.id) // Exclude the current item
    .map(menuItem => {
      let score = 0;
      
      // Category match gives highest weight
      if (menuItem.category === item.category) score += 5;
      
      // Count matching tags
      const matchingTags = menuItem.tags.filter(tag => item.tags.includes(tag)).length;
      score += matchingTags * 2;
      
      // Similar price range
      const priceDiff = Math.abs(menuItem.price - item.price);
      if (priceDiff < 50) score += 3;
      else if (priceDiff < 100) score += 2;
      else if (priceDiff < 150) score += 1;
      
      // If both are popular or both are not popular
      if (menuItem.popular === item.popular) score += 1;
      
      return { menuItem, score };
    })
    .sort((a, b) => b.score - a.score) // Sort by highest score
    .map(item => item.menuItem)
    .slice(0, 2); // Get top 2 recommendations
  
  return recommendations;
}

// Calculate estimated preparation time based on realistic factors
export function calculateEstimatedTime(items: CartItem[]): number {
  if (items.length === 0) return 0;
  
  // Base preparation time is the sum of all individual item prep times adjusted by quantity and complexity
  let totalPrepTime = 0;
  
  // Calculate base time from items
  items.forEach(item => {
    // Adjust prep time based on complexity
    const complexityFactor = item.complexity || 3; // Default to medium complexity if not specified
    const adjustedItemTime = item.preparationTime * (1 + (complexityFactor - 3) / 10);
    
    // First item takes full prep time
    const firstItemTime = adjustedItemTime;
    
    // Additional quantities of the same item take less time (parallel cooking)
    const additionalQuantityTime = item.quantity > 1 ? 
      (item.quantity - 1) * (adjustedItemTime * 0.4) : 0;
    
    totalPrepTime += firstItemTime + additionalQuantityTime;
  });
  
  // Get unique categories to simulate kitchen workload
  const uniqueCategories = new Set(items.map(item => item.category)).size;
  
  // More unique categories means more concurrent preparation
  const categoryEfficiencyFactor = Math.max(0.6, 1 - (uniqueCategories - 1) * 0.1);
  
  // Total order size affects efficiency (larger orders take relatively less time per item)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderSizeFactor = Math.min(1.3, 1 + (totalItems - 1) * 0.03);
  
  // Final calculation with all factors
  const finalPrepTime = Math.round(totalPrepTime * categoryEfficiencyFactor * orderSizeFactor);
  
  return finalPrepTime;
}

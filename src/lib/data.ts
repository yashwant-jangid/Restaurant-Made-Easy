
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

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Veg Burger",
    description: "Crispy veg patty with fresh lettuce, tomato, and our special sauce on a brioche bun",
    price: 199,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop",
    category: "Burgers",
    preparationTime: 5,
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
  },
  {
    id: "13",
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with deep-fried bread",
    price: 199,
    image: "https://images.unsplash.com/photo-1626132647523-66c5cabfcd44?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: true,
    tags: ["vegetarian", "spicy", "punjabi"],
    complexity: 3
  },
  {
    id: "14",
    name: "Pav Bhaji",
    description: "Mashed vegetable curry served with butter-toasted soft bread rolls",
    price: 179,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 18,
    popular: true,
    tags: ["vegetarian", "spicy", "mumbai", "street food"],
    complexity: 2
  },
  {
    id: "15",
    name: "Malai Kofta",
    description: "Fried vegetable dumplings in a creamy tomato sauce",
    price: 279,
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 30,
    popular: false,
    tags: ["vegetarian", "creamy", "rich"],
    complexity: 4
  },
  {
    id: "16",
    name: "Rasmalai",
    description: "Soft cottage cheese dumplings soaked in sweetened, thickened milk",
    price: 99,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 15,
    popular: true,
    tags: ["sweet", "dessert", "bengali"],
    complexity: 3
  },
  {
    id: "17",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 59,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f7a16db3?w=800&h=600&fit=crop",
    category: "Snacks",
    preparationTime: 12,
    popular: true,
    tags: ["vegetarian", "snack", "fried"],
    complexity: 2
  },
  {
    id: "18",
    name: "Aloo Paratha",
    description: "Wheat flatbread stuffed with spiced potatoes, served with yogurt",
    price: 129,
    image: "https://images.unsplash.com/photo-1645149893466-73508a6ced1f?w=800&h=600&fit=crop",
    category: "Breakfast",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "breakfast", "punjabi"],
    complexity: 2
  },
  {
    id: "19",
    name: "Palak Paneer",
    description: "Cottage cheese cubes in a pureed spinach gravy",
    price: 249,
    image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 22,
    popular: true,
    tags: ["vegetarian", "paneer", "healthy"],
    complexity: 3
  },
  {
    id: "20",
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
    price: 249,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
    category: "Biryani",
    preparationTime: 30,
    popular: true,
    tags: ["vegetarian", "rice", "spicy"],
    complexity: 4
  },
  {
    id: "21",
    name: "Chicken Tikka",
    description: "Boneless chicken pieces marinated in spices and grilled in a tandoor",
    price: 299,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 20,
    popular: true,
    tags: ["non-vegetarian", "chicken", "tandoori"],
    complexity: 3
  },
  {
    id: "22",
    name: "Vada Pav",
    description: "Spicy potato fritter in a bread bun with chutneys",
    price: 69,
    image: "https://images.unsplash.com/photo-1606755954268-8a538d178d15?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "mumbai", "street food"],
    complexity: 2
  },
  {
    id: "23",
    name: "Rajma Chawal",
    description: "Kidney bean curry served with steamed rice",
    price: 189,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: false,
    tags: ["vegetarian", "healthy", "comfort food"],
    complexity: 2
  },
  {
    id: "24",
    name: "Egg Curry",
    description: "Boiled eggs simmered in a spicy onion-tomato gravy",
    price: 199,
    image: "https://images.unsplash.com/photo-1603103750026-7ea08799f2d7?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 18,
    popular: false,
    tags: ["non-vegetarian", "eggs", "curry"],
    complexity: 2
  },
  {
    id: "25",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a spicy gravy",
    price: 279,
    image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: true,
    tags: ["vegetarian", "paneer", "spicy"],
    complexity: 3
  },
  {
    id: "26",
    name: "Chicken Korma",
    description: "Chicken pieces in a rich, aromatic yogurt-based gravy",
    price: 299,
    image: "https://images.unsplash.com/photo-1573225342350-16731dd9bf83?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 30,
    popular: false,
    tags: ["non-vegetarian", "chicken", "mughlai"],
    complexity: 4
  },
  {
    id: "27",
    name: "Aloo Gobi",
    description: "Potatoes and cauliflower cooked with Indian spices",
    price: 179,
    image: "https://images.unsplash.com/photo-1590166788774-a516594de678?w=800&h=600&fit=crop",
    category: "Vegetable Dishes",
    preparationTime: 18,
    popular: false,
    tags: ["vegetarian", "dry", "simple"],
    complexity: 2
  },
  {
    id: "28",
    name: "Fish Curry",
    description: "Fish pieces cooked in a tangy curry with coconut milk",
    price: 329,
    image: "https://images.unsplash.com/photo-1626508035297-0cd987ca6ce0?w=800&h=600&fit=crop",
    category: "Coastal",
    preparationTime: 25,
    popular: true,
    tags: ["non-vegetarian", "fish", "coastal"],
    complexity: 3
  },
  {
    id: "29",
    name: "Rogan Josh",
    description: "Slow-cooked lamb in a rich, aromatic gravy",
    price: 359,
    image: "https://images.unsplash.com/photo-1568376794508-ae52c6ab3929?w=800&h=600&fit=crop",
    category: "Kashmiri",
    preparationTime: 40,
    popular: true,
    tags: ["non-vegetarian", "lamb", "kashmiri"],
    complexity: 4
  },
  {
    id: "30",
    name: "Bhindi Masala",
    description: "Okra stir-fried with onions and spices",
    price: 169,
    image: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=800&h=600&fit=crop",
    category: "Vegetable Dishes",
    preparationTime: 20,
    popular: false,
    tags: ["vegetarian", "dry", "homestyle"],
    complexity: 2
  },
  {
    id: "31",
    name: "Chicken Dum Biryani",
    description: "Aromatic rice and chicken slow-cooked together with spices",
    price: 349,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop",
    category: "Biryani",
    preparationTime: 45,
    popular: true,
    tags: ["non-vegetarian", "chicken", "hyderabadi"],
    complexity: 5
  },
  {
    id: "32",
    name: "Kulfi",
    description: "Traditional Indian ice cream with nuts and cardamom",
    price: 99,
    image: "https://images.unsplash.com/photo-1561429985-b41daaa7c61f?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 10,
    popular: true,
    tags: ["sweet", "cold", "dessert"],
    complexity: 2
  },
  {
    id: "33",
    name: "Matar Paneer",
    description: "Cottage cheese and green peas in a tomato-based gravy",
    price: 249,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a254b3320?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 22,
    popular: false,
    tags: ["vegetarian", "paneer", "gravy"],
    complexity: 3
  },
  {
    id: "34",
    name: "Lemon Rice",
    description: "Tangy rice flavored with lemon, mustard seeds, and curry leaves",
    price: 149,
    image: "https://images.unsplash.com/photo-1596797038530-2c107aa45229?w=800&h=600&fit=crop",
    category: "South Indian",
    preparationTime: 15,
    popular: false,
    tags: ["vegetarian", "rice", "tangy"],
    complexity: 1
  },
  {
    id: "35",
    name: "Tandoori Roti",
    description: "Whole wheat flatbread baked in a clay oven",
    price: 35,
    image: "https://images.unsplash.com/photo-1593149326691-f69ee35d4bc7?w=800&h=600&fit=crop",
    category: "Breads",
    preparationTime: 8,
    popular: true,
    tags: ["vegetarian", "bread", "tandoor"],
    complexity: 1
  },
  {
    id: "36",
    name: "Garlic Naan",
    description: "Soft leavened bread with garlic, baked in a tandoor",
    price: 59,
    image: "https://images.unsplash.com/photo-1677163635003-ba68759dae9c?w=800&h=600&fit=crop",
    category: "Breads",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "bread", "garlic"],
    complexity: 2
  },
  {
    id: "37",
    name: "Prawn Curry",
    description: "Prawns cooked in a spicy coconut gravy",
    price: 399,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?w=800&h=600&fit=crop",
    category: "Coastal",
    preparationTime: 25,
    popular: true,
    tags: ["non-vegetarian", "seafood", "spicy"],
    complexity: 3
  },
  {
    id: "38",
    name: "Kaju Katli",
    description: "Diamond-shaped cashew fudge with silver varq",
    price: 129,
    image: "https://images.unsplash.com/photo-1610368356035-f55d92548f7e?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 10,
    popular: true,
    tags: ["sweet", "dessert", "cashew"],
    complexity: 2
  },
  {
    id: "39",
    name: "Butter Naan",
    description: "Soft leavened bread brushed with butter",
    price: 49,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a254b3320?w=800&h=600&fit=crop",
    category: "Breads",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "bread", "buttery"],
    complexity: 2
  },
  {
    id: "40",
    name: "Onion Bhaji",
    description: "Crispy onion fritters with chickpea flour",
    price: 129,
    image: "https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "fried", "crispy"],
    complexity: 2
  },
  {
    id: "41",
    name: "Chicken Madras",
    description: "Spicy chicken curry from South India with a tangy flavor",
    price: 329,
    image: "https://images.unsplash.com/photo-1613082852427-e9c57cb53523?w=800&h=600&fit=crop",
    category: "South Indian",
    preparationTime: 30,
    popular: false,
    tags: ["non-vegetarian", "chicken", "spicy"],
    complexity: 3
  },
  {
    id: "42",
    name: "Vegetable Pakora",
    description: "Mixed vegetable fritters served with chutney",
    price: 149,
    image: "https://images.unsplash.com/photo-1566141015073-ba2a5cd302a5?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "fried", "monsoon"],
    complexity: 2
  },
  {
    id: "43",
    name: "Keema Matar",
    description: "Minced meat cooked with green peas and spices",
    price: 299,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 25,
    popular: false,
    tags: ["non-vegetarian", "minced meat", "mughlai"],
    complexity: 3
  },
  {
    id: "44",
    name: "Pani Puri",
    description: "Hollow crisp fried balls filled with spicy tangy water",
    price: 99,
    image: "https://images.unsplash.com/photo-1604902396875-1e247ac218fc?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 10,
    popular: true,
    tags: ["vegetarian", "street food", "tangy"],
    complexity: 2
  },
  {
    id: "45",
    name: "Chicken Saagwala",
    description: "Chicken cooked with spinach and spices",
    price: 299,
    image: "https://images.unsplash.com/photo-1574356067122-9d9828e70939?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 28,
    popular: false,
    tags: ["non-vegetarian", "chicken", "healthy"],
    complexity: 3
  },
  {
    id: "46",
    name: "Rasgulla",
    description: "Soft, spongy cottage cheese balls in sugar syrup",
    price: 79,
    image: "https://images.unsplash.com/photo-1592643964942-3f8309a4df3d?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 10,
    popular: true,
    tags: ["sweet", "bengali", "dessert"],
    complexity: 2
  },
  {
    id: "47",
    name: "Gobi Manchurian",
    description: "Crispy cauliflower in a spicy, sweet and sour sauce",
    price: 199,
    image: "https://images.unsplash.com/photo-1606913084606-44ba71301ed2?w=800&h=600&fit=crop",
    category: "Indo-Chinese",
    preparationTime: 20,
    popular: true,
    tags: ["vegetarian", "indo-chinese", "spicy"],
    complexity: 3
  },
  {
    id: "48",
    name: "Kadai Paneer",
    description: "Cottage cheese and bell peppers in a spicy tomato gravy",
    price: 279,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: true,
    tags: ["vegetarian", "paneer", "spicy"],
    complexity: 3
  },
  {
    id: "49",
    name: "Chicken Chettinad",
    description: "Fiery chicken curry with black pepper and aromatic spices",
    price: 329,
    image: "https://images.unsplash.com/photo-1682266227022-ee68e4ac4c15?w=800&h=600&fit=crop",
    category: "South Indian",
    preparationTime: 35,
    popular: true,
    tags: ["non-vegetarian", "chicken", "spicy"],
    complexity: 4
  },
  {
    id: "50",
    name: "Tawa Pulao",
    description: "Spiced rice with vegetables cooked on a flat griddle",
    price: 179,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 18,
    popular: false,
    tags: ["vegetarian", "rice", "mumbai"],
    complexity: 2
  },
  {
    id: "51",
    name: "Chana Masala",
    description: "Chickpeas cooked in a spicy tomato gravy",
    price: 179,
    image: "https://images.unsplash.com/photo-1590166571594-bc0d9b84a269?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 20,
    popular: true,
    tags: ["vegetarian", "protein", "spicy"],
    complexity: 2
  },
  {
    id: "52",
    name: "Lamb Kofta Curry",
    description: "Minced lamb meatballs in a rich gravy",
    price: 359,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    category: "Main Course",
    preparationTime: 35,
    popular: false,
    tags: ["non-vegetarian", "lamb", "rich"],
    complexity: 4
  },
  {
    id: "53",
    name: "Jalebi",
    description: "Deep-fried pretzel-shaped sweets soaked in sugar syrup",
    price: 99,
    image: "https://images.unsplash.com/photo-1579370726983-8d58fd0f90fe?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 15,
    popular: true,
    tags: ["sweet", "dessert", "crispy"],
    complexity: 3
  },
  {
    id: "54",
    name: "Lamb Vindaloo",
    description: "Fiery hot lamb curry with vinegar and spices",
    price: 379,
    image: "https://images.unsplash.com/photo-1602343061678-049fa60369bc?w=800&h=600&fit=crop",
    category: "Goan",
    preparationTime: 40,
    popular: false,
    tags: ["non-vegetarian", "lamb", "very spicy"],
    complexity: 4
  },
  {
    id: "55",
    name: "Aloo Tikki Chaat",
    description: "Spiced potato patties topped with yogurt, chutneys, and spices",
    price: 129,
    image: "https://images.unsplash.com/photo-1606755456600-d81ab3b2ffde?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 15,
    popular: true,
    tags: ["vegetarian", "chaat", "tangy"],
    complexity: 2
  },
  {
    id: "56",
    name: "Baingan Bharta",
    description: "Smoky eggplant mash with onions, tomatoes, and spices",
    price: 199,
    image: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: false,
    tags: ["vegetarian", "smoky", "healthy"],
    complexity: 3
  },
  {
    id: "57",
    name: "Mango Lassi",
    description: "Sweet yogurt drink with fresh mango pulp",
    price: 99,
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c563b56?w=800&h=600&fit=crop",
    category: "Beverages",
    preparationTime: 5,
    popular: true,
    tags: ["vegetarian", "sweet", "refreshing"],
    complexity: 1
  },
  {
    id: "58",
    name: "Methi Malai Matar",
    description: "Green peas and fenugreek leaves in a creamy sauce",
    price: 229,
    image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 25,
    popular: false,
    tags: ["vegetarian", "creamy", "aromatic"],
    complexity: 3
  },
  {
    id: "59",
    name: "Chicken Lollipop",
    description: "Spicy, deep-fried chicken winglets in a lollipop shape",
    price: 299,
    image: "https://images.unsplash.com/photo-1562067541-a9295c563b56?w=800&h=600&fit=crop",
    category: "Indo-Chinese",
    preparationTime: 25,
    popular: true,
    tags: ["non-vegetarian", "chicken", "indo-chinese"],
    complexity: 3
  },
  {
    id: "60",
    name: "Kachori",
    description: "Deep-fried bread stuffed with spiced lentils or peas",
    price: 69,
    image: "https://images.unsplash.com/photo-1626074953757-440fa792ec70?w=800&h=600&fit=crop",
    category: "Snacks",
    preparationTime: 15,
    popular: false,
    tags: ["vegetarian", "snack", "crispy"],
    complexity: 3
  },
  {
    id: "61",
    name: "Coconut Chutney",
    description: "Fresh coconut ground with green chilies, ginger, and spices",
    price: 49,
    image: "https://images.unsplash.com/photo-1589647363735-f4a7d9a9a160?w=800&h=600&fit=crop",
    category: "Sides",
    preparationTime: 5,
    popular: false,
    tags: ["vegetarian", "condiment", "south indian"],
    complexity: 1
  },
  {
    id: "62",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids balls soaked in rose-flavored sugar syrup",
    price: 99,
    image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 10,
    popular: true,
    tags: ["sweet", "dessert", "classic"],
    complexity: 2
  },
  {
    id: "63",
    name: "Chicken 65",
    description: "Spicy, deep-fried chicken chunks with curry leaves",
    price: 289,
    image: "https://images.unsplash.com/photo-1603894584212-958db74cb9a3?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 20,
    popular: true,
    tags: ["non-vegetarian", "chicken", "spicy"],
    complexity: 3
  },
  {
    id: "64",
    name: "Masala Chai",
    description: "Spiced Indian tea with milk",
    price: 49,
    image: "https://images.unsplash.com/photo-1594631054726-e6ebee5b94ba?w=800&h=600&fit=crop",
    category: "Beverages",
    preparationTime: 5,
    popular: true,
    tags: ["vegetarian", "hot", "comforting"],
    complexity: 1
  },
  {
    id: "65",
    name: "Dhokla",
    description: "Steamed, savory cake made from fermented rice and chickpea flour",
    price: 149,
    image: "https://images.unsplash.com/photo-1606856110002-d0991ce78250?w=800&h=600&fit=crop",
    category: "Snacks",
    preparationTime: 18,
    popular: false,
    tags: ["vegetarian", "gujarati", "healthy"],
    complexity: 3
  },
  {
    id: "66",
    name: "Mysore Pak",
    description: "Rich, dense sweet made from ghee, sugar, and gram flour",
    price: 129,
    image: "https://images.unsplash.com/photo-1531417658867-9585663effa5?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 12,
    popular: false,
    tags: ["sweet", "south indian", "dessert"],
    complexity: 2
  },
  {
    id: "67",
    name: "Chicken Reshmi Kebab",
    description: "Tender, creamy chicken kebabs marinated in yogurt and spices",
    price: 319,
    image: "https://images.unsplash.com/photo-1535400255456-148d6d075b40?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 30,
    popular: true,
    tags: ["non-vegetarian", "chicken", "kebab"],
    complexity: 3
  },
  {
    id: "68",
    name: "Kathi Roll",
    description: "Flatbread wrap filled with spiced meat, eggs, or vegetables",
    price: 189,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop",
    category: "Street Food",
    preparationTime: 15,
    popular: true,
    tags: ["versatile", "roll", "kolkata"],
    complexity: 2
  },
  {
    id: "69",
    name: "Gajar Ka Halwa",
    description: "Sweet carrot pudding with nuts and cardamom",
    price: 159,
    image: "https://images.unsplash.com/photo-1603384204203-ef027b5c044d?w=800&h=600&fit=crop",
    category: "Desserts",
    preparationTime: 30,
    popular: true,
    tags: ["sweet", "dessert", "winter"],
    complexity: 2
  },
  {
    id: "70",
    name: "Aloo Gobi Matar",
    description: "Potato, cauliflower, and green pea curry",
    price: 199,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?w=800&h=600&fit=crop",
    category: "Vegetable Dishes",
    preparationTime: 20,
    popular: false,
    tags: ["vegetarian", "homestyle", "comfort"],
    complexity: 2
  },
  {
    id: "71",
    name: "Fish Tikka",
    description: "Marinated fish chunks grilled to perfection",
    price: 329,
    image: "https://images.unsplash.com/photo-1582487809640-076cea513553?w=800&h=600&fit=crop",
    category: "Starters",
    preparationTime: 25,
    popular: false,
    tags: ["non-vegetarian", "fish", "tandoori"],
    complexity: 3
  },
  {
    id: "72",
    name: "Paneer Bhurji",
    description: "Scrambled cottage cheese with spices and vegetables",
    price: 219,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    category: "North Indian",
    preparationTime: 15,
    popular: false,
    tags: ["vegetarian", "paneer", "quick"],
    complexity: 2
  }
];

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

export function getRecommendations(item: MenuItem): MenuItem[] {
  const recommendations = menuItems
    .filter(menuItem => menuItem.id !== item.id)
    .map(menuItem => {
      let score = 0;
      
      if (menuItem.category === item.category) score += 5;
      
      const matchingTags = menuItem.tags.filter(tag => item.tags.includes(tag)).length;
      score += matchingTags * 2;
      
      const priceDiff = Math.abs(menuItem.price - item.price);
      if (priceDiff < 50) score += 3;
      else if (priceDiff < 100) score += 2;
      else if (priceDiff < 150) score += 1;
      
      if (menuItem.popular === item.popular) score += 1;
      
      return { menuItem, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.menuItem)
    .slice(0, 2);
  
  return recommendations;
}

export function calculateEstimatedTime(items: CartItem[]): number {
  if (items.length === 0) return 0;
  
  let totalPrepTime = 0;
  
  items.forEach(item => {
    const complexityFactor = item.complexity || 3;
    const adjustedItemTime = item.preparationTime * (1 + (complexityFactor - 3) / 10);
    
    const firstItemTime = adjustedItemTime;
    
    const additionalQuantityTime = item.quantity > 1 ? 
      (item.quantity - 1) * (adjustedItemTime * 0.4) : 0;
    
    totalPrepTime += firstItemTime + additionalQuantityTime;
  });
  
  const uniqueCategories = new Set(items.map(item => item.category)).size;
  
  const categoryEfficiencyFactor = Math.max(0.6, 1 - (uniqueCategories - 1) * 0.1);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderSizeFactor = Math.min(1.3, 1 + (totalItems - 1) * 0.03);
  
  const finalPrepTime = Math.round(totalPrepTime * categoryEfficiencyFactor * orderSizeFactor);
  
  return finalPrepTime;
}

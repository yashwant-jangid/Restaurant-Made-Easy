
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, MenuItem, calculateEstimatedTime } from '@/lib/data';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  total: number;
  estimatedTime: number;
  tableNumber: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TABLE'; payload: number };

const initialState: CartState = {
  items: [],
  total: 0,
  estimatedTime: 0,
  tableNumber: 1,
};

const calculateTotal = (items: CartItem[]): number => {
  return parseFloat(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const total = calculateTotal(newItems);
      const estimatedTime = calculateEstimatedTime(newItems);

      return { ...state, items: newItems, total, estimatedTime };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = calculateTotal(newItems);
      const estimatedTime = calculateEstimatedTime(newItems);

      return { ...state, items: newItems, total, estimatedTime };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      let newItems: CartItem[];

      if (quantity <= 0) {
        newItems = state.items.filter(item => item.id !== id);
      } else {
        newItems = state.items.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
      }

      const total = calculateTotal(newItems);
      const estimatedTime = calculateEstimatedTime(newItems);

      return { ...state, items: newItems, total, estimatedTime };
    }

    case 'CLEAR_CART':
      return { ...initialState, tableNumber: state.tableNumber };

    case 'SET_TABLE':
      return { ...state, tableNumber: action.payload };

    default:
      return state;
  }
};

interface CartContextType {
  cart: CartState;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setTableNumber: (table: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`Added ${item.name} to your order`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setTableNumber = (table: number) => {
    dispatch({ type: 'SET_TABLE', payload: table });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, setTableNumber }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

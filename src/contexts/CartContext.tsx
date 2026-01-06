import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Food {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface CartItem {
  id: string;
  food: Food;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (food: Food) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, food_id, foods(id, name, price, image_url)')
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        food: {
          id: item.foods.id,
          name: item.foods.name,
          price: item.foods.price,
          image_url: item.foods.image_url,
        },
      }));

      setItems(cartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (food: Food) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      const existingItem = items.find((item) => item.food.id === food.id);

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            food_id: food.id,
            quantity: 1,
          });

        if (error) throw error;
        await fetchCart();
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.food.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

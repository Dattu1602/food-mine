import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface CartItem {
  id: string;
  food: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
  quantity: number;
}

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
      <img
        src={item.food.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
        alt={item.food.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.food.name}</h3>
        <p className="text-orange-500 font-semibold">${item.food.price.toFixed(2)}</p>

        <div className="flex items-center space-x-3 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <X size={20} />
        </button>
        <span className="font-bold text-gray-900">
          ${(item.food.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

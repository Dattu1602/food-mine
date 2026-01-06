import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CartItemCard } from './CartItemCard';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, getTotalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some delicious items to get started!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t p-6 space-y-4">
              <button
                onClick={clearCart}
                className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
              >
                <Trash2 size={18} />
                <span>Clear Cart</span>
              </button>

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-orange-500">${getTotalPrice().toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  onCheckout();
                  onClose();
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

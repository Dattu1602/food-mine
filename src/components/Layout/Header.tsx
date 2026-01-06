import { ShoppingCart, User, LogOut, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  cartItemCount: number;
  onAuthClick: () => void;
  onCartClick: () => void;
  onProfileClick: () => void;
}

export function Header({ cartItemCount, onAuthClick, onCartClick, onProfileClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <UtensilsCrossed className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FoodMine</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <User size={24} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState, useMemo } from 'react';
import { Header } from './components/Layout/Header';
import { SearchBar } from './components/Food/SearchBar';
import { CategoryFilter } from './components/Food/CategoryFilter';
import { FoodCard } from './components/Food/FoodCard';
import { CartSidebar } from './components/Cart/CartSidebar';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { ProfilePage } from './components/Profile/ProfilePage';
import { AuthModal } from './components/Auth/AuthModal';
import { useCart } from './contexts/CartContext';
import { useFoods } from './hooks/useFoods';
import { useCategories } from './hooks/useCategories';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuth();
  const { foods, loading: foodsLoading } = useFoods();
  const { categories, loading: categoriesLoading } = useCategories();
  const { addToCart, getTotalItems } = useCart();

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === null || food.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [foods, searchQuery, selectedCategory]);

  const handleAddToCart = async (food: any) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    await addToCart(food);
  };

  const handleCheckoutSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={getTotalItems()}
        onAuthClick={() => setIsAuthOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Order Your Favorite Food
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Delicious meals delivered to your door in minutes
          </p>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {!categoriesLoading && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {foodsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading delicious foods...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No foods found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          if (!user) {
            setIsAuthOpen(true);
            return;
          }
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <ProfilePage
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="login"
      />

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-in">
          Order placed successfully!
        </div>
      )}
    </div>
  );
}

export default App;

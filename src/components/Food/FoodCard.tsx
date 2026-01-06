import { Star, Clock, Plus } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  cook_time: string | null;
  origins: string[] | null;
  rating: number;
  is_favorite: boolean;
}

interface FoodCardProps {
  food: Food;
  onAddToCart: (food: Food) => void;
}

export function FoodCard({ food, onAddToCart }: FoodCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {food.is_favorite && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{food.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {food.cook_time && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{food.cook_time}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>{food.rating.toFixed(1)}</span>
            </div>
          </div>
          {food.origins && food.origins.length > 0 && (
            <span className="text-xs text-gray-500 italic">{food.origins[0]}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-500">${food.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(food)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

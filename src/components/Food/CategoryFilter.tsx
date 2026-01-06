interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all ${
          selectedCategory === null
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

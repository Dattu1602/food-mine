import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Food {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  cook_time: string | null;
  origins: string[] | null;
  is_favorite: boolean;
  rating: number;
  tags: string[] | null;
  created_at: string;
}

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;
      setFoods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  return { foods, loading, error, refetch: fetchFoods };
}

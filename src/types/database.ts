export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image_url?: string | null;
          created_at?: string;
        };
      };
      foods: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category_id?: string | null;
          cook_time?: string | null;
          origins?: string[] | null;
          is_favorite?: boolean;
          rating?: number;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category_id?: string | null;
          cook_time?: string | null;
          origins?: string[] | null;
          is_favorite?: boolean;
          rating?: number;
          tags?: string[] | null;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          food_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_price: number;
          status: string;
          name: string;
          address: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_price: number;
          status?: string;
          name: string;
          address: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_price?: number;
          status?: string;
          name?: string;
          address?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          food_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          food_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          address: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          address?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          address?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

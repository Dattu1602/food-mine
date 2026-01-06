/*
  # FoodMine - Food Ordering Platform Schema

  ## Overview
  Complete database schema for a food ordering web application with user authentication,
  shopping cart, and order management.

  ## New Tables

  ### 1. categories
  Stores food categories (e.g., Pizza, Burgers, Desserts)
  - `id` (uuid, primary key)
  - `name` (text, unique, not null) - Category name
  - `image_url` (text) - Category image
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. foods
  Stores food items available for ordering
  - `id` (uuid, primary key)
  - `name` (text, not null) - Food item name
  - `description` (text) - Food description
  - `price` (numeric, not null) - Food price
  - `image_url` (text) - Food image
  - `category_id` (uuid, foreign key) - Links to categories
  - `cook_time` (text) - Estimated cooking time
  - `origins` (text[]) - Country origins
  - `is_favorite` (boolean) - Featured item flag
  - `rating` (numeric) - Average rating
  - `tags` (text[]) - Searchable tags
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. cart_items
  Stores items in user shopping carts
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `food_id` (uuid, foreign key) - Links to foods
  - `quantity` (integer, not null) - Item quantity
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. orders
  Stores user orders
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `total_price` (numeric, not null) - Order total
  - `status` (text, not null) - Order status
  - `name` (text, not null) - Delivery name
  - `address` (text, not null) - Delivery address
  - `created_at` (timestamptz) - Order timestamp

  ### 5. order_items
  Stores items within each order
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - Links to orders
  - `food_id` (uuid, foreign key) - Links to foods
  - `quantity` (integer, not null) - Item quantity
  - `price` (numeric, not null) - Item price at order time
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. user_profiles
  Extended user profile information
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `address` (text) - Default delivery address
  - `phone` (text) - Contact phone number
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with appropriate policies:
  
  #### categories & foods
  - Public read access (anyone can view)
  
  #### cart_items
  - Users can only view and manage their own cart items
  
  #### orders & order_items
  - Users can only view and create their own orders
  
  #### user_profiles
  - Users can only view and update their own profile

  ## Sample Data
  Includes sample categories and food items for demonstration
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  cook_time text,
  origins text[],
  is_favorite boolean DEFAULT false,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  tags text[],
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, food_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_price numeric NOT NULL CHECK (total_price >= 0),
  status text NOT NULL DEFAULT 'pending',
  name text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  address text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for foods (public read)
CREATE POLICY "Anyone can view foods"
  ON foods FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert sample categories
INSERT INTO categories (name, image_url) VALUES
  ('Pizza', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'),
  ('Burgers', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'),
  ('Asian', 'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg'),
  ('Pasta', 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'),
  ('Salads', 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg'),
  ('Desserts', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg')
ON CONFLICT (name) DO NOTHING;

-- Insert sample foods
INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Margherita Pizza',
  'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
  12.99,
  'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
  id,
  '20-30 mins',
  ARRAY['Italian'],
  true,
  4.5,
  ARRAY['vegetarian', 'popular']
FROM categories WHERE name = 'Pizza'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Pepperoni Pizza',
  'Traditional pizza topped with pepperoni and mozzarella cheese',
  14.99,
  'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg',
  id,
  '20-30 mins',
  ARRAY['Italian'],
  true,
  4.7,
  ARRAY['popular', 'spicy']
FROM categories WHERE name = 'Pizza'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Classic Cheeseburger',
  'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
  10.99,
  'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
  id,
  '15-20 mins',
  ARRAY['American'],
  true,
  4.6,
  ARRAY['popular']
FROM categories WHERE name = 'Burgers'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Bacon Burger',
  'Premium burger with crispy bacon, cheddar cheese, and BBQ sauce',
  13.99,
  'https://images.pexels.com/photos/580612/pexels-photo-580612.jpeg',
  id,
  '15-20 mins',
  ARRAY['American'],
  false,
  4.4,
  ARRAY['popular']
FROM categories WHERE name = 'Burgers'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Chicken Fried Rice',
  'Wok-fried rice with chicken, vegetables, and soy sauce',
  11.99,
  'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg',
  id,
  '15-20 mins',
  ARRAY['Chinese'],
  false,
  4.3,
  ARRAY['popular']
FROM categories WHERE name = 'Asian'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Pad Thai',
  'Thai stir-fried noodles with shrimp, peanuts, and tamarind sauce',
  13.99,
  'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg',
  id,
  '20-25 mins',
  ARRAY['Thai'],
  true,
  4.8,
  ARRAY['popular', 'spicy']
FROM categories WHERE name = 'Asian'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Spaghetti Carbonara',
  'Classic Italian pasta with eggs, bacon, and parmesan cheese',
  12.99,
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
  id,
  '20-25 mins',
  ARRAY['Italian'],
  true,
  4.6,
  ARRAY['popular']
FROM categories WHERE name = 'Pasta'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Penne Arrabiata',
  'Spicy tomato sauce with garlic and chili peppers over penne pasta',
  11.99,
  'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
  id,
  '15-20 mins',
  ARRAY['Italian'],
  false,
  4.2,
  ARRAY['vegetarian', 'spicy']
FROM categories WHERE name = 'Pasta'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Caesar Salad',
  'Fresh romaine lettuce with caesar dressing, croutons, and parmesan',
  8.99,
  'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
  id,
  '10 mins',
  ARRAY['American'],
  false,
  4.1,
  ARRAY['healthy', 'vegetarian']
FROM categories WHERE name = 'Salads'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Greek Salad',
  'Mediterranean salad with feta cheese, olives, cucumbers, and tomatoes',
  9.99,
  'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
  id,
  '10 mins',
  ARRAY['Greek'],
  false,
  4.3,
  ARRAY['healthy', 'vegetarian']
FROM categories WHERE name = 'Salads'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Chocolate Cake',
  'Rich and moist chocolate cake with chocolate frosting',
  6.99,
  'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
  id,
  '5 mins',
  ARRAY['American'],
  true,
  4.9,
  ARRAY['popular', 'sweet']
FROM categories WHERE name = 'Desserts'
ON CONFLICT DO NOTHING;

INSERT INTO foods (name, description, price, image_url, category_id, cook_time, origins, is_favorite, rating, tags)
SELECT 
  'Cheesecake',
  'Creamy New York style cheesecake with graham cracker crust',
  7.99,
  'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
  id,
  '5 mins',
  ARRAY['American'],
  true,
  4.7,
  ARRAY['popular', 'sweet']
FROM categories WHERE name = 'Desserts'
ON CONFLICT DO NOTHING;
/*
  # Family Management App Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text) - Family member name
      - `avatar_url` (text) - Profile picture URL
      - `created_at` (timestamp)
    
    - `home_notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text) - Note title
      - `content` (text) - Note content
      - `category` (text) - Category like 'general', 'maintenance', 'bills', etc.
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recipes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text) - Recipe name in Myanmar
      - `cuisine_type` (text) - Cuisine category
      - `ingredients` (text) - Ingredients list
      - `instructions` (text) - Cooking instructions
      - `prep_time` (integer) - Preparation time in minutes
      - `cook_time` (integer) - Cooking time in minutes
      - `servings` (integer) - Number of servings
      - `image_url` (text) - Recipe image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `shopping_lists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text) - Shopping list title
      - `week_date` (date) - Week planning date
      - `is_completed` (boolean) - Completion status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `shopping_items`
      - `id` (uuid, primary key)
      - `shopping_list_id` (uuid, references shopping_lists)
      - `item_name` (text) - Item name
      - `quantity` (text) - Quantity
      - `is_checked` (boolean) - Checked status
      - `created_at` (timestamp)
    
    - `chat_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `message` (text) - User message
      - `response` (text) - AI response
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Family members can view each other's data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all family profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR (SELECT auth.jwt() ->> 'sub') = id::text);

-- Create home_notes table
CREATE TABLE IF NOT EXISTS home_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE home_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view all home notes"
  ON home_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own home notes"
  ON home_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own home notes"
  ON home_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own home notes"
  ON home_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  cuisine_type text DEFAULT 'general',
  ingredients text NOT NULL,
  instructions text NOT NULL,
  prep_time integer DEFAULT 0,
  cook_time integer DEFAULT 0,
  servings integer DEFAULT 1,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view all recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  week_date date DEFAULT CURRENT_DATE,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view all shopping lists"
  ON shopping_lists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert shopping lists"
  ON shopping_lists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family can update shopping lists"
  ON shopping_lists FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own shopping lists"
  ON shopping_lists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create shopping_items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE NOT NULL,
  item_name text NOT NULL,
  quantity text DEFAULT '1',
  is_checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view shopping items"
  ON shopping_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert shopping items"
  ON shopping_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Family can update shopping items"
  ON shopping_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Family can delete shopping items"
  ON shopping_items FOR DELETE
  TO authenticated
  USING (true);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history"
  ON chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
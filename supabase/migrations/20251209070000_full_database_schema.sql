-- Full Database Schema for Family Management Application
-- Migration file for Supabase CLI

-- Create profiles table for user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create home_notes table for home management notes
CREATE TABLE IF NOT EXISTS public.home_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table for cooking recipes
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    cuisine_type TEXT DEFAULT 'myanmar',
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time INTEGER DEFAULT 0,
    cook_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table for shopping list management
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    week_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_items table for items in shopping lists
CREATE TABLE IF NOT EXISTS public.shopping_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    quantity TEXT DEFAULT '',
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table is created in a separate migration file
-- Skipping creation here to avoid conflicts

-- Create chat_history table for AI assistant chat history
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;
-- RLS for expenses table is enabled in a separate migration file
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for home_notes
CREATE POLICY "Users can view their own notes" ON public.home_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON public.home_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.home_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.home_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for recipes
CREATE POLICY "Users can view all recipes" ON public.recipes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own recipes" ON public.recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON public.recipes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON public.recipes
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" ON public.shopping_lists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping lists" ON public.shopping_lists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" ON public.shopping_lists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" ON public.shopping_lists
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for shopping_items
CREATE POLICY "Users can view items from their shopping lists" ON public.shopping_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE shopping_lists.id = shopping_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert items to their shopping lists" ON public.shopping_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE shopping_lists.id = shopping_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in their shopping lists" ON public.shopping_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE shopping_lists.id = shopping_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items from their shopping lists" ON public.shopping_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE shopping_lists.id = shopping_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

-- Policies for expenses table are created in a separate migration file
-- Skipping creation here to avoid conflicts

-- Create policies for chat_history
CREATE POLICY "Users can view their own chat history" ON public.chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON public.chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history" ON public.chat_history
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for recipe images
CREATE POLICY "Anyone can upload recipe images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can view recipe images" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_home_notes_updated_at
    BEFORE UPDATE ON public.home_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON public.shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
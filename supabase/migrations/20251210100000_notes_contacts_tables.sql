-- Create tables for Notes & Contacts feature
-- This migration creates the necessary tables for the Notes & Contacts section

-- Create notes table
create table if not exists public.notes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    content text,
    category text,
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contacts table
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    role text,
    phone text,
    email text,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_category on public.notes(category);
create index if not exists idx_contacts_user_id on public.contacts(user_id);
create index if not exists idx_contacts_category on public.contacts(category);

-- Set up Row Level Security (RLS)
alter table public.notes enable row level security;
alter table public.contacts enable row level security;

-- Create policies for notes
create policy "Users can view their own notes" on public.notes
    for select using (auth.uid() = user_id);

create policy "Users can insert their own notes" on public.notes
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes" on public.notes
    for update using (auth.uid() = user_id);

create policy "Users can delete their own notes" on public.notes
    for delete using (auth.uid() = user_id);

-- Create policies for contacts
create policy "Users can view their own contacts" on public.contacts
    for select using (auth.uid() = user_id);

create policy "Users can insert their own contacts" on public.contacts
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own contacts" on public.contacts
    for update using (auth.uid() = user_id);

create policy "Users can delete their own contacts" on public.contacts
    for delete using (auth.uid() = user_id);

-- Grant permissions to authenticated users
grant usage on schema public to authenticated;
grant all on table public.notes to authenticated;
grant all on table public.contacts to authenticated;
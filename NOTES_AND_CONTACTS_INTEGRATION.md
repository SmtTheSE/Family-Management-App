# Notes & Contacts Integration Documentation

## Overview
This document explains how to implement and use the fully integrated Notes & Contacts feature with Supabase backend support. This feature replaces the previous static implementation with a fully functional CRUD system backed by a PostgreSQL database.

## Database Migration

### Migration File
A new migration file has been created at:
`supabase/migrations/20251210100000_notes_contacts_tables.sql`

This migration creates two tables:
1. `public.notes` - Stores user notes with title, content, category, and tags
2. `public.contacts` - Stores contact information including name, role, phone, email, and category

### Tables Structure

#### Notes Table
```sql
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
```

#### Contacts Table
```sql
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
```

### Row Level Security (RLS)
Both tables have RLS enabled with policies that ensure users can only access their own data:
- Users can view their own notes/contacts
- Users can insert their own notes/contacts
- Users can update their own notes/contacts
- Users can delete their own notes/contacts

### Sample Data
The migration includes sample data with Myanmar language categories:
- ကျန်းမာရေး (Health)
- စျေးဝယ် (Shopping)
- မိသားစု (Family)
- အထွေထွေ (General)

## Component Implementation

### File Location
The component is implemented in:
`src/components/NotesAndContacts.tsx`

### Key Features
1. **Full CRUD Operations**:
   - Create new notes and contacts
   - Read/display existing notes and contacts
   - Update/edit existing notes and contacts
   - Delete notes and contacts

2. **Real-time Data Loading**:
   - Automatically loads user data on component mount
   - Refreshes data after any CRUD operation

3. **Search Functionality**:
   - Search across notes by title, content, category, and tags
   - Search across contacts by name, role, and category

4. **Category Management**:
   - Predefined categories in Myanmar language:
     - ကျန်းမာရေး (Health)
     - မိသားစု (Family)
     - စျေးဝယ် (Shopping)
     - အထွေထွေ (General)
   - Visual category counters

5. **Responsive UI**:
   - Works on mobile and desktop devices
   - Modal forms for data entry
   - Clean Apple-inspired design with Myanmar language throughout

### Supabase Integration Points

1. **Data Loading**:
   ```typescript
   const { data, error } = await supabase
     .from('notes')
     .select('*')
     .eq('user_id', user.id)
     .order('created_at', { ascending: false });
   ```

2. **Creating Records**:
   ```typescript
   const { error } = await supabase
     .from('notes')
     .insert({
       user_id: user.id,
       title: noteTitle,
       content: noteContent,
       category: noteCategory,
       tags: tagsArray
     });
   ```

3. **Updating Records**:
   ```typescript
   const { error } = await supabase
     .from('notes')
     .update({
       title: noteTitle,
       content: noteContent,
       // ... other fields
     })
     .eq('id', editingNote.id)
     .eq('user_id', user.id);
   ```

4. **Deleting Records**:
   ```typescript
   const { error } = await supabase
     .from('notes')
     .delete()
     .eq('id', id)
     .eq('user_id', user.id);
   ```

## Deployment Instructions

### 1. Apply Database Migration
Run the following command to apply the migration:
```bash
supabase db push
```

Alternatively, you can copy and paste the SQL from the migration file into the Supabase SQL editor.

### 2. Restart Your Development Server
If you're running the development server, restart it to ensure the new tables are recognized:
```bash
npm run dev
```

### 3. Test the Feature
1. Navigate to the "မှတ်စု & ဆက်သွယ်ရန်" (Notes & Contacts) section
2. Try adding a new note and contact
3. Verify that data persists after page refresh
4. Test editing and deleting functionality

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**:
   - Ensure RLS policies are correctly applied
   - Check that the user is properly authenticated

2. **Data Not Loading**:
   - Verify the migration has been applied
   - Check browser console for JavaScript errors
   - Confirm the user is logged in

3. **Insert/Update Failures**:
   - Check that all required fields are filled
   - Verify database constraints in the migration file

### Verifying Migration Success

You can verify that the migration was successful by checking the Supabase dashboard:
1. Go to your Supabase project
2. Navigate to Table Editor
3. You should see both `notes` and `contacts` tables
4. Each table should have the columns defined in the migration

## Future Enhancements

1. **Advanced Filtering**:
   - Add more sophisticated filtering options
   - Implement tag-based filtering

2. **Data Export**:
   - Add CSV/Excel export functionality
   - Implement PDF generation for printing

3. **Contact Photos**:
   - Integrate with Supabase Storage for contact avatars

4. **Note Attachments**:
   - Allow attaching files to notes
   - Support for images and documents

5. **Sharing Features**:
   - Enable sharing notes with other users
   - Implement contact group functionality

6. **Reminders**:
   - Add notification system for notes
   - Implement recurring reminders

This implementation provides a solid foundation for a fully functional Notes & Contacts management system that integrates seamlessly with the rest of your Supabase-powered application, with full Myanmar language support.
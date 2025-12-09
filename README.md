# မိသားစု စီမံခန့်ခွဲမှု - Family Management App

A comprehensive family management web application built with Myanmar language support. This app helps families organize their home, manage cooking recipes, create shopping lists, track expenses, and get AI-powered assistance.

## Features

### 1. Home Management (အိမ်စီမံခန့်ခွဲမှု)
- Create and manage notes for everything at home
- Categorize notes: General, Maintenance, Bills, Tasks, Important
- View, edit, and delete notes
- All family members can see each other's notes

### 2. Cooking Recipes (ချက်ပြုတ်နည်းများ)
- Add recipes from different cuisines (Myanmar, Thai, Indian, Western, Japanese, Korean, etc.)
- Search recipes by name
- Filter by cuisine type
- Track prep time, cook time, and servings
- Add ingredients and cooking instructions
- Optional recipe images

### 3. Shopping Lists (စျေးဝယ်စာရင်း)
- Create weekly shopping lists
- Add items with quantities
- Check off items as you shop
- Track completion status
- Family members can collaborate on lists

### 4. Expense Tracker (စာရင်းကုန်ကျမှုများ)
- Track family expenses
- Categorize spending
- View expense history
- Analyze spending patterns

### 5. AI Assistant (AI အကူအညီ)
- Myanmar language speech recognition
- Voice input support (microphone)
- ChatGPT-powered responses in Myanmar language
- Ask questions about home management, recipes, or general queries
- Chat history saved for reference

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **AI**: OpenAI GPT-3.5 Turbo
- **Speech Recognition**: Web Speech API (Myanmar language)

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- Supabase account
- OpenAI API key

### 2. Installation

```bash
npm install
```

### 3. Environment Configuration

The `.env` file already contains your Supabase credentials. You need to add your OpenAI API key as a Supabase secret (not in the .env file):

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to your Supabase project secrets:
   - Go to your Supabase Dashboard
   - Navigate to Project Settings > Edge Functions > Secrets
   - Add a new secret: `OPENAI_API_KEY` with your OpenAI API key value

### 4. Database Setup

The database schema has already been created with the following tables:
- `profiles` - User profiles
- `home_notes` - Home management notes
- `recipes` - Cooking recipes
- `shopping_lists` - Shopping list headers
- `shopping_items` - Individual shopping items
- `chat_history` - AI chat conversation history
- `expenses` - Family expense tracking

All tables have Row Level Security (RLS) enabled for data privacy and family sharing.

### 5. Supabase Functions Setup

Deploy the AI assistant function:

```bash
supabase functions deploy chat-with-openai --project-ref YOUR_PROJECT_ID
```

### 6. Authentication

The app uses Supabase email/password authentication:
- Family members can sign up with their email
- Each member gets their own profile
- All data is shared within the family

### 7. Running the App

```bash
npm run dev
```

The app will be available at the local development URL.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

The application can be deployed for free to platforms like:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Firebase Hosting

## Features Details

### Myanmar Language Support
- All UI text is in Myanmar language
- Speech recognition supports Myanmar language (my-MM)
- AI assistant responds in Myanmar language

### Speech Recognition
The app uses the Web Speech API for voice input:
- Works in modern browsers (Chrome, Edge, Safari)
- Supports Myanmar language (my-MM)
- Click the microphone button to start speaking
- Your speech will be converted to text automatically

### AI Assistant
The AI assistant uses ChatGPT to help with:
- Home management questions
- Cooking advice and recipe suggestions
- Shopping list recommendations
- General family queries

All AI requests are processed through a secure Supabase Edge Function that protects your OpenAI API key.

## Browser Support

- Chrome/Edge: Full support including speech recognition
- Firefox: All features except speech recognition
- Safari: Full support including speech recognition (iOS 14.5+)

## Security

- All data is protected with Row Level Security (RLS)
- Users can only access their own family's data
- API keys are stored securely in Supabase Edge Functions
- Authentication required for all features
- OpenAI API key is never exposed to the client

## Notes

- Speech recognition may not work on all browsers
- OpenAI API usage will incur costs based on your usage
- All family members share the same data (notes, recipes, shopping lists, expenses)
- Chat history is private to each user
- OpenAI API key must be set as a Supabase secret, not in client-side environment variables

## Support

For issues or questions, please refer to the documentation:
- Supabase: https://supabase.com/docs
- OpenAI: https://platform.openai.com/docs
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
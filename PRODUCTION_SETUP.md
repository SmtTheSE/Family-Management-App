# Production Setup Guide

This guide walks you through setting up the Family Management App for production deployment.

## Prerequisites

1. Node.js (v16 or higher)
2. A Supabase account
3. An OpenAI account and API key
4. A deployment platform account (Vercel, Netlify, etc.)

## Step 1: Set up Supabase

1. Create a new Supabase project at https://app.supabase.com/
2. Note your Project URL and anon key from Project Settings > API
3. Enable email authentication:
   - Go to Authentication > Providers
   - Enable Email provider
4. Run database migrations:
   - Option 1: Using Supabase CLI (recommended)
     ```bash
     npm install -g supabase
     supabase link --project-ref YOUR_PROJECT_ID
     supabase db push
     ```
   - Option 2: Manually copy/paste SQL files into the Supabase SQL Editor
5. Create the recipe images storage bucket:
   - Go to Storage > Buckets
   - Create a new bucket named `recipe-images`
   - Set the bucket to public
6. Deploy Supabase Edge Functions:
   ```bash
   supabase functions deploy chat-with-openai --project-ref YOUR_PROJECT_ID
   ```

## Step 2: Configure Environment Variables

Create a `.env.production` file with your configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

On your deployment platform, set these as environment variables rather than including them in your code.

**Important:** Do NOT include your OpenAI API key in client-side environment variables. Instead, add it as a Supabase secret:

```bash
supabase secrets set OPENAI_API_KEY=your_actual_openai_api_key
```

## Step 3: Set up OpenAI

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to your Supabase project secrets (as shown above)

## Step 4: Build for Production

Run the build command:

```bash
npm run build
```

This generates optimized files in the `dist` directory.

## Step 5: Deploy

Choose one of the deployment options:

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Sign up at https://vercel.com
3. Create a new project and import your repository
4. Configure environment variables in the project settings
5. Deploy!

### Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Sign up at https://netlify.com
3. Create a new site from Git
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Set environment variables in the site settings
6. Deploy!

## Step 6: Configure Redirects (Important for SPA)

For proper routing, you need to configure redirects to send all requests to index.html.

### Vercel

Create a `vercel.json` file in your project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify

Create a `_redirects` file in your `public` directory:

```
/*    /index.html   200
```

### Firebase

In `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Step 7: Test Your Deployment

1. Visit your deployed site
2. Try signing up and logging in
3. Test all features (notes, recipes, shopping lists, expenses, AI assistant)
4. Verify that data persists and syncs correctly

## Troubleshooting Common Issues

### Blank Page After Navigation

This usually indicates a routing issue. Make sure your redirects are properly configured.

### API Connection Failures

Verify that:
1. Your Supabase URL and anon key are correct
2. Environment variables are properly set in your deployment platform
3. Your Supabase project is not paused or suspended

### Missing Database Tables

Ensure that you've run all database migrations:
1. Check that all SQL files in `supabase/migrations` have been executed
2. Verify that the `expenses` table exists in your database

### Authentication Issues

1. Make sure email authentication is enabled in Supabase
2. Check that your redirect URLs are configured correctly in Supabase auth settings

### AI Assistant Not Working

1. Make sure you've deployed the Supabase Edge Function:
   ```bash
   supabase functions deploy chat-with-openai
   ```
2. Verify that you've set the OPENAI_API_KEY as a Supabase secret
3. Check the function logs in the Supabase Dashboard for errors

## Performance Optimization Tips

1. Enable gzip compression on your hosting platform
2. Use a CDN for global distribution
3. Set appropriate cache headers for static assets
4. Consider lazy loading for images and components

## Monitoring and Maintenance

1. Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
2. Monitor your Supabase usage to stay within free tier limits
3. Regularly update dependencies
4. Monitor OpenAI API usage and costs

## Backup Strategy

1. Regularly export your Supabase database
2. Store backups in a secure location
3. Test restoration procedures periodically

## Scaling Considerations

If your app grows beyond the free tier:
1. Supabase offers affordable paid plans
2. Most deployment platforms offer scalable infrastructure
3. Consider caching strategies for frequently accessed data
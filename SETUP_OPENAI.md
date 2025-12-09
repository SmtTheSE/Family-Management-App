# OpenAI Setup Guide

This guide explains how to properly set up OpenAI integration for the AI Assistant feature using Supabase Edge Functions to protect your API key.

## Important Security Notice

**Never put your OpenAI API key in client-side environment variables (those prefixed with `VITE_`).** Doing so would expose your key to the public and could result in unauthorized usage and unexpected charges.

Instead, we'll use Supabase Edge Functions as a secure proxy to protect your API key.

## Setup Process

### 1. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Create a new secret key
4. Copy the key (you won't be able to see it again)

### 2. Add Your API Key as a Supabase Secret

Instead of putting the key in your `.env` file, add it as a Supabase secret:

Using the Supabase CLI:
```bash
supabase secrets set OPENAI_API_KEY=your_actual_openai_api_key_here
```

Or through the Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to Project Settings > Edge Functions > Secrets
3. Add a new secret with:
   - Name: `OPENAI_API_KEY`
   - Value: Your actual OpenAI API key

### 3. Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### 4. Find Your Supabase Project ID

1. Go to the [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. In the project dashboard URL, you'll see your project ID
   - The URL looks like: `https://app.supabase.com/project/[PROJECT-ID]`
   - Or you can find it in Project Settings > General details

### 5. Deploy the Edge Function

Navigate to your project directory and deploy the function:

```bash
cd /Users/sittminthar/Downloads/project
supabase functions deploy chat-with-openai --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

### 6. Test the Integration

After deploying, test the function with the provided test script:

```bash
node test-function-locally.js
```

Or test it manually using curl:

```bash
curl -X POST \
  YOUR_SUPABASE_URL/functions/v1/chat-with-openai \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello! မင်္ဂလာပါ။ သင်ဘယ်လိုအကူအညီပေးနိုင်ပါသလဲ?"}'
```

## How It Works

1. The frontend sends user messages to the Supabase Edge Function
2. The Edge Function securely accesses your OpenAI API key from Supabase secrets
3. The Edge Function calls the OpenAI API
4. The response is sent back to the frontend
5. The conversation is saved to the chat_history table

## Cost Management

OpenAI API usage incurs costs based on your usage. To manage costs:

1. Set up billing alerts in your OpenAI account
2. Monitor your usage in the OpenAI dashboard
3. Consider implementing rate limiting in production

## Troubleshooting

### Function Not Working

1. Check that you've deployed the function:
   ```bash
   supabase functions deploy chat-with-openai
   ```

2. Verify your OPENAI_API_KEY secret is set:
   ```bash
   supabase secrets list
   ```

3. Check the function logs:
   ```bash
   supabase functions logs chat-with-openai
   ```

### Getting "Unauthorized" Errors

1. Make sure your OPENAI_API_KEY is correctly set as a Supabase secret
2. Verify the key hasn't expired
3. Check that your OpenAI account has sufficient credits

### Getting "Rate Limit" Errors

1. You may be hitting OpenAI's rate limits
2. Consider implementing request throttling
3. Check your OpenAI account limits in the dashboard

## Updating the Function

If you need to update the Edge Function:

1. Modify `supabase/functions/chat-with-openai/index.ts`
2. Redeploy:
   ```bash
   supabase functions deploy chat-with-openai
   ```

## Alternative Models

The function currently uses `gpt-3.5-turbo`. To use a different model:

1. Edit `supabase/functions/chat-with-openai/index.ts`
2. Change the `model` parameter in the chat completion call
3. Redeploy the function

Note that different models have different pricing and capabilities.
# Troubleshooting the OpenAI Function

## Common Issues and Solutions

### 1. 500 Server Error
When you see a 500 error, it typically means there's an exception happening in your Edge Function. Some common causes:

#### Missing Environment Variables
Ensure that the OPENAI_API_KEY is set:
```bash
supabase secrets set OPENAI_API_KEY=your-api-key-here
```

Check if it's properly set:
```bash
supabase secrets list
```

#### Invalid Import Statements
Deno-based Edge Functions require specific import URLs. Make sure you're using the correct import for the OpenAI library:
```typescript
import OpenAI from "https://deno.land/x/openai@v4.29.0/mod.ts";
```

#### JSON Parsing Errors
Always wrap `_req.json()` in a try/catch block to handle invalid JSON gracefully:
```typescript
let requestData;
try {
  requestData = await _req.json();
} catch (parseError) {
  return new Response(
    JSON.stringify({ error: "Invalid JSON in request body" }),
    {
      status: 400,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    },
  );
}
```

### 2. OpenAI API Quota Issues
If you're getting a 429 error like "You exceeded your current quota", this indicates an issue with your OpenAI account:
- Check if your OpenAI account has exceeded its usage limits
- Verify that your payment method is valid and up-to-date
- Consider upgrading your OpenAI plan if you've reached free tier limits

### 3. Checking Function Logs
While local logging is limited, you can check function invocations in the Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to Functions > chat-with-openai
3. Check the invocation logs for error details

### 4. Testing Locally
You can test your function locally before deploying:
```bash
supabase functions serve --env-file .env.local
```

Create a `.env.local` file with your secrets:
```
OPENAI_API_KEY=your-api-key-here
```

### 5. CORS Issues
If you encounter CORS errors:
1. Ensure you're handling OPTIONS preflight requests
2. Add appropriate CORS headers to all responses:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// Include in response headers:
headers: { 
  "Content-Type": "application/json",
  ...corsHeaders
}
```

### 6. Debugging Tips
Add more detailed logging to help diagnose issues:
```typescript
console.log("Function invoked with:", { 
  method: _req.method,
  headers: Object.fromEntries(_req.headers.entries()),
});

// For detailed error logging:
catch (error) {
  console.error("Detailed error:", {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  // ... error response
}
```

## Recent Improvements Made
1. Added better JSON parsing error handling
2. Enhanced error responses with more details
3. Improved CORS handling
4. Better structured error logging

These changes should make the function more robust and easier to debug when issues occur.
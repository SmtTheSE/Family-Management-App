// Supabase Edge Function to proxy OpenAI API calls
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.29.0/mod.ts";

serve(async (_req) => {
  // Get the authorization header
  const authHeader = _req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Get the API key from Supabase secrets (not from client)
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured on server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Parse the request body
  const { message } = await _req.json();
  if (!message) {
    return new Response(
      JSON.stringify({ error: "Message is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that responds in Myanmar language (Burmese). Always respond in Myanmar language regardless of the input language.",
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
    });

    const response = chatCompletion.choices[0].message.content;

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(
      JSON.stringify({ error: "Error processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
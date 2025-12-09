// Test script for the Supabase Edge Function
// Run with: node test-openai-function.js

// Replace with your actual Supabase URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

async function testFunction() {
  try {
    console.log('Testing OpenAI Edge Function...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-with-openai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Hello! မင်္ဂလာပါ။ သင်ဘယ်လိုအကူအညီပေးနိုင်ပါသလဲ?' 
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Function test successful!');
      console.log('Response:', data.response);
    } else {
      console.log('❌ Function test failed:');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Test failed with exception:');
    console.log(error.message);
  }
}

testFunction();
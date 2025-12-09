// Script to test your Supabase Edge Function locally
// First, make sure you have your Supabase URL and anon key in the environment variables

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

async function testFunction() {
  try {
    console.log('Testing chat-with-openai function...');
    
    // Skip if credentials not set
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
      console.log('⚠️  Please set your Supabase credentials in the environment variables');
      console.log('   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      return;
    }
    
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
      console.log('Status:', response.status);
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Test failed with exception:');
    console.log(error.message);
  }
}

testFunction();
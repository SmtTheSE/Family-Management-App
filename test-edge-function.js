// Simple test script for the Supabase Edge Function
async function testFunction() {
  try {
    const response = await fetch(
      'https://oixtcofqjffaadkzrfrr.supabase.co/functions/v1/chat-with-openai',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peHRjb2ZxamZmYWFka3pyZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjE2MjksImV4cCI6MjA4MDgzNzYyOX0.bFbbuCtQ1th_M4es5ff53qpx0jmJKlZ7j2BiOLCF2oM',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, how are you?'
        })
      }
    );

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Test Error:', error);
  }
}

testFunction();
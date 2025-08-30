// Test script for Google Custom Search API
// Run with: node test-api.js

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

console.log('🔍 Google Custom Search API Test');
console.log('================================');

// Check environment variables
console.log('\n1. Environment Variables Check:');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : '❌ NOT SET');
console.log('Search Engine ID:', SEARCH_ENGINE_ID ? SEARCH_ENGINE_ID : '❌ NOT SET');

if (!API_KEY || !SEARCH_ENGINE_ID) {
  console.log('\n❌ ERROR: Missing environment variables!');
  console.log('Please create a .env.local file with:');
  console.log('GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key');
  console.log('GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id');
  process.exit(1);
}

// Test API call
async function testAPI() {
  console.log('\n2. Testing API Call...');
  
  const testQuery = 'test';
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${testQuery}&num=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      console.log('✅ SUCCESS: API is working correctly!');
      console.log('Results found:', data.searchInformation?.totalResults || 'Unknown');
      if (data.items && data.items.length > 0) {
        console.log('Sample result:', data.items[0].title);
      }
    } else {
      console.log('❌ ERROR: API call failed');
      console.log('Error details:', data.error || 'Unknown error');
      
      if (data.error) {
        switch (data.error.code) {
          case 400:
            console.log('💡 SUGGESTION: Check your API key and search engine ID');
            break;
          case 403:
            console.log('💡 SUGGESTION: Check API quota or billing status');
            break;
          case 429:
            console.log('💡 SUGGESTION: API quota exceeded, try again later');
            break;
          default:
            console.log('💡 SUGGESTION: Check Google Cloud Console for API status');
        }
      }
    }
  } catch (error) {
    console.log('❌ ERROR: Network or fetch error');
    console.log('Error:', error.message);
  }
}

// Test with different queries
async function testMultipleQueries() {
  console.log('\n3. Testing Multiple Queries...');
  
  const queries = ['hello', 'javascript', 'data'];
  
  for (const query of queries) {
    console.log(`\nTesting query: "${query}"`);
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&num=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success: ${data.searchInformation?.totalResults || 0} results`);
      } else {
        console.log(`❌ Failed: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run tests
async function runTests() {
  await testAPI();
  await testMultipleQueries();
  
  console.log('\n4. Next Steps:');
  console.log('If all tests pass, your API is configured correctly!');
  console.log('If tests fail, check the troubleshooting guide in TROUBLESHOOTING.md');
  console.log('\nYou can now use the search engine at: http://localhost:3000');
}

runTests().catch(console.error);

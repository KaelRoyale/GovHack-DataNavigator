// Test script to verify ABS API integration
// Run with: node test-abs-api.js

const testQueries = [
  'population',
  'employment',
  'gdp',
  'census'
]

async function testABSAPI(query) {
  console.log(`\n🔍 Testing ABS API with query: "${query}"`)
  
  try {
    const response = await fetch('http://localhost:3002/api/abs-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ ABS API Response:')
      console.log(`   - Total results: ${data.items?.length || 0}`)
      console.log(`   - Source: ${data.source}`)
      
      if (data.items && data.items.length > 0) {
        console.log('   - Sample result:')
        console.log(`     Title: ${data.items[0].title}`)
        console.log(`     Link: ${data.items[0].link}`)
        console.log(`     Snippet: ${data.items[0].snippet}`)
        
        if (data.items[0].dataAsset) {
          console.log(`     Data Asset: ${data.items[0].dataAsset.description}`)
        }
      }
    } else {
      const errorData = await response.json()
      console.log(`❌ ABS API Error: ${errorData.error}`)
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Starting ABS API integration tests...')
  console.log('Make sure the development server is running on http://localhost:3002')

  for (const query of testQueries) {
    await testABSAPI(query)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait between requests
  }

  console.log('\n✨ ABS API integration tests completed!')
}

runTests().catch(console.error)

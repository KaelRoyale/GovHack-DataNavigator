// Simple test script to verify search functionality
// Run with: node test-search.js

const testQueries = [
  'React hooks tutorial',
  'population data',
  'machine learning algorithms',
  'CSS Grid tutorial',
  'Next.js 14 features'
]

async function testSearch(query) {
  console.log(`\n🔍 Testing search for: "${query}"`)
  
  try {
    const response = await fetch('http://localhost:3002/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log(`✅ Success! Found ${data.items?.length || 0} results`)
      console.log(`📊 Total results available: ${data.searchInformation?.totalResults || 0}`)
      
      if (data.items && data.items.length > 0) {
        console.log('📄 Sample results:')
        data.items.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.title}`)
          console.log(`     URL: ${item.link}`)
          console.log(`     Domain: ${item.displayLink}`)
        })
      }
    } else {
      console.log(`❌ Error: ${data.error}`)
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Starting search tests...')
  console.log('Make sure the development server is running on http://localhost:3002')
  
  for (const query of testQueries) {
    await testSearch(query)
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n✨ Search tests completed!')
}

runTests().catch(console.error)

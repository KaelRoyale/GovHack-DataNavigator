// Test script to verify pagination functionality
// Run with: node test-pagination.js

const testQueries = [
  'React tutorial',
  'data analysis',
  'machine learning'
]

async function testPagination(query) {
  console.log(`\n🔍 Testing pagination for: "${query}"`)
  
  try {
    // Test first page
    console.log('📄 Testing page 1...')
    const response1 = await fetch('http://localhost:3002/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, page: 1 })
    })

    const data1 = await response1.json()
    
    if (response1.ok) {
      console.log(`✅ Page 1: Found ${data1.items?.length || 0} results`)
      console.log(`📊 Total results: ${data1.pagination?.totalResults || 0}`)
      console.log(`📄 Total pages: ${data1.pagination?.totalPages || 0}`)
      console.log(`📍 Current page: ${data1.pagination?.currentPage || 1}`)
      console.log(`🔗 Has next page: ${data1.pagination?.hasNextPage || false}`)
      
      // Test second page if available
      if (data1.pagination?.hasNextPage) {
        console.log('\n📄 Testing page 2...')
        const response2 = await fetch('http://localhost:3002/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, page: 2 })
        })

        const data2 = await response2.json()
        
        if (response2.ok) {
          console.log(`✅ Page 2: Found ${data2.items?.length || 0} results`)
          console.log(`📍 Current page: ${data2.pagination?.currentPage || 2}`)
          console.log(`🔗 Has previous page: ${data2.pagination?.hasPreviousPage || false}`)
          console.log(`🔗 Has next page: ${data2.pagination?.hasNextPage || false}`)
          
          // Verify different results
          if (data1.items && data2.items && data1.items.length > 0 && data2.items.length > 0) {
            const sameResults = data1.items.some(item1 => 
              data2.items.some(item2 => item1.link === item2.link)
            )
            console.log(`🔄 Different results: ${!sameResults}`)
          }
        } else {
          console.log(`❌ Page 2 error: ${data2.error}`)
        }
      } else {
        console.log('ℹ️  No second page available')
      }
    } else {
      console.log(`❌ Error: ${data1.error}`)
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Starting pagination tests...')
  console.log('Make sure the development server is running on http://localhost:3002')
  
  for (const query of testQueries) {
    await testPagination(query)
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log('\n✨ Pagination tests completed!')
}

runTests().catch(console.error)

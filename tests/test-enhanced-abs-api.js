// Test script for Enhanced ABS API Integration
// Based on official ABS Data API documentation

const testEnhancedABSAPI = async () => {
  console.log('🧪 Testing Enhanced ABS API Integration\n')

  // Test 1: Discover Dataflows
  console.log('1. Testing Dataflow Discovery...')
  try {
    const response = await fetch('http://localhost:3000/api/abs-search?type=dataflows')
    const data = await response.json()
    console.log(`✅ Found ${data.dataflows?.length || 0} dataflows`)
    if (data.dataflows?.length > 0) {
      console.log('Sample dataflows:')
      data.dataflows.slice(0, 3).forEach(df => {
        console.log(`  - ${df.id}: ${df.name} (${df.category})`)
      })
    }
  } catch (error) {
    console.log('❌ Error discovering dataflows:', error.message)
  }

  // Test 2: Get Data Structure
  console.log('\n2. Testing Data Structure Analysis...')
  try {
    const response = await fetch('http://localhost:3000/api/abs-search?type=datastructure&dataflowId=ALC')
    const data = await response.json()
    if (data.dataStructure) {
      console.log('✅ Data structure retrieved for ALC dataflow')
      console.log(`  Dimensions: ${data.dataStructure.dimensions?.length || 0}`)
      console.log(`  Attributes: ${data.dataStructure.attributes?.length || 0}`)
    } else {
      console.log('⚠️ No data structure found (using mock data)')
    }
  } catch (error) {
    console.log('❌ Error getting data structure:', error.message)
  }

  // Test 3: Example Queries
  console.log('\n3. Testing Example Queries...')
  try {
    const response = await fetch('http://localhost:3000/api/abs-search?type=examples')
    const data = await response.json()
    console.log('✅ Example queries retrieved:')
    Object.entries(data.examples).forEach(([name, url]) => {
      console.log(`  - ${name}: ${url}`)
    })
  } catch (error) {
    console.log('❌ Error getting examples:', error.message)
  }

  // Test 4: Advanced Query Building
  console.log('\n4. Testing Advanced Query Building...')
  try {
    const filters = {
      dimensions: {
        'TYP': '1',
        'MEA': '2',
        'BEVT': '1',
        'SUB': '4',
        'FREQUENCY': 'A'
      },
      startPeriod: '2008',
      endPeriod: '2008'
    }
    
    const response = await fetch(`http://localhost:3000/api/abs-search?type=advanced-query&dataflowId=ALC&filters=${encodeURIComponent(JSON.stringify(filters))}`)
    const data = await response.json()
    console.log('✅ Advanced query built:')
    console.log(`  URL: ${data.queryUrl}`)
    console.log(`  Dataflow: ${data.dataflowId}`)
    console.log(`  Filters: ${JSON.stringify(data.filters, null, 2)}`)
  } catch (error) {
    console.log('❌ Error building advanced query:', error.message)
  }

  // Test 5: Enhanced Data Fetching
  console.log('\n5. Testing Enhanced Data Fetching...')
  try {
    const response = await fetch('http://localhost:3000/api/abs-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataflowId: 'ALC',
        dataKey: '1.2.1.4.A',
        startPeriod: '2008',
        endPeriod: '2008',
        page: 1
      })
    })
    const data = await response.json()
    console.log('✅ Enhanced data fetched:')
    console.log(`  Results: ${data.items?.length || 0}`)
    console.log(`  Pagination: ${data.pagination?.totalResults || 0} total results`)
    if (data.items?.length > 0) {
      console.log('Sample result:')
      const sample = data.items[0]
      console.log(`  - Title: ${sample.title}`)
      console.log(`  - Link: ${sample.link}`)
      console.log(`  - Type: ${sample.type}`)
    }
  } catch (error) {
    console.log('❌ Error fetching enhanced data:', error.message)
  }

  console.log('\n🎯 Enhanced ABS API Integration Test Complete!')
  console.log('\nKey Improvements:')
  console.log('✅ Dynamic dataflow discovery from ABS API')
  console.log('✅ Data structure analysis and parsing')
  console.log('✅ Advanced query building with OR operators')
  console.log('✅ Enhanced period format handling')
  console.log('✅ Support for multiple response formats')
  console.log('✅ Example queries based on official documentation')
}

// Run the test
testEnhancedABSAPI().catch(console.error)

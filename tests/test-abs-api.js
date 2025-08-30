// Test script to verify ABS API integration
// Run with: node test-abs-api.js

async function testABSApi() {
  const baseUrl = 'http://localhost:3002/api'; // Updated port to match dev server
  
  console.log('Testing ABS API endpoints...\n');
  
  // Test 1: Test the simple test endpoint
  try {
    console.log('1. Testing /api/test-abs GET...');
    const testResponse = await fetch(`${baseUrl}/test-abs`);
    const testData = await testResponse.json();
    console.log('✅ Test endpoint working:', testData);
  } catch (error) {
    console.log('❌ Test endpoint failed:', error.message);
  }
  
  // Test 2: Test ABS search with proper dataflow ID (ALC from ABS documentation)
  try {
    console.log('\n2. Testing /api/abs-search POST with ALC dataflow...');
    const searchResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'alcohol consumption',
        dataflowId: 'ALC',
        dataKey: 'all',
        startPeriod: '2020',
        endPeriod: '2023'
      })
    });
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ ABS search working:', {
        totalResults: searchData.items?.length || 0,
        pagination: searchData.pagination,
        metadata: searchData.searchMetadata
      });
    } else {
      console.log('❌ ABS search failed:', searchResponse.status, searchResponse.statusText);
      const errorText = await searchResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ ABS search failed:', error.message);
  }
  
  // Test 3: Test ABS search with CPI dataflow
  try {
    console.log('\n3. Testing /api/abs-search POST with CPI dataflow...');
    const cpiResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'consumer price index',
        dataflowId: 'CPI',
        dataKey: 'all',
        startPeriod: '2023',
        endPeriod: '2024'
      })
    });
    
    if (cpiResponse.ok) {
      const cpiData = await cpiResponse.json();
      console.log('✅ CPI search working:', {
        totalResults: cpiData.items?.length || 0,
        pagination: cpiData.pagination
      });
    } else {
      console.log('❌ CPI search failed:', cpiResponse.status, cpiResponse.statusText);
    }
  } catch (error) {
    console.log('❌ CPI search failed:', error.message);
  }
  
  // Test 4: Test ABS API GET endpoints
  try {
    console.log('\n4. Testing /api/abs-search GET endpoints...');
    
    // Test popular dataflows
    const popularResponse = await fetch(`${baseUrl}/abs-search?type=popular`);
    if (popularResponse.ok) {
      const popularData = await popularResponse.json();
      console.log('✅ Popular dataflows endpoint working:', {
        totalDataflows: popularData.totalDataflows,
        availableDataflows: Object.keys(popularData.popularDataflows || {})
      });
    }
    
    // Test dataflows discovery
    const dataflowsResponse = await fetch(`${baseUrl}/abs-search?type=dataflows`);
    if (dataflowsResponse.ok) {
      const dataflowsData = await dataflowsResponse.json();
      console.log('✅ Dataflows discovery working:', {
        totalDataflows: dataflowsData.dataflows?.length || 0
      });
    }
    
  } catch (error) {
    console.log('❌ GET endpoints failed:', error.message);
  }
  
  // Test 5: Test ABS search with empty data (should return 400)
  try {
    console.log('\n5. Testing /api/abs-search POST with empty data...');
    const emptyResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    if (emptyResponse.status === 400) {
      console.log('✅ ABS search correctly rejected empty data');
    } else {
      console.log('❌ ABS search should have returned 400 for empty data');
    }
  } catch (error) {
    console.log('❌ Empty data test failed:', error.message);
  }
}

testABSApi().catch(console.error);

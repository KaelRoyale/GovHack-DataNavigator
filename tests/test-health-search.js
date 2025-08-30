// Test script to verify health keyword search functionality
// Run with: node tests/test-health-search.js

async function testHealthSearch() {
  const baseUrl = 'http://localhost:3002/api';
  
  console.log('Testing health keyword search...\n');
  
  // Test 1: Search for "health" keyword
  try {
    console.log('1. Testing /api/abs-search POST with "health" keyword...');
    const healthResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'health',
        dataflowId: 'all',
        dataKey: 'all',
        startPeriod: '2020',
        endPeriod: '2023'
      })
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health search working:', {
        totalResults: healthData.items?.length || 0,
        pagination: healthData.pagination,
        metadata: healthData.searchMetadata
      });
      
      if (healthData.items && healthData.items.length > 0) {
        console.log('\n📋 Health search results:');
        healthData.items.forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}`);
          console.log(`   ${item.snippet}`);
          console.log(`   Type: ${item.type}, Score: ${item.relevanceScore}`);
          console.log('');
        });
      } else {
        console.log('❌ No results found for health search');
      }
    } else {
      console.log('❌ Health search failed:', healthResponse.status, healthResponse.statusText);
      const errorText = await healthResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Health search failed:', error.message);
  }
  
  // Test 2: Search for "hospital" keyword
  try {
    console.log('\n2. Testing /api/abs-search POST with "hospital" keyword...');
    const hospitalResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'hospital',
        dataflowId: 'all',
        dataKey: 'all',
        startPeriod: '2020',
        endPeriod: '2023'
      })
    });
    
    if (hospitalResponse.ok) {
      const hospitalData = await hospitalResponse.json();
      console.log('✅ Hospital search working:', {
        totalResults: hospitalData.items?.length || 0,
        pagination: hospitalData.pagination
      });
      
      if (hospitalData.items && hospitalData.items.length > 0) {
        console.log('\n📋 Hospital search results:');
        hospitalData.items.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}`);
          console.log(`   ${item.snippet}`);
          console.log(`   Type: ${item.type}, Score: ${item.relevanceScore}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Hospital search failed:', hospitalResponse.status, hospitalResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Hospital search failed:', error.message);
  }
  
  // Test 3: Search for "medical" keyword
  try {
    console.log('\n3. Testing /api/abs-search POST with "medical" keyword...');
    const medicalResponse = await fetch(`${baseUrl}/abs-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'medical',
        dataflowId: 'all',
        dataKey: 'all',
        startPeriod: '2020',
        endPeriod: '2023'
      })
    });
    
    if (medicalResponse.ok) {
      const medicalData = await medicalResponse.json();
      console.log('✅ Medical search working:', {
        totalResults: medicalData.items?.length || 0,
        pagination: medicalData.pagination
      });
      
      if (medicalData.items && medicalData.items.length > 0) {
        console.log('\n📋 Medical search results:');
        medicalData.items.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}`);
          console.log(`   ${item.snippet}`);
          console.log(`   Type: ${item.type}, Score: ${item.relevanceScore}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Medical search failed:', medicalResponse.status, medicalResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Medical search failed:', error.message);
  }
  
  console.log('\n🏥 Health keyword search test completed!');
}

testHealthSearch().catch(console.error);

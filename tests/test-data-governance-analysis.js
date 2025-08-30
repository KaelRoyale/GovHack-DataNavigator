// Test script to verify enhanced data governance analysis functionality
// Run with: node tests/test-data-governance-analysis.js

async function testDataGovernanceAnalysis() {
  const baseUrl = 'http://localhost:3002/api';
  
  console.log('Testing enhanced data governance analysis...\n');
  
  // Test 1: Health data analysis
  try {
    console.log('1. Testing /api/analyze-content POST with health data...');
    const healthResponse = await fetch(`${baseUrl}/analyze-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.abs.gov.au/statistics/health',
        title: 'Australian Health Statistics',
        content: 'Comprehensive health statistics including hospital admissions, mortality data, health surveys, and Medicare statistics covering population health indicators, healthcare utilization, and health outcomes across Australia.'
      })
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health data governance analysis working:');
      console.log('Summary:', healthData.summary);
      console.log('Key Topics:', healthData.keyTopics);
      console.log('Quality Score:', healthData.qualityScore);
      
      if (healthData.dataGovernance) {
        console.log('\n📋 Data Governance Analysis:');
        console.log('Data Assets:');
        console.log(`  Description: ${healthData.dataGovernance.dataAssets.description}`);
        console.log(`  Collection Date: ${healthData.dataGovernance.dataAssets.collectionDate}`);
        console.log(`  Purpose: ${healthData.dataGovernance.dataAssets.purpose}`);
        console.log(`  Department Catalogues: ${healthData.dataGovernance.dataAssets.departmentCatalogues.join(', ')}`);
        console.log(`  Metadata Available: ${healthData.dataGovernance.dataAssets.metadataAvailable}`);
        
        console.log('\nData Availability:');
        console.log(`  Readily Available: ${healthData.dataGovernance.dataAvailability.isReadilyAvailable}`);
        console.log(`  Access Method: ${healthData.dataGovernance.dataAvailability.accessMethod}`);
        console.log(`  Data Custodian: ${healthData.dataGovernance.dataAvailability.dataCustodian}`);
        console.log(`  Request Required: ${healthData.dataGovernance.dataAvailability.requestRequired}`);
        
        console.log('\nData Access:');
        console.log(`  Download Available: ${healthData.dataGovernance.dataAccess.downloadAvailable}`);
        console.log(`  API Available: ${healthData.dataGovernance.dataAccess.apiAvailable}`);
        console.log(`  Access URL: ${healthData.dataGovernance.dataAccess.accessUrl}`);
        console.log(`  Formats: ${healthData.dataGovernance.dataAccess.format.join(', ')}`);
        
        console.log('\nData Relationships:');
        console.log(`  Part of Series: ${healthData.dataGovernance.dataRelationships.isPartOfSeries}`);
        console.log(`  Series Name: ${healthData.dataGovernance.dataRelationships.seriesName}`);
        console.log(`  Related Datasets: ${healthData.dataGovernance.dataRelationships.relatedDatasets.join(', ')}`);
        console.log(`  Dependencies: ${healthData.dataGovernance.dataRelationships.dependencies.join(', ')}`);
        console.log(`  Derived From: ${healthData.dataGovernance.dataRelationships.derivedFrom.join(', ')}`);
        console.log(`  Used To Create: ${healthData.dataGovernance.dataRelationships.usedToCreate.join(', ')}`);
      } else {
        console.log('❌ No data governance analysis found');
      }
    } else {
      console.log('❌ Health data analysis failed:', healthResponse.status, healthResponse.statusText);
      const errorText = await healthResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Health data analysis failed:', error.message);
  }
  
  // Test 2: Population data analysis
  try {
    console.log('\n2. Testing /api/analyze-content POST with population data...');
    const populationResponse = await fetch(`${baseUrl}/analyze-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.abs.gov.au/statistics/people/population',
        title: 'Australian Population Statistics',
        content: 'Population estimates and projections including demographic statistics, migration data, and population characteristics by age, sex, and geographic location.'
      })
    });
    
    if (populationResponse.ok) {
      const populationData = await populationResponse.json();
      console.log('✅ Population data governance analysis working:');
      console.log('Summary:', populationData.summary);
      console.log('Key Topics:', populationData.keyTopics);
      
      if (populationData.dataGovernance) {
        console.log('\n📋 Data Governance Analysis:');
        console.log(`Data Custodian: ${populationData.dataGovernance.dataAvailability.dataCustodian}`);
        console.log(`Access Method: ${populationData.dataGovernance.dataAvailability.accessMethod}`);
        console.log(`API Available: ${populationData.dataGovernance.dataAccess.apiAvailable}`);
        console.log(`Related Datasets: ${populationData.dataGovernance.dataRelationships.relatedDatasets.join(', ')}`);
      }
    } else {
      console.log('❌ Population data analysis failed:', populationResponse.status, populationResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Population data analysis failed:', error.message);
  }
  
  // Test 3: Economic data analysis
  try {
    console.log('\n3. Testing /api/analyze-content POST with economic data...');
    const economicResponse = await fetch(`${baseUrl}/analyze-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.abs.gov.au/statistics/economy',
        title: 'Australian Economic Indicators',
        content: 'Economic indicators including Consumer Price Index, employment statistics, and economic performance metrics for monitoring economic trends and policy analysis.'
      })
    });
    
    if (economicResponse.ok) {
      const economicData = await economicResponse.json();
      console.log('✅ Economic data governance analysis working:');
      console.log('Summary:', economicData.summary);
      console.log('Key Topics:', economicData.keyTopics);
      
      if (economicData.dataGovernance) {
        console.log('\n📋 Data Governance Analysis:');
        console.log(`Data Custodian: ${economicData.dataGovernance.dataAvailability.dataCustodian}`);
        console.log(`Access Method: ${economicData.dataGovernance.dataAvailability.accessMethod}`);
        console.log(`API Available: ${economicData.dataGovernance.dataAccess.apiAvailable}`);
        console.log(`Related Datasets: ${economicData.dataGovernance.dataRelationships.relatedDatasets.join(', ')}`);
      }
    } else {
      console.log('❌ Economic data analysis failed:', economicResponse.status, economicResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Economic data analysis failed:', error.message);
  }
  
  // Test 4: Unknown data analysis (should return default)
  try {
    console.log('\n4. Testing /api/analyze-content POST with unknown data...');
    const unknownResponse = await fetch(`${baseUrl}/analyze-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com/unknown-data',
        title: 'Unknown Dataset',
        content: 'This is a dataset that should not match any predefined categories and should return default analysis.'
      })
    });
    
    if (unknownResponse.ok) {
      const unknownData = await unknownResponse.json();
      console.log('✅ Unknown data governance analysis working:');
      console.log('Summary:', unknownData.summary);
      
      if (unknownData.dataGovernance) {
        console.log('\n📋 Data Governance Analysis (Default):');
        console.log(`Data Custodian: ${unknownData.dataGovernance.dataAvailability.dataCustodian}`);
        console.log(`Readily Available: ${unknownData.dataGovernance.dataAvailability.isReadilyAvailable}`);
        console.log(`Request Required: ${unknownData.dataGovernance.dataAvailability.requestRequired}`);
        console.log(`API Available: ${unknownData.dataGovernance.dataAccess.apiAvailable}`);
      }
    } else {
      console.log('❌ Unknown data analysis failed:', unknownResponse.status, unknownResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Unknown data analysis failed:', error.message);
  }
  
  console.log('\n🏛️ Data governance analysis test completed!');
}

testDataGovernanceAnalysis().catch(console.error);

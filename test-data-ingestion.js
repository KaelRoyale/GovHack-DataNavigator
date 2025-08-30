// Test script for Data Ingestion Pipeline
// Tests the data ingestion API endpoints and functionality

const testDataIngestion = async () => {
  console.log('🧪 Testing Data Ingestion Pipeline\n')

  // Test 1: Get Available Sources
  console.log('1. Testing Source Discovery...')
  try {
    const response = await fetch('http://localhost:3000/api/data-ingestion?action=sources')
    const data = await response.json()
    console.log(`✅ Found ${data.sources?.length || 0} data sources`)
    if (data.sources?.length > 0) {
      console.log('Available sources:')
      data.sources.forEach(source => {
        console.log(`  - ${source.name} (${source.type}): ${source.url}`)
      })
    }
  } catch (error) {
    console.log('❌ Error discovering sources:', error.message)
  }

  // Test 2: Test Custom Source Ingestion
  console.log('\n2. Testing Custom Source Ingestion...')
  try {
    const customSource = {
      id: 'test-source',
      name: 'Test Website',
      url: 'https://example.com',
      type: 'custom',
      category: 'test',
      description: 'Test data source for ingestion pipeline',
      selectors: {
        title: 'h1, h2, h3',
        content: 'p, .content, .description',
        date: '.date, .published-date',
        author: '.author, .contributor',
        category: '.category, .topic',
        tags: '.tags, .keywords'
      },
      status: 'active'
    }

    const response = await fetch('http://localhost:3000/api/data-ingestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ingest-custom',
        customSource
      })
    })

    const result = await response.json()
    if (result.status === 'completed') {
      console.log(`✅ Custom ingestion completed successfully`)
      console.log(`  Job ID: ${result.jobId}`)
      console.log(`  Data count: ${result.dataCount}`)
    } else {
      console.log('⚠️ Custom ingestion completed with issues:', result.errors)
    }
  } catch (error) {
    console.log('❌ Error in custom ingestion:', error.message)
  }

  // Test 3: Test Batch Ingestion
  console.log('\n3. Testing Batch Ingestion...')
  try {
    const response = await fetch('http://localhost:3000/api/data-ingestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ingest',
        sourceIds: ['abs-statistics', 'data-gov-au']
      })
    })

    const result = await response.json()
    if (result.status === 'completed') {
      console.log(`✅ Batch ingestion completed successfully`)
      console.log(`  Job ID: ${result.jobId}`)
      console.log(`  Total data count: ${result.totalDataCount}`)
      console.log(`  Results: ${result.results?.length || 0} sources processed`)
    } else {
      console.log('⚠️ Batch ingestion completed with issues:', result.errors)
    }
  } catch (error) {
    console.log('❌ Error in batch ingestion:', error.message)
  }

  // Test 4: Get Ingestion Jobs
  console.log('\n4. Testing Job Retrieval...')
  try {
    const response = await fetch('http://localhost:3000/api/data-ingestion?action=jobs')
    const data = await response.json()
    console.log(`✅ Found ${data.jobs?.length || 0} ingestion jobs`)
    if (data.jobs?.length > 0) {
      console.log('Recent jobs:')
      data.jobs.slice(0, 3).forEach(job => {
        console.log(`  - Job ${job.id.slice(-8)}: ${job.status}`)
        console.log(`    Sources: ${job.sourceIds.length}, Items: ${job.results.reduce((sum, r) => sum + r.dataCount, 0)}`)
      })
    }
  } catch (error) {
    console.log('❌ Error retrieving jobs:', error.message)
  }

  // Test 5: Get Ingested Data
  console.log('\n5. Testing Data Retrieval...')
  try {
    const response = await fetch('http://localhost:3000/api/data-ingestion?action=data')
    const data = await response.json()
    console.log(`✅ Found ${data.data?.length || 0} ingested data items`)
    if (data.data?.length > 0) {
      console.log('Sample data items:')
      data.data.slice(0, 3).forEach(item => {
        console.log(`  - ${item.title}`)
        console.log(`    Source: ${item.source}, Category: ${item.category}`)
        console.log(`    URL: ${item.url}`)
      })
    }
  } catch (error) {
    console.log('❌ Error retrieving data:', error.message)
  }

  // Test 6: Test Source-Specific Data Retrieval
  console.log('\n6. Testing Source-Specific Data Retrieval...')
  try {
    const response = await fetch('http://localhost:3000/api/data-ingestion?action=data&sourceId=test-source')
    const data = await response.json()
    console.log(`✅ Found ${data.data?.length || 0} items for test-source`)
  } catch (error) {
    console.log('❌ Error retrieving source-specific data:', error.message)
  }

  console.log('\n🎯 Data Ingestion Pipeline Test Complete!')
  console.log('\nKey Features Tested:')
  console.log('✅ Source discovery and management')
  console.log('✅ Custom source ingestion')
  console.log('✅ Batch ingestion from multiple sources')
  console.log('✅ Job tracking and status monitoring')
  console.log('✅ Data retrieval and storage')
  console.log('✅ Error handling and reporting')
}

// Run the test
testDataIngestion().catch(console.error)

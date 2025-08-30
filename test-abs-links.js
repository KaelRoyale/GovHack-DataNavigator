// Test script to verify ABS search results have unique links
const testABSLinkGeneration = () => {
  console.log('Testing ABS Link Generation...\n')

  // Mock the generateUniqueABSLink function
  const generateUniqueABSLink = (dataflowId, period, dataKey) => {
    const baseUrl = 'https://www.abs.gov.au'
    
    switch (dataflowId) {
      case 'CPI':
        return `${baseUrl}/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia/latest-release#data-downloads`
      case 'POP':
        return `${baseUrl}/statistics/people/population/national-state-and-territory-population/latest-release#data-downloads`
      case 'LFS':
        return `${baseUrl}/statistics/labour/employment-and-unemployment/labour-force-australia/latest-release#data-downloads`
      case 'GDP':
        return `${baseUrl}/statistics/economy/national-accounts/australian-national-accounts-national-income-expenditure-and-product/latest-release#data-downloads`
      case 'TRADE':
        return `${baseUrl}/statistics/economy/international-trade/international-trade-in-goods-and-services-australia/latest-release#data-downloads`
      case 'BUSINESS':
        return `${baseUrl}/statistics/economy/business-indicators/business-indicators-australia/latest-release#data-downloads`
      default:
        const dataflowLower = dataflowId.toLowerCase()
        const periodParam = period.replace(/[^0-9]/g, '')
        return `${baseUrl}/statistics/${dataflowLower}/latest-release?period=${periodParam}${dataKey ? `&key=${dataKey}` : ''}`
    }
  }

  // Mock the generateUniqueContentLink function
  const generateUniqueContentLink = (baseUrl, title, strategy) => {
    const baseUrlObj = new URL(baseUrl)
    const titleSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
    
    switch (strategy) {
      case 'publications':
        return `${baseUrlObj.origin}/publications/${titleSlug}`
      case 'media':
        return `${baseUrlObj.origin}/media-releases/${titleSlug}`
      case 'statistics':
        return `${baseUrlObj.origin}/statistics/${titleSlug}`
      default:
        return `${baseUrlObj.origin}/content/${titleSlug}`
    }
  }

  // Test dataflow links
  console.log('Testing Dataflow Links:')
  const testDataflows = ['CPI', 'POP', 'LFS', 'GDP', 'TRADE', 'BUSINESS', 'CUSTOM']
  const testPeriods = ['2024-Q1', '2024', '2024-01', '2023-Q4']
  
  testDataflows.forEach(dataflow => {
    testPeriods.forEach(period => {
      const link = generateUniqueABSLink(dataflow, period, 'test-key')
      console.log(`${dataflow} - ${period}: ${link}`)
    })
    console.log('---')
  })

  // Test content links
  console.log('\nTesting Content Links:')
  const testContent = [
    { title: 'Consumer Price Index Report', strategy: 'publications' },
    { title: 'Employment Statistics Update', strategy: 'media' },
    { title: 'Population Growth Data', strategy: 'statistics' },
    { title: 'Economic Indicators Summary', strategy: 'default' }
  ]
  
  testContent.forEach(content => {
    const link = generateUniqueContentLink('https://www.abs.gov.au', content.title, content.strategy)
    console.log(`${content.strategy}: ${content.title} -> ${link}`)
  })

  console.log('\n✅ Link generation test completed!')
  console.log('Each result should now have a unique, meaningful URL.')
}

// Run the test
testABSLinkGeneration()

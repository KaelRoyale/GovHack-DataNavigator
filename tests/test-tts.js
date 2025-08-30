// Test script for Text-to-Speech functionality
// Run with: node test-tts.js

const testTexts = [
  'Welcome to DataLandscape. This is a test of the text-to-speech functionality.',
  'Search results show articles from trusted government and research websites.',
  'The Australian Bureau of Statistics provides official data for analysis.',
  'This search engine integrates multiple data sources for comprehensive results.'
]

async function testTTS(text) {
  console.log(`\n🔊 Testing TTS with text: "${text.substring(0, 50)}..."`)
  
  try {
    const response = await fetch('http://localhost:3002/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Standard-A',
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ TTS Response:')
      console.log(`   - Text length: ${data.textLength} characters`)
      console.log(`   - Voice: ${data.voice.name}`)
      console.log(`   - Audio encoding: ${data.audioConfig.audioEncoding}`)
      console.log(`   - Audio content: ${data.audioContent ? 'Generated successfully' : 'Failed'}`)
      
      if (data.audioContent) {
        console.log(`   - Audio content length: ${data.audioContent.length} characters`)
      }
    } else {
      const errorData = await response.json()
      console.log(`❌ TTS Error: ${errorData.error}`)
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
  }
}

async function testVoices() {
  console.log('\n🎤 Testing available voices...')
  
  try {
    const response = await fetch('http://localhost:3002/api/text-to-speech?languageCode=en-US')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Voices Response:')
      console.log(`   - Language code: ${data.languageCode}`)
      console.log(`   - Available voices: ${data.voices?.length || 0}`)
      
      if (data.voices && data.voices.length > 0) {
        console.log('   - Sample voices:')
        data.voices.slice(0, 5).forEach((voice, index) => {
          console.log(`     ${index + 1}. ${voice.name} (${voice.ssmlGender})`)
        })
      }
    } else {
      const errorData = await response.json()
      console.log(`❌ Voices Error: ${errorData.error}`)
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Starting Text-to-Speech tests...')
  console.log('Make sure the development server is running on http://localhost:3002')
  console.log('Ensure GOOGLE_CLOUD_API_KEY is set in your .env.local file')

  // Test available voices first
  await testVoices()
  
  // Test TTS with different texts
  for (const text of testTexts) {
    await testTTS(text)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait between requests
  }

  console.log('\n✨ Text-to-Speech tests completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Check that audio content is being generated')
  console.log('2. Test the TTS component in the UI')
  console.log('3. Verify voice selection and audio settings work')
}

runTests().catch(console.error)

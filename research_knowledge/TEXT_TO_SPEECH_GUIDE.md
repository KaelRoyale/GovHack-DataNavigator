# Text-to-Speech Integration with Google AI

This document describes the text-to-speech functionality integrated into the DataLandscape search engine using Google Cloud Text-to-Speech API.

## Overview

The text-to-speech feature allows users to have search results and content read aloud, enhancing accessibility and providing an alternative way to consume information. The integration uses Google Cloud Text-to-Speech API for high-quality, natural-sounding speech synthesis.

## Features

### 🔊 **Audio Playback**
- **Play/Pause**: Control audio playback with intuitive buttons
- **Stop**: Reset audio to beginning
- **Auto-play**: Optional automatic playback when content loads
- **Error Handling**: Graceful handling of audio generation failures

### 🎛️ **Voice Customization**
- **Multiple Voices**: Access to Google's extensive voice library
- **Language Support**: Support for multiple languages and accents
- **Gender Selection**: Male, female, and neutral voice options
- **Voice Preview**: Browse available voices by language

### ⚙️ **Audio Settings**
- **Speaking Rate**: Adjust from 0.25x to 4.0x speed
- **Pitch Control**: Modify voice pitch from -20 to +20
- **Volume**: Control audio volume gain
- **Audio Format**: MP3, LINEAR16, OGG_OPUS support

### 🎯 **Smart Text Processing**
- **Content Selection**: Automatically reads search result titles and snippets
- **Text Truncation**: Handles long text gracefully (5000 character limit)
- **Error Recovery**: Fallback options when TTS fails

## Technical Implementation

### API Route
- **File**: `app/api/text-to-speech/route.ts`
- **Method**: POST (generate speech), GET (list voices)
- **Input**: Text content, voice settings, audio configuration
- **Output**: Base64-encoded audio content

### Component Integration
- **File**: `components/text-to-speech.tsx`
- **Props**: Text content, auto-play settings, voice preferences
- **Features**: Audio controls, settings panel, error display

### Search Results Integration
- **Location**: Each search result card
- **Content**: Title + snippet combination
- **Accessibility**: Screen reader friendly controls

## API Configuration

### Google Cloud Setup
1. **Enable Text-to-Speech API**:
   ```bash
   gcloud services enable texttospeech.googleapis.com
   ```

2. **Create API Key**:
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Credentials
   - Create a new API key
   - Restrict to Text-to-Speech API

3. **Environment Variables**:
   ```env
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
   ```

### API Endpoints

#### Generate Speech (POST)
```javascript
POST /api/text-to-speech
{
  "text": "Text to convert to speech",
  "voice": {
    "languageCode": "en-US",
    "name": "en-US-Standard-A",
    "ssmlGender": "FEMALE"
  },
  "audioConfig": {
    "audioEncoding": "MP3",
    "speakingRate": 1.0,
    "pitch": 0.0,
    "volumeGainDb": 0.0
  }
}
```

#### List Voices (GET)
```javascript
GET /api/text-to-speech?languageCode=en-US
```

## Usage Examples

### Basic TTS Component
```tsx
import TextToSpeech from '@/components/text-to-speech'

<TextToSpeech 
  text="Hello, this is a test of text-to-speech functionality."
  autoPlay={false}
/>
```

### Custom Voice Settings
```tsx
<TextToSpeech 
  text={searchResult.title + '. ' + searchResult.snippet}
  voice={{
    languageCode: 'en-US',
    name: 'en-US-Wavenet-A',
    ssmlGender: 'FEMALE'
  }}
  audioConfig={{
    speakingRate: 1.2,
    pitch: 2.0,
    volumeGainDb: 1.0
  }}
/>
```

### Search Results Integration
```tsx
// In search result card
const ttsText = `${result.title}. ${result.snippet}`

<TextToSpeech 
  text={ttsText}
  className="inline-flex"
/>
```

## Voice Options

### Popular English Voices
- **en-US-Standard-A**: Clear, professional female voice
- **en-US-Standard-B**: Professional male voice
- **en-US-Wavenet-A**: Natural-sounding female voice
- **en-US-Wavenet-B**: Natural-sounding male voice
- **en-US-Wavenet-C**: Alternative female voice
- **en-US-Wavenet-D**: Alternative male voice

### Language Support
- **English (US/UK/AU)**: Multiple accents available
- **Spanish**: European and Latin American variants
- **French**: European and Canadian variants
- **German**: Standard German
- **Japanese**: Natural Japanese speech
- **Korean**: Korean language support
- **Chinese**: Mandarin and Cantonese

## Audio Settings

### Speaking Rate
- **Range**: 0.25x to 4.0x
- **Default**: 1.0x (normal speed)
- **Use Cases**:
  - 0.75x: Slower for complex content
  - 1.5x: Faster for quick scanning
  - 2.0x: Very fast for experienced users

### Pitch Control
- **Range**: -20 to +20
- **Default**: 0 (normal pitch)
- **Use Cases**:
  - -5: Lower, more authoritative voice
  - +5: Higher, more energetic voice
  - +10: Very high pitch for emphasis

### Volume Gain
- **Range**: -96.0 to 16.0 dB
- **Default**: 0.0 dB
- **Use Cases**:
  - -3.0: Slightly quieter
  - +3.0: Slightly louder
  - +6.0: Much louder for noisy environments

## Error Handling

### Common Errors
- **400**: Invalid text or voice configuration
- **403**: API key issues or quota exceeded
- **429**: Rate limit exceeded
- **500**: Google Cloud service issues

### Fallback Behavior
- **Graceful Degradation**: UI remains functional
- **Error Messages**: Clear user feedback
- **Retry Options**: Regenerate speech button
- **Alternative Access**: Text remains readable

## Performance Considerations

### Optimization
- **Text Length**: Limited to 5000 characters per request
- **Caching**: Audio content cached in browser
- **Lazy Loading**: TTS only generates when requested
- **Rate Limiting**: Respects Google Cloud quotas

### Best Practices
- **Short Text**: Use concise, focused content
- **Clear Language**: Avoid complex technical terms
- **Consistent Voice**: Use same voice across related content
- **User Preferences**: Remember user settings

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**: Proper accessibility labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Status Announcements**: Audio state changes

### Visual Indicators
- **Loading States**: Clear loading indicators
- **Play/Pause Icons**: Intuitive visual controls
- **Error States**: Visible error messages
- **Settings Panel**: Accessible configuration

## Testing

### Test Script
Run the TTS test script:
```bash
node test-tts.js
```

### Manual Testing
1. **Basic Functionality**:
   - Click play button on search results
   - Verify audio plays correctly
   - Test pause and stop controls

2. **Voice Settings**:
   - Open settings panel
   - Change voice selection
   - Adjust speaking rate and pitch
   - Test regenerate functionality

3. **Error Scenarios**:
   - Test with invalid API key
   - Test with very long text
   - Test network connectivity issues

## Troubleshooting

### Common Issues

#### No Audio Generated
- **Check API Key**: Verify GOOGLE_CLOUD_API_KEY is set
- **Enable API**: Ensure Text-to-Speech API is enabled
- **Check Quota**: Verify API quota is available
- **Network**: Check internet connectivity

#### Poor Audio Quality
- **Voice Selection**: Try different voice options
- **Text Quality**: Ensure clean, well-formatted text
- **Audio Settings**: Adjust speaking rate and pitch
- **Browser**: Test in different browsers

#### Performance Issues
- **Text Length**: Reduce text length if too long
- **Caching**: Clear browser cache if needed
- **Rate Limiting**: Wait between requests
- **Network**: Check connection speed

### Debug Information
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API requests
- **API Response**: Verify response format
- **Audio Element**: Check audio element state

## Future Enhancements

### Planned Features
- **SSML Support**: Advanced speech markup
- **Batch Processing**: Multiple text items
- **Voice Cloning**: Custom voice training
- **Real-time Streaming**: Live audio generation
- **Offline Support**: Cached audio playback

### Integration Opportunities
- **Search Filters**: Audio-based search
- **Content Summaries**: Audio summaries
- **Notifications**: Audio alerts
- **Multilingual**: Automatic language detection
- **Voice Commands**: Speech-to-text integration

## Resources

### Documentation
- [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech)
- [Voice List](https://cloud.google.com/text-to-speech/docs/voices)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)
- [API Quotas](https://cloud.google.com/text-to-speech/quotas)

### Support
- **Google Cloud Support**: Technical API issues
- **Billing**: Cost and quota management
- **Community**: Stack Overflow and forums
- **Documentation**: Official guides and tutorials

## Cost Considerations

### Google Cloud Pricing
- **Standard Voices**: $4.00 per 1 million characters
- **Wavenet Voices**: $16.00 per 1 million characters
- **Neural2 Voices**: $16.00 per 1 million characters
- **Studio Voices**: $160.00 per 1 million characters

### Optimization Tips
- **Use Standard Voices**: Lower cost for basic needs
- **Cache Audio**: Avoid regenerating same content
- **Text Length**: Keep content concise
- **User Limits**: Implement usage limits if needed

## Security

### API Key Security
- **Environment Variables**: Store keys securely
- **API Restrictions**: Limit key scope
- **Monitoring**: Track API usage
- **Rotation**: Regular key updates

### Data Privacy
- **Text Processing**: Google processes text for TTS
- **No Storage**: Audio not stored permanently
- **User Consent**: Clear privacy policy
- **Compliance**: GDPR and privacy regulations

This text-to-speech integration provides a powerful, accessible way for users to consume search results and content, enhancing the overall user experience of the DataLandscape search engine.

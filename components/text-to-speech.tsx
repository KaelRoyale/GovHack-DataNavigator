'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Settings, Play, Pause, RotateCcw } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
  className?: string
  voice?: {
    languageCode?: string
    name?: string
    ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
  }
  audioConfig?: {
    audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS'
    speakingRate?: number
    pitch?: number
    volumeGainDb?: number
  }
}

interface Voice {
  name: string
  languageCodes: string[]
  ssmlGender: string
  naturalSampleRateHertz: number
}

export default function TextToSpeech({ 
  text, 
  autoPlay = false, 
  className = '',
  voice = {},
  audioConfig = {}
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState(voice)
  const [selectedAudioConfig, setSelectedAudioConfig] = useState(audioConfig)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load available voices on component mount
  useEffect(() => {
    loadAvailableVoices()
  }, [])

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && text && !audioUrl) {
      generateSpeech()
    }
  }, [autoPlay, text, audioUrl])

  const loadAvailableVoices = async () => {
    try {
      const response = await fetch('/api/text-to-speech?languageCode=en-US')
      if (response.ok) {
        const data = await response.json()
        setAvailableVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Failed to load voices:', error)
    }
  }

  const generateSpeech = async () => {
    if (!text.trim()) {
      setError('No text to convert to speech')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
          audioConfig: selectedAudioConfig
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate speech')
      }

      const data = await response.json()
      
      // Convert base64 audio content to blob URL
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      )
      
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // Auto-play if enabled
      if (autoPlay) {
        playAudio(url)
      }

    } catch (error) {
      console.error('TTS error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate speech')
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = (url?: string) => {
    const audioToPlay = url || audioUrl
    if (!audioToPlay) return

    if (audioRef.current) {
      audioRef.current.pause()
    }

    audioRef.current = new Audio(audioToPlay)
    audioRef.current.addEventListener('ended', () => setIsPlaying(false))
    audioRef.current.addEventListener('error', () => {
      setIsPlaying(false)
      setError('Failed to play audio')
    })

    audioRef.current.play()
    setIsPlaying(true)
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio()
    } else if (audioUrl) {
      playAudio()
    } else {
      generateSpeech()
    }
  }

  const handleRegenerate = () => {
    stopAudio()
    setAudioUrl(null)
    generateSpeech()
  }

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Main TTS Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        {audioUrl && (
          <>
            <button
              onClick={stopAudio}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
              title="Stop"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="TTS Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-80">
          <h4 className="font-medium text-gray-900 mb-3">Text-to-Speech Settings</h4>
          
          {/* Voice Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={selectedVoice.name || ''}
              onChange={(e) => setSelectedVoice(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default (en-US-Standard-A)</option>
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.ssmlGender})
                </option>
              ))}
            </select>
          </div>

          {/* Speaking Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speaking Rate: {selectedAudioConfig.speakingRate || 1.0}x
            </label>
            <input
              type="range"
              min="0.25"
              max="4.0"
              step="0.25"
              value={selectedAudioConfig.speakingRate || 1.0}
              onChange={(e) => setSelectedAudioConfig(prev => ({ 
                ...prev, 
                speakingRate: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          {/* Pitch */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pitch: {selectedAudioConfig.pitch || 0}
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={selectedAudioConfig.pitch || 0}
              onChange={(e) => setSelectedAudioConfig(prev => ({ 
                ...prev, 
                pitch: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Generating...' : 'Regenerate Speech'}
          </button>
        </div>
      )}
    </div>
  )
}

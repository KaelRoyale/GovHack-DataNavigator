'use client'

import { useState } from 'react'
import { Calendar, Clock, X } from 'lucide-react'

interface DateTimePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onClear: () => void
  className?: string
}

const TIME_PRESETS = [
  {
    label: 'Last Hour',
    getStartDate: () => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Last 24 Hours',
    getStartDate: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Last Week',
    getStartDate: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Last Month',
    getStartDate: () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Last 3 Months',
    getStartDate: () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 3)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Last Year',
    getStartDate: () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'This Year',
    getStartDate: () => {
      const date = new Date()
      date.setMonth(0, 1)
      date.setHours(0, 0, 0, 0)
      return date.toISOString().slice(0, 16)
    },
    getEndDate: () => new Date().toISOString().slice(0, 16)
  },
  {
    label: 'Custom Range',
    getStartDate: () => '',
    getEndDate: () => ''
  }
]

export default function DateTimePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className = ''
}: DateTimePickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  const handlePresetClick = (preset: typeof TIME_PRESETS[0]) => {
    if (preset.label === 'Custom Range') {
      setShowPresets(false)
      return
    }
    
    onStartDateChange(preset.getStartDate())
    onEndDateChange(preset.getEndDate())
    setShowPresets(false)
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const hasDateRange = startDate || endDate

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Date Range Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Time Range</span>
        </div>
        {hasDateRange && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Date Range Values */}
      {hasDateRange && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">From:</span>
            <span className="font-medium">{formatDisplayDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">To:</span>
            <span className="font-medium">{formatDisplayDate(endDate)}</span>
          </div>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="relative">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <span className="text-sm text-gray-700">
            {hasDateRange ? 'Change Range' : 'Select Time Range'}
          </span>
          <Clock className="w-4 h-4 text-gray-400" />
        </button>

        {showPresets && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">Quick Presets</div>
              {TIME_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Validation Message */}
      {startDate && endDate && new Date(startDate) > new Date(endDate) && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
          Start date must be before end date
        </div>
      )}
    </div>
  )
}

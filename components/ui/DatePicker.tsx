'use client'

import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

export function DatePicker({ label, value, onChange, placeholder = 'Select date' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedDate = value ? new Date(value) : null

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = []

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push({ day, isCurrentMonth: false, date: new Date(year, month - 1, day) })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) })
    }

    // Next month days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) })
    }

    return days
  }

  const handleDateSelect = (date: Date) => {
    const formatted = date.toISOString().split('T')[0]
    onChange(formatted)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setViewDate(today)
    handleDateSelect(today)
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(false)
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(viewDate)

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-bg-elevated border border-border rounded-md
                   text-text-primary placeholder:text-text-secondary
                   focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                   flex items-center justify-between"
      >
        <span className={value ? 'text-text-primary' : 'text-text-secondary'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-bg-card border border-border rounded-lg shadow-xl p-3 w-72 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-medium text-text-primary">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-medium text-text-secondary py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateSelect(day.date)}
                className={`
                  p-2 text-sm rounded transition-colors
                  ${!day.isCurrentMonth ? 'text-text-secondary/50' : 'text-text-primary'}
                  ${isSelected(day.date) ? 'bg-accent text-white' : 'hover:bg-bg-elevated'}
                  ${isToday(day.date) && !isSelected(day.date) ? 'ring-1 ring-accent' : ''}
                `}
              >
                {day.day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-sm text-accent hover:text-accent-hover font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

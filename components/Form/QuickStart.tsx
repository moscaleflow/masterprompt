'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import type { AISuggestions, PromptConfig, TechStack } from '@/types'

interface QuickStartProps {
  onApplySuggestions: (updates: Partial<PromptConfig>) => void
  onSetTechStack: (techStack: Partial<TechStack>) => void
  onSetAppType: (appType: PromptConfig['appType']) => void
  onAddFeatures: (features: string[]) => void
}

export function QuickStart({
  onApplySuggestions,
  onSetTechStack,
  onSetAppType,
  onAddFeatures,
}: QuickStartProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data)
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyName = (name: string) => {
    onApplySuggestions({ projectName: name })
  }

  const applyOneLiner = (oneLiner: string) => {
    onApplySuggestions({ oneLiner })
  }

  const applyAll = () => {
    if (!suggestions) return

    onApplySuggestions({
      projectName: suggestions.projectNames[0],
      oneLiner: suggestions.oneLiners[0],
      targetUser: suggestions.targetUser,
      specialRequirements: suggestions.specialRequirements,
      theme: suggestions.theme,
    })
    onSetAppType(suggestions.appType)
    onSetTechStack(suggestions.techStack)
    onAddFeatures(suggestions.customFeatures)
    setIsExpanded(false)
  }

  return (
    <div className="bg-bg-elevated rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-bg-card transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">&#x2728;</span>
          <span className="font-medium text-text-primary">AI Quick Start</span>
          <span className="text-xs text-text-secondary bg-accent/20 px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-text-secondary">
            Describe your project idea and let AI suggest the best configuration.
          </p>

          <div className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A SaaS dashboard for tracking crypto portfolio with real-time prices, alerts, and portfolio analytics..."
              rows={3}
              className="resize-none"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Config'
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          {suggestions && (
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">Suggestions</h4>
                <Button variant="primary" size="sm" onClick={applyAll}>
                  Apply All
                </Button>
              </div>

              {/* Project Names */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  Project Names
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {suggestions.projectNames.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => applyName(name)}
                      className="px-3 py-1.5 text-sm bg-bg-card hover:bg-accent/20 border border-border hover:border-accent rounded-md transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* One-liners */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  One-liner Descriptions
                </label>
                <div className="flex flex-col gap-2 mt-1">
                  {suggestions.oneLiners.map((line, i) => (
                    <button
                      key={i}
                      onClick={() => applyOneLiner(line)}
                      className="px-3 py-2 text-sm text-left bg-bg-card hover:bg-accent/20 border border-border hover:border-accent rounded-md transition-colors"
                    >
                      {line}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Type & Tech Stack */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    App Type
                  </label>
                  <p className="mt-1 text-sm text-text-primary capitalize">
                    {suggestions.appType}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    Theme
                  </label>
                  <p className="mt-1 text-sm text-text-primary capitalize">
                    {suggestions.theme.replace('-', ' ')}
                  </p>
                </div>
              </div>

              {/* Suggested Features */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  Suggested Features
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {suggestions.customFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-accent/10 text-accent border border-accent/30 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target User */}
              {suggestions.targetUser && (
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    Target User
                  </label>
                  <p className="mt-1 text-sm text-text-secondary">
                    {suggestions.targetUser}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

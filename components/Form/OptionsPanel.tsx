'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PromptConfig } from '@/types'

interface OptionsPanelProps {
  config: PromptConfig
  onUpdate: (updates: Partial<PromptConfig>) => void
  onAddFeature: (feature: string) => void
  onRemoveFeature: (index: number) => void
}

export function OptionsPanel({
  config,
  onUpdate,
  onAddFeature,
  onRemoveFeature,
}: OptionsPanelProps) {
  const [newFeature, setNewFeature] = useState('')

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onAddFeature(newFeature.trim())
      setNewFeature('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  return (
    <div className="space-y-6">
      {/* Options Checkboxes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Options</h2>

        <div className="space-y-3">
          <Checkbox
            label="Include Sentry error tracking"
            checked={config.includeSentry}
            onChange={(e) => onUpdate({ includeSentry: e.target.checked })}
          />

          <Checkbox
            label="Include fuzzy search (Fuse.js)"
            checked={config.includeFuzzySearch}
            onChange={(e) => onUpdate({ includeFuzzySearch: e.target.checked })}
          />

          <Checkbox
            label="Include toast notifications"
            checked={config.includeToasts}
            onChange={(e) => onUpdate({ includeToasts: e.target.checked })}
          />
        </div>
      </div>

      {/* Custom Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Core Features (MVP)</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Add a feature..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAddFeature} disabled={!newFeature.trim()}>
            Add
          </Button>
        </div>

        {config.customFeatures.length > 0 && (
          <ul className="space-y-2">
            {config.customFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2 rounded bg-bg-elevated border border-border"
              >
                <span className="text-sm text-text-primary">{feature}</span>
                <button
                  onClick={() => onRemoveFeature(index)}
                  className="text-text-secondary hover:text-danger transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Database Tables */}
      <Textarea
        label="Database Tables (optional)"
        placeholder="Describe your main tables or paste schema..."
        rows={4}
        value={config.customDbTables}
        onChange={(e) => onUpdate({ customDbTables: e.target.value })}
      />

      {/* Special Requirements */}
      <Textarea
        label="Special Requirements (optional)"
        placeholder="Auth roles? Timezone handling? File uploads? Notifications?"
        rows={3}
        value={config.specialRequirements}
        onChange={(e) => onUpdate({ specialRequirements: e.target.value })}
      />
    </div>
  )
}

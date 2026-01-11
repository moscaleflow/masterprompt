'use client'

import { Select } from '@/components/ui/Select'
import { themes } from '@/lib/themes'
import { ColorMode } from '@/types'
import { colorModeOptions } from '@/lib/techStackDefaults'

interface ThemeSelectorProps {
  theme: string
  colorMode: ColorMode
  onThemeChange: (theme: string) => void
  onColorModeChange: (colorMode: ColorMode) => void
}

export function ThemeSelector({
  theme,
  colorMode,
  onThemeChange,
  onColorModeChange,
}: ThemeSelectorProps) {
  const themeOptions = themes.map((t) => ({
    value: t.id,
    label: t.name,
  }))

  const selectedTheme = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Design Theme</h2>

      <Select
        label="Color Theme"
        options={themeOptions}
        value={theme}
        onChange={(e) => onThemeChange(e.target.value)}
      />

      {/* Theme Preview */}
      <div className="p-4 rounded border border-border bg-bg-card">
        <p className="text-sm text-text-secondary mb-3">Preview</p>
        <div className="flex gap-2 flex-wrap">
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.accent }}
            title="Accent"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.bgDark }}
            title="Background"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.bgCard }}
            title="Card"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.bgElevated }}
            title="Elevated"
          />
          <div
            className="w-8 h-8 rounded border border-border"
            style={{ backgroundColor: selectedTheme.colors.textPrimary }}
            title="Text"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.success }}
            title="Success"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.warning }}
            title="Warning"
          />
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: selectedTheme.colors.danger }}
            title="Danger"
          />
        </div>
      </div>

      <Select
        label="Color Mode"
        options={colorModeOptions}
        value={colorMode}
        onChange={(e) => onColorModeChange(e.target.value as ColorMode)}
      />
    </div>
  )
}

'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { PromptConfig, AppType } from '@/types'
import { appTypeOptions } from '@/lib/techStackDefaults'

interface ProjectBasicsProps {
  config: PromptConfig
  onUpdate: (updates: Partial<PromptConfig>) => void
  onAppTypeChange: (appType: AppType) => void
}

export function ProjectBasics({ config, onUpdate, onAppTypeChange }: ProjectBasicsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Project Basics</h2>

      <Input
        label="Project Name"
        placeholder="MyAwesomeApp"
        value={config.projectName}
        onChange={(e) => onUpdate({ projectName: e.target.value })}
      />

      <Textarea
        label="One-liner Description"
        placeholder="What does this app do in one sentence?"
        rows={2}
        value={config.oneLiner}
        onChange={(e) => onUpdate({ oneLiner: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Ship By"
          value={config.shipBy}
          onChange={(value) => onUpdate({ shipBy: value })}
        />

        <Select
          label="App Type"
          options={appTypeOptions}
          value={config.appType}
          onChange={(e) => onAppTypeChange(e.target.value as AppType)}
        />
      </div>

      <Input
        label="Target User"
        placeholder="Who uses this? e.g., Small business owners"
        value={config.targetUser}
        onChange={(e) => onUpdate({ targetUser: e.target.value })}
      />
    </div>
  )
}

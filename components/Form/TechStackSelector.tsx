'use client'

import { Select } from '@/components/ui/Select'
import { TechStack } from '@/types'
import {
  frontendOptions,
  databaseOptions,
  authOptions,
  hostingOptions,
  backendAutomationOptions,
  aiOptions,
  marketingOptions,
} from '@/lib/techStackDefaults'

interface TechStackSelectorProps {
  techStack: TechStack
  onUpdate: (updates: Partial<TechStack>) => void
}

export function TechStackSelector({ techStack, onUpdate }: TechStackSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Tech Stack</h2>
      <p className="text-sm text-text-secondary">
        Pre-filled based on app type. Customize as needed.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Frontend"
          options={frontendOptions}
          value={techStack.frontend}
          onChange={(e) => onUpdate({ frontend: e.target.value as TechStack['frontend'] })}
        />

        <Select
          label="Database"
          options={databaseOptions}
          value={techStack.database}
          onChange={(e) => onUpdate({ database: e.target.value as TechStack['database'] })}
        />

        <Select
          label="Authentication"
          options={authOptions}
          value={techStack.auth}
          onChange={(e) => onUpdate({ auth: e.target.value as TechStack['auth'] })}
        />

        <Select
          label="Hosting"
          options={hostingOptions}
          value={techStack.hosting}
          onChange={(e) => onUpdate({ hosting: e.target.value as TechStack['hosting'] })}
        />

        <Select
          label="Backend Automation"
          options={backendAutomationOptions}
          value={techStack.backendAutomation}
          onChange={(e) =>
            onUpdate({ backendAutomation: e.target.value as TechStack['backendAutomation'] })
          }
        />

        <Select
          label="AI/LLM"
          options={aiOptions}
          value={techStack.ai}
          onChange={(e) => onUpdate({ ai: e.target.value as TechStack['ai'] })}
        />
      </div>

      <Select
        label="Marketing Platform"
        options={marketingOptions}
        value={techStack.marketing}
        onChange={(e) => onUpdate({ marketing: e.target.value as TechStack['marketing'] })}
      />
    </div>
  )
}

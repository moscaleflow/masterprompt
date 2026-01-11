'use client'

import { useState } from 'react'
import { CopyButton } from './CopyButton'
import { FilePreview } from './FilePreview'
import { Button } from '@/components/ui/Button'

interface PromptPreviewProps {
  outputs: {
    masterPrompt: string
    prdTemplate: string
    todoTemplate: string
    ideasTemplate: string
    handoffTemplate: string
    envExample: string
  }
}

type TabId = 'master' | 'files'

export function PromptPreview({ outputs }: PromptPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('master')

  const allContent = `${outputs.masterPrompt}

---

# Generated Files

## PRD.md
${outputs.prdTemplate}

## TODO.md
${outputs.todoTemplate}

## IDEAS.md
${outputs.ideasTemplate}

## HANDOFF.md
${outputs.handoffTemplate}

## .env.example
${outputs.envExample}`

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-card">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              activeTab === 'master'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            Master Prompt
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              activeTab === 'files'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            Generated Files
          </button>
        </div>

        <CopyButton text={allContent} label="Copy All" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'master' && (
          <div className="p-4">
            <div className="flex justify-end mb-3">
              <CopyButton text={outputs.masterPrompt} />
            </div>
            <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
              {outputs.masterPrompt}
            </pre>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4 space-y-3">
            <FilePreview filename="PRD.md" content={outputs.prdTemplate} />
            <FilePreview filename="TODO.md" content={outputs.todoTemplate} />
            <FilePreview filename="IDEAS.md" content={outputs.ideasTemplate} />
            <FilePreview filename="HANDOFF.md" content={outputs.handoffTemplate} />
            <FilePreview filename=".env.example" content={outputs.envExample} />
          </div>
        )}
      </div>
    </div>
  )
}

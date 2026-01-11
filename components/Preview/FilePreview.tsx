'use client'

import { useState } from 'react'
import { CopyButton } from './CopyButton'

interface FilePreviewProps {
  filename: string
  content: string
}

export function FilePreview({ filename, content }: FilePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-border rounded overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2 bg-bg-elevated cursor-pointer hover:bg-bg-card transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-mono text-sm text-text-primary">{filename}</span>
        </div>
        <CopyButton text={content} label="Copy" />
      </div>

      {isExpanded && (
        <div className="p-4 bg-bg-dark border-t border-border overflow-x-auto">
          <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap">
            {content}
          </pre>
        </div>
      )}
    </div>
  )
}

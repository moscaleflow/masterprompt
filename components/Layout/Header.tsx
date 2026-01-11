'use client'

import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/Auth/UserMenu'

interface HeaderProps {
  onSignInClick: () => void
  onSaveClick: () => void
  onLoadClick: () => void
  onResetClick: () => void
  isSignedIn: boolean
}

export function Header({
  onSignInClick,
  onSaveClick,
  onLoadClick,
  onResetClick,
  isSignedIn,
}: HeaderProps) {
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-semibold text-text-primary">MasterPrompt</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onResetClick}>
          Reset
        </Button>

        {isSignedIn && (
          <>
            <Button variant="secondary" size="sm" onClick={onLoadClick}>
              Load
            </Button>
            <Button variant="secondary" size="sm" onClick={onSaveClick}>
              Save
            </Button>
          </>
        )}

        <UserMenu onSignInClick={onSignInClick} />
      </div>
    </header>
  )
}

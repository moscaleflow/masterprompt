'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface UserMenuProps {
  onSignInClick: () => void
}

export function UserMenu({ onSignInClick }: UserMenuProps) {
  const { user, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      toast.success('Signed out')
    }
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-bg-elevated animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Button variant="secondary" size="sm" onClick={onSignInClick}>
        Sign In
      </Button>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        {user.email?.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded shadow-lg animate-fade-in z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm text-text-primary truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

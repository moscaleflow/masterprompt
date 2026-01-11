'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`
            w-4 h-4 rounded border border-border bg-bg-elevated
            checked:bg-accent checked:border-accent
            focus:ring-2 focus:ring-accent focus:ring-offset-0
            cursor-pointer
            ${className}
          `}
          {...props}
        />
        <span className="text-sm text-text-primary">{label}</span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'
import { PromptConfig, SavedConfig } from '@/types'
import { toast } from 'sonner'

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  config: PromptConfig
  userId: string
}

export function SaveModal({ isOpen, onClose, config, userId }: SaveModalProps) {
  const [name, setName] = useState(config.projectName || '')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('prompt_configs').insert({
        user_id: userId,
        name: name.trim(),
        project_name: config.projectName,
        one_liner: config.oneLiner,
        ship_by: config.shipBy || null,
        target_user: config.targetUser,
        app_type: config.appType,
        tech_stack: config.techStack,
        theme: config.theme,
        color_mode: config.colorMode,
        include_sentry: config.includeSentry,
        include_fuzzy_search: config.includeFuzzySearch,
        include_toasts: config.includeToasts,
        custom_features: config.customFeatures,
        custom_db_tables: config.customDbTables,
        special_requirements: config.specialRequirements,
      })

      if (error) throw error

      toast.success('Configuration saved')
      onClose()
    } catch (error) {
      toast.error('Failed to save configuration')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Configuration">
      <div className="space-y-4">
        <Input
          label="Configuration Name"
          placeholder="My Project Setup"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface LoadModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (config: PromptConfig) => void
  userId: string
}

export function LoadModal({ isOpen, onClose, onLoad, userId }: LoadModalProps) {
  const [configs, setConfigs] = useState<SavedConfig[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      loadConfigs()
    }
  }, [isOpen])

  const loadConfigs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('prompt_configs')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setConfigs(
        data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          config: {
            projectName: row.project_name || '',
            oneLiner: row.one_liner || '',
            shipBy: row.ship_by || '',
            targetUser: row.target_user || '',
            appType: row.app_type || 'saas',
            techStack: row.tech_stack || {},
            theme: row.theme || 'purple-tech',
            colorMode: row.color_mode || 'dark-only',
            includeSentry: row.include_sentry ?? true,
            includeFuzzySearch: row.include_fuzzy_search ?? true,
            includeToasts: row.include_toasts ?? true,
            customFeatures: row.custom_features || [],
            customDbTables: row.custom_db_tables || '',
            specialRequirements: row.special_requirements || '',
          },
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
      )
    } catch (error) {
      toast.error('Failed to load configurations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompt_configs')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setConfigs(configs.filter((c) => c.id !== id))
      toast.success('Configuration deleted')
    } catch (error) {
      toast.error('Failed to delete configuration')
      console.error(error)
    }
  }

  const handleSelect = (config: PromptConfig) => {
    onLoad(config)
    onClose()
    toast.success('Configuration loaded')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Load Configuration">
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-bg-elevated rounded animate-pulse"
              />
            ))}
          </div>
        ) : configs.length === 0 ? (
          <p className="text-center text-text-secondary py-8">
            No saved configurations yet.
          </p>
        ) : (
          configs.map((saved) => (
            <div
              key={saved.id}
              className="flex items-center justify-between p-3 rounded bg-bg-card border border-border hover:border-accent transition-colors"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => handleSelect(saved.config)}
              >
                <p className="font-medium text-text-primary">{saved.name}</p>
                <p className="text-xs text-text-secondary">
                  {new Date(saved.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(saved.id)}
                className="p-1.5 text-text-secondary hover:text-danger transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}

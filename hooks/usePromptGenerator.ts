'use client'

import { useState, useCallback } from 'react'
import { PromptConfig, defaultConfig, TechStack, AppType } from '@/types'
import { techStackByAppType } from '@/lib/techStackDefaults'
import {
  generateMasterPrompt,
  generatePRDTemplate,
  generateTODOTemplate,
  generateIDEASTemplate,
  generateHANDOFFTemplate,
  generateEnvExample,
} from '@/lib/promptGenerator'

export function usePromptGenerator() {
  const [config, setConfig] = useState<PromptConfig>(defaultConfig)

  const updateConfig = useCallback((updates: Partial<PromptConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateTechStack = useCallback((updates: Partial<TechStack>) => {
    setConfig((prev) => ({
      ...prev,
      techStack: { ...prev.techStack, ...updates },
    }))
  }, [])

  const setAppType = useCallback((appType: AppType) => {
    const suggestedStack = techStackByAppType[appType]
    setConfig((prev) => ({
      ...prev,
      appType,
      techStack: { ...prev.techStack, ...suggestedStack },
    }))
  }, [])

  const addCustomFeature = useCallback((feature: string) => {
    if (feature.trim()) {
      setConfig((prev) => ({
        ...prev,
        customFeatures: [...prev.customFeatures, feature.trim()],
      }))
    }
  }, [])

  const addCustomFeatures = useCallback((features: string[]) => {
    const validFeatures = features.filter((f) => f.trim())
    if (validFeatures.length > 0) {
      setConfig((prev) => ({
        ...prev,
        customFeatures: [...prev.customFeatures, ...validFeatures],
      }))
    }
  }, [])

  const removeCustomFeature = useCallback((index: number) => {
    setConfig((prev) => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index),
    }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
  }, [])

  const loadConfig = useCallback((newConfig: PromptConfig) => {
    setConfig(newConfig)
  }, [])

  // Generated outputs
  const masterPrompt = generateMasterPrompt(config)
  const prdTemplate = generatePRDTemplate(config)
  const todoTemplate = generateTODOTemplate()
  const ideasTemplate = generateIDEASTemplate()
  const handoffTemplate = generateHANDOFFTemplate(config)
  const envExample = generateEnvExample(config)

  return {
    config,
    updateConfig,
    updateTechStack,
    setAppType,
    addCustomFeature,
    addCustomFeatures,
    removeCustomFeature,
    resetConfig,
    loadConfig,
    outputs: {
      masterPrompt,
      prdTemplate,
      todoTemplate,
      ideasTemplate,
      handoffTemplate,
      envExample,
    },
  }
}

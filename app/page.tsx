'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePromptGenerator } from '@/hooks/usePromptGenerator'
import { Header } from '@/components/Layout/Header'
import { ProjectBasics } from '@/components/Form/ProjectBasics'
import { TechStackSelector } from '@/components/Form/TechStackSelector'
import { ThemeSelector } from '@/components/Form/ThemeSelector'
import { OptionsPanel } from '@/components/Form/OptionsPanel'
import { PromptPreview } from '@/components/Preview/PromptPreview'
import { AuthModal } from '@/components/Auth/AuthModal'
import { SaveModal, LoadModal } from '@/components/SaveLoadModal'

export default function Home() {
  const { user } = useAuth()
  const {
    config,
    updateConfig,
    updateTechStack,
    setAppType,
    addCustomFeature,
    removeCustomFeature,
    resetConfig,
    loadConfig,
    outputs,
  } = usePromptGenerator()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)

  const handleSaveClick = () => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      setShowSaveModal(true)
    }
  }

  const handleLoadClick = () => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      setShowLoadModal(true)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-bg-dark">
      <Header
        onSignInClick={() => setShowAuthModal(true)}
        onSaveClick={handleSaveClick}
        onLoadClick={handleLoadClick}
        onResetClick={resetConfig}
        isSignedIn={!!user}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <div className="p-6 space-y-8">
            <ProjectBasics
              config={config}
              onUpdate={updateConfig}
              onAppTypeChange={setAppType}
            />

            <div className="h-px bg-border" />

            <TechStackSelector
              techStack={config.techStack}
              onUpdate={updateTechStack}
            />

            <div className="h-px bg-border" />

            <ThemeSelector
              theme={config.theme}
              colorMode={config.colorMode}
              onThemeChange={(theme) => updateConfig({ theme })}
              onColorModeChange={(colorMode) => updateConfig({ colorMode })}
            />

            <div className="h-px bg-border" />

            <OptionsPanel
              config={config}
              onUpdate={updateConfig}
              onAddFeature={addCustomFeature}
              onRemoveFeature={removeCustomFeature}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-bg-dark">
          <PromptPreview outputs={outputs} />
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {user && (
        <>
          <SaveModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            config={config}
            userId={user.id}
          />
          <LoadModal
            isOpen={showLoadModal}
            onClose={() => setShowLoadModal(false)}
            onLoad={loadConfig}
            userId={user.id}
          />
        </>
      )}
    </div>
  )
}

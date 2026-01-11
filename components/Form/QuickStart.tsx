'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import type { AISuggestions, AIQuestions, QAItem, PromptConfig, TechStack } from '@/types'

type Step = 'idea' | 'questions' | 'results'

interface QuickStartProps {
  onApplySuggestions: (updates: Partial<PromptConfig>) => void
  onSetTechStack: (techStack: Partial<TechStack>) => void
  onSetAppType: (appType: PromptConfig['appType']) => void
  onAddFeatures: (features: string[]) => void
}

export function QuickStart({
  onApplySuggestions,
  onSetTechStack,
  onSetAppType,
  onAddFeatures,
}: QuickStartProps) {
  const [step, setStep] = useState<Step>('idea')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  // Questions step
  const [aiQuestions, setAiQuestions] = useState<AIQuestions | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QAItem[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')

  // Results step
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null)

  const handleStartDiscovery = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'questions', prompt }),
      })

      if (!response.ok) throw new Error('Failed to generate questions')

      const data: AIQuestions = await response.json()
      setAiQuestions(data)
      setStep('questions')
      setCurrentQuestionIndex(0)
      setAnswers([])
    } catch (err) {
      setError('Failed to start discovery. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim() || !aiQuestions) return

    const newAnswers = [
      ...answers,
      { question: aiQuestions.questions[currentQuestionIndex], answer: currentAnswer },
    ]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentQuestionIndex < aiQuestions.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // All questions answered, generate config
      generateFinalConfig(newAnswers)
    }
  }

  const handleSkipQuestion = () => {
    if (!aiQuestions) return

    const newAnswers = [
      ...answers,
      { question: aiQuestions.questions[currentQuestionIndex], answer: 'N/A' },
    ]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentQuestionIndex < aiQuestions.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      generateFinalConfig(newAnswers)
    }
  }

  const generateFinalConfig = async (allAnswers: QAItem[]) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'generate', prompt, answers: allAnswers }),
      })

      if (!response.ok) throw new Error('Failed to generate config')

      const data: AISuggestions = await response.json()
      setSuggestions(data)
      setStep('results')
    } catch (err) {
      setError('Failed to generate config. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Failed to generate')

      const data: AISuggestions = await response.json()
      setSuggestions(data)
      setStep('results')
    } catch (err) {
      setError('Failed to generate. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyName = (name: string) => {
    onApplySuggestions({ projectName: name })
  }

  const applyOneLiner = (oneLiner: string) => {
    onApplySuggestions({ oneLiner })
  }

  const applyAll = () => {
    if (!suggestions) return

    onApplySuggestions({
      projectName: suggestions.projectNames[0],
      oneLiner: suggestions.oneLiners[0],
      targetUser: suggestions.targetUser,
      specialRequirements: suggestions.specialRequirements,
      customDbTables: suggestions.customDbTables || '',
      theme: suggestions.theme,
    })
    onSetAppType(suggestions.appType)
    onSetTechStack(suggestions.techStack)
    onAddFeatures(suggestions.customFeatures)
    setIsExpanded(false)
  }

  const resetFlow = () => {
    setStep('idea')
    setPrompt('')
    setAiQuestions(null)
    setAnswers([])
    setCurrentQuestionIndex(0)
    setCurrentAnswer('')
    setSuggestions(null)
    setError(null)
  }

  const progress = aiQuestions
    ? Math.round(((currentQuestionIndex + 1) / aiQuestions.questions.length) * 100)
    : 0

  return (
    <div className="bg-bg-elevated rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-bg-card transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">&#x2728;</span>
          <span className="font-medium text-text-primary">AI Project Discovery</span>
          <span className="text-xs text-text-secondary bg-accent/20 px-2 py-0.5 rounded-full">
            {step === 'idea' ? 'Start' : step === 'questions' ? `Q${currentQuestionIndex + 1}` : 'Done'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Step 1: Initial Idea */}
          {step === 'idea' && (
            <>
              <p className="text-sm text-text-secondary">
                Describe your project idea. AI will ask follow-up questions to build a comprehensive master prompt.
              </p>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A SaaS dashboard for tracking crypto portfolio with real-time prices, alerts, and portfolio analytics..."
                rows={3}
                className="resize-none"
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleStartDiscovery}
                  disabled={loading || !prompt.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <LoadingSpinner text="Starting..." />
                  ) : (
                    'Start Discovery (Recommended)'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleQuickGenerate}
                  disabled={loading || !prompt.trim()}
                >
                  Quick Generate
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Questions */}
          {step === 'questions' && aiQuestions && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Question {currentQuestionIndex + 1} of {aiQuestions.questions.length}
                  </span>
                  <button
                    onClick={resetFlow}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Start Over
                  </button>
                </div>
                <div className="h-2 bg-bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {aiQuestions.summary && currentQuestionIndex === 0 && (
                <p className="text-sm text-accent bg-accent/10 p-3 rounded-md">
                  {aiQuestions.summary}
                </p>
              )}

              <div className="bg-bg-card p-4 rounded-lg">
                <p className="text-text-primary font-medium mb-3">
                  {aiQuestions.questions[currentQuestionIndex]}
                </p>
                <Input
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Your answer..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAnswerSubmit()
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={loading || !currentAnswer.trim()}
                  className="flex-1"
                >
                  {currentQuestionIndex < aiQuestions.questions.length - 1 ? 'Next' : 'Generate Config'}
                </Button>
                <Button variant="secondary" onClick={handleSkipQuestion}>
                  Skip
                </Button>
              </div>

              {answers.length > 0 && (
                <details className="text-sm">
                  <summary className="text-text-secondary cursor-pointer hover:text-text-primary">
                    View previous answers ({answers.length})
                  </summary>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {answers.map((qa, i) => (
                      <div key={i} className="bg-bg-card p-2 rounded text-xs">
                        <p className="text-text-secondary">{qa.question}</p>
                        <p className="text-text-primary">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}

          {/* Loading state during generation */}
          {loading && step === 'questions' && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Generating your comprehensive config..." />
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && suggestions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">Your Config</h4>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={applyAll}>
                    Apply All
                  </Button>
                  <Button variant="secondary" size="sm" onClick={resetFlow}>
                    Start Over
                  </Button>
                </div>
              </div>

              {/* Project Names */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  Project Names
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {suggestions.projectNames.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => applyName(name)}
                      className="px-3 py-1.5 text-sm bg-bg-card hover:bg-accent/20 border border-border hover:border-accent rounded-md transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* One-liners */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  One-liner Descriptions
                </label>
                <div className="flex flex-col gap-2 mt-1">
                  {suggestions.oneLiners.map((line, i) => (
                    <button
                      key={i}
                      onClick={() => applyOneLiner(line)}
                      className="px-3 py-2 text-sm text-left bg-bg-card hover:bg-accent/20 border border-border hover:border-accent rounded-md transition-colors"
                    >
                      {line}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Type & Theme */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    App Type
                  </label>
                  <p className="mt-1 text-sm text-text-primary capitalize">
                    {suggestions.appType}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    Theme
                  </label>
                  <p className="mt-1 text-sm text-text-primary capitalize">
                    {suggestions.theme.replace(/-/g, ' ')}
                  </p>
                </div>
              </div>

              {/* Target User */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  Target User
                </label>
                <p className="mt-1 text-sm text-text-secondary">
                  {suggestions.targetUser}
                </p>
              </div>

              {/* Features */}
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide">
                  Features ({suggestions.customFeatures.length})
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {suggestions.customFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-accent/10 text-accent border border-accent/30 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* MVP Scope (if available) */}
              {suggestions.mvpScope && (
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    MVP Scope
                  </label>
                  <p className="mt-1 text-sm text-text-secondary bg-bg-card p-3 rounded-md">
                    {suggestions.mvpScope}
                  </p>
                </div>
              )}

              {/* Key Decisions (if available) */}
              {suggestions.keyDecisions && (
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wide">
                    Key Decisions
                  </label>
                  <p className="mt-1 text-sm text-text-secondary bg-bg-card p-3 rounded-md">
                    {suggestions.keyDecisions}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}

function LoadingSpinner({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text}
    </span>
  )
}

export type AppType = 'saas' | 'dashboard' | 'ecommerce' | 'landing' | 'api' | 'other'

export type Frontend = 'nextjs' | 'remix' | 'astro'
export type Database = 'supabase' | 'firebase' | 'planetscale' | 'none'
export type Auth = 'supabase' | 'clerk' | 'nextauth' | 'none'
export type Hosting = 'netlify' | 'vercel' | 'railway'
export type BackendAutomation = 'n8n' | 'edge-functions' | 'claude-picks'
export type AIProvider = 'claude' | 'openai' | 'none'
export type Marketing = 'gohighlevel' | 'none'
export type ColorMode = 'dark-only' | 'light-only' | 'both'

export interface TechStack {
  frontend: Frontend
  database: Database
  auth: Auth
  hosting: Hosting
  backendAutomation: BackendAutomation
  ai: AIProvider
  marketing: Marketing
}

export interface PromptConfig {
  // Project basics
  projectName: string
  oneLiner: string
  shipBy: string
  targetUser: string
  appType: AppType

  // Tech stack
  techStack: TechStack

  // Design
  theme: string
  colorMode: ColorMode

  // Options
  includeSentry: boolean
  includeFuzzySearch: boolean
  includeToasts: boolean

  // Custom sections
  customFeatures: string[]
  customDbTables: string
  specialRequirements: string
}

export interface SavedConfig {
  id: string
  userId: string
  name: string
  config: PromptConfig
  createdAt: string
  updatedAt: string
}

export const defaultTechStack: TechStack = {
  frontend: 'nextjs',
  database: 'supabase',
  auth: 'supabase',
  hosting: 'netlify',
  backendAutomation: 'claude-picks',
  ai: 'claude',
  marketing: 'none',
}

export const defaultConfig: PromptConfig = {
  projectName: '',
  oneLiner: '',
  shipBy: '',
  targetUser: '',
  appType: 'saas',
  techStack: defaultTechStack,
  theme: 'purple-tech',
  colorMode: 'dark-only',
  includeSentry: true,
  includeFuzzySearch: true,
  includeToasts: true,
  customFeatures: [],
  customDbTables: '',
  specialRequirements: '',
}

export interface AISuggestions {
  projectNames: string[]
  oneLiners: string[]
  appType: AppType
  targetUser: string
  techStack: TechStack
  theme: string
  customFeatures: string[]
  customDbTables?: string
  specialRequirements: string
  mvpScope?: string
  keyDecisions?: string
}

export interface AIQuestions {
  questions: string[]
  summary: string
}

export interface QAItem {
  question: string
  answer: string
}

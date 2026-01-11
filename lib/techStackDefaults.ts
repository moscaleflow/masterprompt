import { AppType, TechStack } from '@/types'

export const techStackByAppType: Record<AppType, Partial<TechStack>> = {
  saas: {
    frontend: 'nextjs',
    database: 'supabase',
    auth: 'supabase',
    hosting: 'netlify',
    backendAutomation: 'edge-functions',
    ai: 'claude',
    marketing: 'gohighlevel',
  },
  dashboard: {
    frontend: 'nextjs',
    database: 'supabase',
    auth: 'supabase',
    hosting: 'netlify',
    backendAutomation: 'edge-functions',
    ai: 'none',
    marketing: 'none',
  },
  ecommerce: {
    frontend: 'nextjs',
    database: 'supabase',
    auth: 'supabase',
    hosting: 'netlify',
    backendAutomation: 'n8n',
    ai: 'none',
    marketing: 'gohighlevel',
  },
  landing: {
    frontend: 'astro',
    database: 'none',
    auth: 'none',
    hosting: 'netlify',
    backendAutomation: 'claude-picks',
    ai: 'none',
    marketing: 'gohighlevel',
  },
  api: {
    frontend: 'nextjs',
    database: 'supabase',
    auth: 'supabase',
    hosting: 'railway',
    backendAutomation: 'edge-functions',
    ai: 'claude',
    marketing: 'none',
  },
  other: {
    frontend: 'nextjs',
    database: 'supabase',
    auth: 'supabase',
    hosting: 'netlify',
    backendAutomation: 'claude-picks',
    ai: 'none',
    marketing: 'none',
  },
}

export const frontendOptions = [
  { value: 'nextjs', label: 'Next.js 14+ (App Router)' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

export const databaseOptions = [
  { value: 'supabase', label: 'Supabase (Postgres)' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'planetscale', label: 'PlanetScale' },
  { value: 'none', label: 'None' },
]

export const authOptions = [
  { value: 'supabase', label: 'Supabase Auth' },
  { value: 'clerk', label: 'Clerk' },
  { value: 'nextauth', label: 'NextAuth.js' },
  { value: 'none', label: 'None' },
]

export const hostingOptions = [
  { value: 'netlify', label: 'Netlify' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'railway', label: 'Railway' },
]

export const backendAutomationOptions = [
  { value: 'n8n', label: 'n8n (workflow automation)' },
  { value: 'edge-functions', label: 'Supabase Edge Functions' },
  { value: 'claude-picks', label: 'Claude picks best for project' },
]

export const aiOptions = [
  { value: 'claude', label: 'Claude API (Anthropic)' },
  { value: 'openai', label: 'OpenAI API' },
  { value: 'none', label: 'None' },
]

export const marketingOptions = [
  { value: 'gohighlevel', label: 'GoHighLevel' },
  { value: 'none', label: 'None' },
]

export const appTypeOptions = [
  { value: 'saas', label: 'SaaS Application' },
  { value: 'dashboard', label: 'Dashboard / Admin Panel' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'api', label: 'API / Backend Service' },
  { value: 'other', label: 'Other' },
]

export const colorModeOptions = [
  { value: 'dark-only', label: 'Dark Mode Only' },
  { value: 'light-only', label: 'Light Mode Only' },
  { value: 'both', label: 'Both (with toggle)' },
]

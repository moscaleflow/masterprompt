import { PromptConfig } from '@/types'
import { getThemeById, Theme } from './themes'

const getTechStackDescription = (config: PromptConfig): string => {
  const { techStack } = config

  const frontendMap: Record<string, string> = {
    nextjs: 'Next.js 14+ (App Router)',
    remix: 'Remix',
    astro: 'Astro',
  }

  const databaseMap: Record<string, string> = {
    supabase: 'Supabase (Postgres)',
    firebase: 'Firebase',
    planetscale: 'PlanetScale',
    none: 'None',
  }

  const authMap: Record<string, string> = {
    supabase: 'Supabase Auth',
    clerk: 'Clerk',
    nextauth: 'NextAuth.js',
    none: 'None',
  }

  const hostingMap: Record<string, string> = {
    netlify: 'Netlify',
    vercel: 'Vercel',
    railway: 'Railway',
  }

  const backendMap: Record<string, string> = {
    n8n: 'n8n (workflow automation)',
    'edge-functions': 'Supabase Edge Functions',
    'claude-picks': '[Claude to determine based on project needs]',
  }

  const aiMap: Record<string, string> = {
    claude: 'Claude API (Anthropic)',
    openai: 'OpenAI API',
    none: 'None',
  }

  const marketingMap: Record<string, string> = {
    gohighlevel: 'GoHighLevel',
    none: 'None',
  }

  let stack = `TECH STACK
\t- Frontend: ${frontendMap[techStack.frontend]}
\t- Database: ${databaseMap[techStack.database]}`

  if (techStack.auth !== 'none') {
    stack += `\n\t- Auth: ${authMap[techStack.auth]}`
  }

  stack += `\n\t- Deployment: ${hostingMap[techStack.hosting]}`

  if (techStack.backendAutomation !== 'claude-picks') {
    stack += `\n\t- Backend Automation: ${backendMap[techStack.backendAutomation]}`
  } else {
    stack += `\n\t- Backend Automation: n8n or Supabase Edge Functions (Claude picks best)`
  }

  if (config.includeFuzzySearch) {
    stack += '\n\t- Search: Fuse.js (fuzzy search on all search inputs)'
  }

  if (config.includeToasts) {
    stack += '\n\t- Toasts: sonner or react-hot-toast'
  }

  stack += '\n\t- Date picker: react-day-picker'

  if (config.includeSentry) {
    stack += '\n\t- Error tracking: Sentry'
  }

  if (techStack.ai !== 'none') {
    stack += `\n\t- AI/LLM: ${aiMap[techStack.ai]}`
  }

  if (techStack.marketing !== 'none') {
    stack += `\n\t- Marketing: ${marketingMap[techStack.marketing]}`
  }

  return stack
}

const getDesignSystem = (config: PromptConfig): string => {
  const theme = getThemeById(config.theme)
  const colorModeText =
    config.colorMode === 'dark-only'
      ? 'Dark mode ONLY - no light mode toggle'
      : config.colorMode === 'light-only'
      ? 'Light mode ONLY - no dark mode toggle'
      : 'Both dark and light mode with toggle'

  return `DESIGN SYSTEM
Colors (${config.colorMode === 'both' ? 'Dark Mode Defaults' : config.colorMode === 'dark-only' ? 'Dark Mode ONLY' : 'Light Mode ONLY'})
--accent: ${theme.colors.accent}          /* Primary accent */
--accent-hover: ${theme.colors.accentHover}    /* Hover state */
--bg-dark: ${theme.colors.bgDark}         /* Page background */
--bg-card: ${theme.colors.bgCard}         /* Cards, panels */
--bg-elevated: ${theme.colors.bgElevated}     /* Modals, dropdowns */
--text-primary: ${theme.colors.textPrimary}    /* Main text */
--text-secondary: ${theme.colors.textSecondary}  /* Labels, placeholders */
--border: ${theme.colors.border}          /* All borders */
--success: ${theme.colors.success}
--warning: ${theme.colors.warning}
--danger: ${theme.colors.danger}

UI Rules
\t- ${colorModeText}
\t- NO system defaults - all UI custom styled
\t- NO gradients, glow effects, or emojis
\t- Font: Inter | Body: 16px min | Spacing: 8px grid | Border radius: 6px
\t- Toasts: #252542 bg + colored left border, top-right, 4s dismiss
\t- Modals: #252542 bg, close on Escape + overlay click
\t- Checkboxes: ${theme.colors.accent} fill when checked
\t- Search: Always fuzzy (Fuse.js), 300ms debounce, highlight matches`
}

const getEnvVars = (config: PromptConfig): string => {
  const { techStack } = config
  let vars = `ENV VARS
\t- Document all env vars in /docs/PRD.md Section 7
\t- When adding a new env var: update PRD first, then code
\t- Never commit .env files

Required (always):
NEXT_PUBLIC_APP_URL=`

  if (techStack.database === 'supabase' || techStack.auth === 'supabase') {
    vars += `
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=`
  }

  if (techStack.database === 'firebase') {
    vars += `
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=`
  }

  if (techStack.database === 'planetscale') {
    vars += `
DATABASE_URL=`
  }

  if (techStack.auth === 'clerk') {
    vars += `
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=`
  }

  if (config.includeSentry) {
    vars += `
NEXT_PUBLIC_SENTRY_DSN=`
  }

  if (techStack.ai === 'claude') {
    vars += `
ANTHROPIC_API_KEY=`
  }

  if (techStack.ai === 'openai') {
    vars += `
OPENAI_API_KEY=`
  }

  if (techStack.backendAutomation === 'n8n') {
    vars += `
N8N_WEBHOOK_URL=`
  }

  return vars
}

export const generateMasterPrompt = (config: PromptConfig): string => {
  const prompt = `PROJECT
Name: ${config.projectName || '[PROJECT NAME]'}
One-liner: ${config.oneLiner || '[What this app does in one sentence]'}
Ship by: ${config.shipBy || '[DATE/DEADLINE]'}
Target user: ${config.targetUser || '[Who uses this]'}

SESSION START
Every session, do this FIRST before any coding:
\t- Read /docs/PRD.md
\t- Read /docs/TODO.md
\t- Read /docs/HANDOFF.md
\t- Check current branch and last commit
\t- Ask: "What are we working on this session?"

${getTechStackDescription(config)}

${getDesignSystem(config)}

FILE STRUCTURE
/app                    # Next.js App Router pages
/components             # PascalCase: Button.tsx, DataTable.tsx
/hooks                  # camelCase with use: useAuth.ts
/lib                    # Utilities, Supabase client
/types                  # TypeScript types
/docs                   # PRD.md, TODO.md, IDEAS.md, HANDOFF.md
/scripts                # seed.ts, migrations

NAMING CONVENTIONS
\t- Components: PascalCase (UserCard.tsx)
\t- Pages/routes: kebab-case (user-settings/page.tsx)
\t- Hooks: camelCase with use prefix (useDebounce.ts)
\t- DB tables: snake_case plural (user_profiles)
\t- DB columns: snake_case (created_at, is_deleted)
\t- Env vars: SCREAMING_SNAKE (NEXT_PUBLIC_SUPABASE_URL)
\t- Event handlers: handleAction (handleSubmit, handleDelete)
\t- Boolean props: is/has/should prefix (isLoading, hasError)

DATABASE PATTERNS
Always include on tables:
id UUID DEFAULT gen_random_uuid() PRIMARY KEY
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
is_deleted BOOLEAN DEFAULT FALSE
deleted_at TIMESTAMPTZ

\t- Soft delete by default - set is_deleted = true, never hard delete
\t- All queries filter WHERE is_deleted = FALSE
\t- Store all timestamps in UTC

BEHAVIOR RULES
Follow these exactly:

PRD
\t- PRD lives at /docs/PRD.md - read it every session
\t- NO changes to PRD without my explicit approval
\t- If a feature isn't in PRD, don't build it
\t- Reference PRD section numbers in commits

HANDOFF
\t- HANDOFF.md lives at /docs/HANDOFF.md - update it every session
\t- Contains: current work, completed features, tried approaches, next steps
\t- Use for context when starting new conversations
\t- Format includes: Quick Context, Current Session, Build Status, Tried & Decided, Next Steps

Decisions
\t- ASK before major architectural decisions
\t- For minor decisions: make reasonable choice, mention it briefly

Blockers
\t- If blocked but NOT damaging to app: add TODO comment and continue
\t- If blocked AND potentially damaging: STOP and ask me
\t- TODO format: // TODO: [description] - [date]

Testing & Commits
\t- Run and test code before considering it done
\t- Commit only when I request it
\t- Commit format: type(scope): description
\t- Types: feat, fix, docs, style, refactor, chore

TODO & IDEAS MANAGEMENT
Maintain these files - read at session start, update as we work:

/docs/TODO.md
\t- Active tasks and blockers
\t- Bugs to fix
\t- Technical debt
\t- Mark items [DONE] when complete, move to bottom

# TODO.md format:
## Active
- [ ] Task description - PRD Section X
- [ ] Bug: description

## Blocked
- [ ] Task - BLOCKED: reason

## Done
- [x] Completed task - 2024-01-15

/docs/IDEAS.md
\t- Future features (not in current PRD)
\t- Nice-to-haves
\t- User requests
\t- Add ideas as they come up during development
\t- DO NOT build these without approval - just log them

# IDEAS.md format:
## Future Features
- Idea description - added 2024-01-15
- Another idea - added 2024-01-16

## User Requests
- Request from [source] - added date

COMMUNICATION STYLE
Be concise:
\t- Bullet points for changes and status
\t- No over-explaining - I'll ask if I need more detail
\t- Don't repeat what I already know
\t- When done with a task, summarize: what changed, what files, any TODOs

Format for updates:
Done:
- Created UserCard component
- Added to /components/UserCard.tsx
- Integrated with DataTable

TODO added:
- Add loading skeleton (non-blocking)

Ready to test: http://localhost:3000/users

${getEnvVars(config)}

FIRST DAY CHECKLIST
\t- Create /docs/PRD.md with full PRD
\t- Create /docs/TODO.md (empty Active section)
\t- Create /docs/IDEAS.md (empty)
\t- Create /docs/HANDOFF.md (with template)
\t- Set up Next.js project with App Router
\t- Configure Supabase client
\t- Set up Tailwind with dark mode colors
\t- Add favicon (32x32 + 180x180 Apple)
\t- Add meta tags (title, description, OG image)${config.includeSentry ? '\n\t- Set up Sentry' : ''}
\t- Create .env.example with all required vars
\t- Set up GitHub Actions keep-alive for Supabase
\t- Create initial database tables

COMMON PATTERNS
Loading states
- Use skeleton loaders, not spinners
- Show immediately, no delay

Empty states
- Helpful message (not just "No data")
- Primary action button
- Example: "No records yet. + Add your first record"

Error handling
- Show toast for user errors
- Log to Sentry for system errors
- Always provide retry option or next step

Tables
- Default sort: most recent first
- Fuzzy search across all text columns
- URL params for filters (shareable)
- CSV export button top-right

PROJECT-SPECIFIC DETAILS
${config.customFeatures.length > 0 ? `Core features (MVP)
${config.customFeatures.map((f) => `\t- ${f}`).join('\n')}` : `Core features (MVP)
\t- [Feature 1 from PRD]
\t- [Feature 2 from PRD]
\t- [Feature 3 from PRD]`}

${config.customDbTables ? `Database tables
${config.customDbTables}` : `Database tables
[Paste schema from PRD or summarize main tables]`}

${config.specialRequirements ? `Special requirements
${config.specialRequirements}` : `Special requirements
[Auth needed? Roles? Timezone? Notifications? File uploads?]`}`

  return prompt
}

export const generatePRDTemplate = (config: PromptConfig): string => {
  return `# ${config.projectName || '[Project Name]'} - Product Requirements Document

## 1. Overview

**Project Name:** ${config.projectName || '[Project Name]'}
**One-liner:** ${config.oneLiner || '[What this app does in one sentence]'}
**Target User:** ${config.targetUser || '[Who uses this]'}
**Ship by:** ${config.shipBy || '[DATE/DEADLINE]'}

## 2. Problem Statement

[Describe the problem this app solves]

## 3. Core Features (MVP)

### 3.1 Feature 1
[Description]

### 3.2 Feature 2
[Description]

### 3.3 Feature 3
[Description]

## 4. Database Schema

\`\`\`sql
-- Example table
CREATE TABLE example_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);
\`\`\`

## 5. UI/UX Specifications

### 5.1 Layout
[Describe main layout]

### 5.2 Key Screens
- Home
- [Screen 2]
- [Screen 3]

## 6. User Flows

### 6.1 Primary Flow
1. User lands on homepage
2. [Step 2]
3. [Step 3]

## 7. Environment Variables

\`\`\`bash
${generateEnvExample(config)}
\`\`\`

## 8. File Structure

\`\`\`
/app
/components
/hooks
/lib
/types
/docs
\`\`\`

## 9. Non-Functional Requirements

- Performance: [requirements]
- Accessibility: [requirements]
- Browser Support: [requirements]

## 10. Out of Scope (MVP)

- [Feature to skip]
- [Another feature to skip]

---

*Last updated: [DATE]*`
}

export const generateTODOTemplate = (): string => {
  return `# TODO

## Active
- [ ] Set up project structure
- [ ] Create database schema
- [ ] Build core UI components
- [ ] Implement main feature

## Blocked
(none)

## Done
- [x] Initial project setup - [DATE]`
}

export const generateIDEASTemplate = (): string => {
  return `# IDEAS

## Future Features
- [Future idea] - added [DATE]

## User Requests
(none yet)

## Nice-to-Haves
- [Nice to have] - added [DATE]`
}

export const generateHANDOFFTemplate = (config: PromptConfig): string => {
  return `# HANDOFF - ${config.projectName || '[Project Name]'}

> This document is the living log of the build. Update it every session. Use it to hand off context between Claude conversations.

---

## Quick Context
**What is this?** ${config.oneLiner || '[One-liner description]'}
**Tech Stack:** ${config.techStack.frontend === 'nextjs' ? 'Next.js 14' : config.techStack.frontend}, ${config.techStack.database}, ${config.techStack.hosting}
**Repo:** [repo-name]
**Branch:** [current-branch]

---

## Current Session
**Date:** [DATE]
**Focus:** [What you're working on]

### Working On Now
- [Current task]

### Completed This Session
- [x] [Completed item]

---

## Build Status
**Overall Progress:** [X]% ([phase])

### Completed Features
- [Feature 1]

### In Progress
- [Feature being built]

### Not Started
- [Feature to build]

---

## Tried & Decided

### Decisions Made
| Decision | Reasoning | Date |
|----------|-----------|------|
| [Decision] | [Why] | [Date] |

### Approaches Tried
- [Approach and outcome]

### What Didn't Work
- [Failed approach and why]

---

## Next Steps
1. [Next task]
2. [Following task]
3. [Future task]

---

## New Conversation Handoff

When starting a new Claude session, do this:

1. **Read these files first:**
   \`\`\`
   /docs/PRD.md      # Full requirements
   /docs/TODO.md     # Current tasks
   /docs/HANDOFF.md  # This file - build context
   \`\`\`

2. **Check git status:**
   \`\`\`bash
   git status
   git log --oneline -5
   \`\`\`

3. **Resume from "Working On Now" section above**

4. **Ask:** "What should we focus on this session?"

---

## Environment Setup

For local development:
\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys

# Run dev server
npm run dev
\`\`\`

---

## Known Issues
(none yet)

---

## Useful Commands
\`\`\`bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run linter
\`\`\`

---

*Last updated: [DATE] - Session [N]*`
}

export const generateEnvExample = (config: PromptConfig): string => {
  const { techStack } = config
  let env = `# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`

  if (techStack.database === 'supabase' || techStack.auth === 'supabase') {
    env += `
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
`
  }

  if (techStack.database === 'firebase') {
    env += `
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
`
  }

  if (techStack.database === 'planetscale') {
    env += `
# PlanetScale
DATABASE_URL=
`
  }

  if (techStack.auth === 'clerk') {
    env += `
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
`
  }

  if (config.includeSentry) {
    env += `
# Sentry
NEXT_PUBLIC_SENTRY_DSN=
`
  }

  if (techStack.ai === 'claude') {
    env += `
# Claude API
ANTHROPIC_API_KEY=
`
  }

  if (techStack.ai === 'openai') {
    env += `
# OpenAI
OPENAI_API_KEY=
`
  }

  if (techStack.backendAutomation === 'n8n') {
    env += `
# n8n
N8N_WEBHOOK_URL=
`
  }

  return env.trim()
}

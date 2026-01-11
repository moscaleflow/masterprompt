# HANDOFF - MasterPrompt Generator

> This document is the living log of the build. Update it every session. Use it to hand off context between Claude conversations.

---

## Quick Context
**What is this?** A web app that generates Claude Code master prompts via a guided form.
**Tech Stack:** Next.js 14, Supabase, Netlify, Tailwind CSS
**Repo:** masterprompt
**Branch:** claude/setup-project-docs-3W6Ln

---

## Current Session
**Date:** 2025-01-11
**Focus:** Initial MVP build - complete project setup

### Working On Now
- Committing and pushing all changes

### Completed This Session
- [x] Created /docs/PRD.md with full requirements
- [x] Created /docs/TODO.md, IDEAS.md, HANDOFF.md
- [x] Initialized Next.js 14 project with TypeScript
- [x] Set up Tailwind with 5 preset themes (Purple Tech, Ocean Blue, Forest Green, Sunset Orange, Midnight Dark)
- [x] Created Supabase client with auth hooks
- [x] Built complete form UI (ProjectBasics, TechStackSelector, ThemeSelector, OptionsPanel)
- [x] Built preview panel with copy-to-clipboard for all outputs
- [x] Added Save/Load configuration modals with Supabase persistence
- [x] Created database schema SQL script
- [x] Verified successful build

---

## Build Status
**Overall Progress:** 80% (Core MVP complete, needs testing with Supabase)

### Completed Features
- Project configuration form with all fields
- Tech stack selector with smart defaults by app type
- Theme selector with 5 preset themes and live preview
- Options checkboxes (Sentry, fuzzy search, toasts)
- Custom features list management
- Master prompt generation
- Generated files (PRD.md, TODO.md, IDEAS.md, HANDOFF.md, .env.example)
- Copy-to-clipboard for all outputs
- Auth modal (sign in/sign up)
- Save/Load configurations (requires Supabase setup)

### In Progress
- Testing with actual Supabase project

### Not Started
- Deploy to Netlify
- End-to-end testing
- Mobile responsive tweaks (desktop-first is done)

---

## Tried & Decided

### Decisions Made
| Decision | Reasoning | Date |
|----------|-----------|------|
| Output as .md files | AI reads markdown well, user preference | 2025-01-11 |
| Preset themes only (MVP) | Faster to ship, custom picker is future feature | 2025-01-11 |
| Copy-to-clipboard only | User prefers simplicity over download options | 2025-01-11 |
| Backend choice as user option | n8n vs Edge Functions depends on project needs | 2025-01-11 |
| Mock Supabase client for build | Allows build without env vars set | 2025-01-11 |

### Approaches Tried
- Used `@supabase/ssr` for auth - works well with Next.js App Router
- Created mock Supabase client for build-time to avoid env var errors

### What Didn't Work
- Initial build failed without Supabase env vars - fixed with mock client fallback

---

## Next Steps
1. Set up Supabase project and add env vars
2. Run database schema migration (scripts/schema.sql)
3. Test save/load functionality
4. Deploy to Netlify
5. Test full user flow

---

## New Conversation Handoff

When starting a new Claude session, do this:

1. **Read these files first:**
   ```
   /docs/PRD.md      # Full requirements
   /docs/TODO.md     # Current tasks
   /docs/HANDOFF.md  # This file - build context
   ```

2. **Check git status:**
   ```bash
   git status
   git log --oneline -5
   ```

3. **Resume from "Working On Now" section above**

4. **Ask:** "What should we focus on this session?"

---

## Environment Setup

For local development:
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Run database migration in Supabase SQL Editor
# Copy contents of scripts/schema.sql

# Run dev server
npm run dev
```

Required env vars (see /docs/PRD.md Section 7):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL

---

## Known Issues
- None currently

---

## Useful Commands
```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run linter

# Database
# Run scripts/schema.sql in Supabase SQL Editor
```

---

## File Structure Created
```
/app
  /page.tsx                    # Main generator page
  /layout.tsx                  # Root layout with Toaster
  /globals.css                 # Theme CSS variables
  /api/auth/callback/route.ts  # Supabase auth callback
/components
  /Form
    ProjectBasics.tsx
    TechStackSelector.tsx
    ThemeSelector.tsx
    OptionsPanel.tsx
  /Preview
    PromptPreview.tsx
    FilePreview.tsx
    CopyButton.tsx
  /Auth
    AuthModal.tsx
    UserMenu.tsx
  /Layout
    Header.tsx
  /ui
    Button.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    Checkbox.tsx
    Modal.tsx
  SaveLoadModal.tsx
/hooks
  useAuth.ts
  useCopyToClipboard.ts
  usePromptGenerator.ts
/lib
  supabase.ts
  supabase-server.ts
  themes.ts
  techStackDefaults.ts
  promptGenerator.ts
/types
  index.ts
/docs
  PRD.md
  TODO.md
  IDEAS.md
  HANDOFF.md
/scripts
  schema.sql
```

---

*Last updated: 2025-01-11 - Session 1*

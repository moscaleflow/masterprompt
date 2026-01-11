# MasterPrompt Generator - Product Requirements Document

## 1. Overview

**Project Name:** MasterPrompt Generator
**One-liner:** A web app that generates comprehensive Claude Code project configuration prompts with customizable tech stacks, themes, and best practices.
**Target User:** Developers using Claude Code who want consistent, well-structured project setups
**Ship by:** MVP in 1 week

## 2. Problem Statement

When starting new projects with Claude Code, developers need to provide detailed context about:
- Tech stack preferences
- Design system (colors, spacing, components)
- File structure conventions
- Database patterns
- Workflow rules

Creating these prompts from scratch is time-consuming and error-prone. MasterPrompt Generator solves this by providing a guided form that outputs production-ready Claude Code configuration prompts.

## 3. Core Features (MVP)

### 3.1 Project Configuration Form
- **Project basics**: Name, one-liner description, deadline, target user
- **App type selector**: SaaS, Dashboard, E-commerce, Landing Page, API, Other
  - Pre-fills suggested tech stack based on selection
- **Tech stack dropdowns** (with smart defaults):
  - Frontend: Next.js 14+ (default), Remix, Astro
  - Database: Supabase (default), Firebase, PlanetScale, None
  - Auth: Supabase Auth (default), Clerk, NextAuth, None
  - Hosting: Netlify (default), Vercel, Railway
  - Backend automation: n8n, Supabase Edge Functions, Claude picks best
  - AI/LLM: Claude API, OpenAI, None
  - Marketing: GoHighLevel, None
- **Design theme selector**: Preset themes with preview
  - Purple Tech (default - matches user's existing)
  - Ocean Blue
  - Forest Green
  - Sunset Orange
  - Midnight Dark
  - Custom (future feature)
- **Mode toggle**: Dark only (default), Light only, Both
- **Additional options**:
  - Include Sentry error tracking (checkbox)
  - Include fuzzy search setup (checkbox)
  - Include toast notifications (checkbox)

### 3.2 Prompt Output
- Generates complete master prompt in Markdown format
- Generates companion files:
  - PRD.md template
  - TODO.md template
  - IDEAS.md template
  - HANDOFF.md template (continuous build log)
  - .env.example with all required variables
- Copy-to-clipboard button for each section
- "Copy All" button for complete prompt

### 3.3 HANDOFF.md System
The generated HANDOFF.md serves as a living document for:
- **Current Session**: What's being worked on now
- **Build Status**: Overall progress, completed features
- **Active Work**: Current tasks in progress
- **Tried & Decided**: Approaches attempted, decisions made
- **Next Steps**: Planned work for upcoming sessions
- **Conversation Handoff**: Instructions for starting new Claude sessions

### 3.4 Save/Load Configurations
- User authentication via Supabase
- Save prompt configurations with a name
- Load saved configurations
- Edit existing configurations (change app idea, keep tech stack)
- Delete saved configurations

## 4. Database Schema

### 4.1 Tables

```sql
-- User prompt configurations
CREATE TABLE prompt_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,

  -- Project basics
  project_name VARCHAR(255),
  one_liner TEXT,
  ship_by DATE,
  target_user TEXT,
  app_type VARCHAR(50),

  -- Tech stack (stored as JSON for flexibility)
  tech_stack JSONB DEFAULT '{}',

  -- Design
  theme VARCHAR(50) DEFAULT 'purple-tech',
  color_mode VARCHAR(20) DEFAULT 'dark-only',

  -- Options
  include_sentry BOOLEAN DEFAULT TRUE,
  include_fuzzy_search BOOLEAN DEFAULT TRUE,
  include_toasts BOOLEAN DEFAULT TRUE,

  -- Custom sections
  custom_features TEXT[],
  custom_db_tables TEXT,
  special_requirements TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE prompt_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own configs"
  ON prompt_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own configs"
  ON prompt_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own configs"
  ON prompt_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own configs"
  ON prompt_configs FOR DELETE
  USING (auth.uid() = user_id);
```

## 5. UI/UX Specifications

### 5.1 Layout
- Single-page application
- Left panel: Configuration form (scrollable)
- Right panel: Live preview of generated prompt
- Top bar: Logo, Save/Load buttons, User menu

### 5.2 Theme Colors (Default - Purple Tech)
```css
--accent: #8B5CF6
--accent-hover: #7C3AED
--bg-dark: #0F0F1A
--bg-card: #1A1A2E
--bg-elevated: #252542
--text-primary: #F8FAFC
--text-secondary: #94A3B8
--border: #334155
--success: #10B981
--warning: #F59E0B
--danger: #EF4444
```

### 5.3 Components Needed
- Form inputs (text, textarea, select, checkbox)
- Theme preview cards
- Collapsible sections
- Copy button with success feedback
- Modal for save/load
- Toast notifications
- Auth modal (sign in/up)

## 6. User Flows

### 6.1 First-time User
1. Land on homepage
2. Fill out project configuration form
3. See live preview update
4. Click "Copy to Clipboard"
5. (Optional) Sign up to save configuration

### 6.2 Returning User
1. Sign in
2. Load saved configuration OR start fresh
3. Modify as needed
4. Copy or save updates

## 7. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=

# Optional - if using AI features later
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

## 8. File Structure

```
/app
  /page.tsx              # Main generator page
  /layout.tsx            # Root layout with providers
  /api
    /auth/callback/route.ts  # Supabase auth callback
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
    SplitPane.tsx
  /ui                    # Base UI components
    Button.tsx
    Input.tsx
    Select.tsx
    Checkbox.tsx
    Modal.tsx
    Toast.tsx
/hooks
  usePromptGenerator.ts  # Main form state & generation logic
  useAuth.ts
  useSavedConfigs.ts
  useCopyToClipboard.ts
/lib
  supabase.ts           # Supabase client
  promptGenerator.ts    # Prompt template generation
  themes.ts             # Theme definitions
  techStackDefaults.ts  # Default suggestions by app type
/types
  index.ts              # All TypeScript types
/docs
  PRD.md
  TODO.md
  IDEAS.md
  HANDOFF.md
```

## 9. Non-Functional Requirements

- **Performance**: Page load < 2s, form interactions instant
- **Accessibility**: Keyboard navigable, proper labels
- **Responsive**: Desktop-first, functional on tablet
- **Browser Support**: Chrome, Firefox, Safari (latest 2 versions)

## 10. Out of Scope (MVP)

- Custom color picker (use presets only)
- Team/sharing features
- Prompt version history
- AI-assisted prompt improvements
- Export as .zip file
- Multiple prompt formats (JSON output)

## 11. Success Metrics

- Users can generate a complete prompt in < 3 minutes
- Copy-to-clipboard works reliably
- Saved configs load correctly
- No critical bugs on launch

---

*Last updated: Session 1*

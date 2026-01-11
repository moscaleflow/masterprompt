import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface QAItem {
  question: string
  answer: string
}

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { mode, prompt, answers } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Mode 1: Generate follow-up questions
    if (mode === 'questions') {
      return await generateQuestions(prompt)
    }

    // Mode 2: Generate final config with all context
    if (mode === 'generate') {
      return await generateConfig(prompt, answers || [])
    }

    // Default: quick generate (backwards compatible)
    return await quickGenerate(prompt)
  } catch (error) {
    console.error('AI assist error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

async function generateQuestions(prompt: string) {
  const systemPrompt = `You are a product discovery expert helping developers plan their web application. Given a brief project idea, generate 6-8 insightful follow-up questions that will help build a comprehensive understanding of what they want to build.

Questions should cover:
1. Core functionality - What's the main thing users will do?
2. User personas - Who exactly will use this?
3. Key features - What are must-have vs nice-to-have features?
4. Data & content - What data will the app manage?
5. Integrations - Any third-party services needed?
6. Scale & performance - Expected user base, traffic?
7. Monetization - How will this make money (if applicable)?
8. Timeline & MVP - What's the minimum viable version?

Return a JSON object with:
- questions: array of question strings (6-8 questions)
- summary: a one-sentence summary of what you understand so far

Questions should be specific to the project, not generic. Make them easy to answer in 1-2 sentences.
Return ONLY valid JSON, no markdown.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Project idea: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate questions')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  return NextResponse.json(JSON.parse(content))
}

async function generateConfig(prompt: string, answers: QAItem[]) {
  const qaContext = answers
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
    .join('\n\n')

  const systemPrompt = `You are a senior software architect helping plan a web application. You've been given an initial project idea and detailed answers to discovery questions. Use ALL this context to generate a comprehensive project configuration.

Return a JSON object with these fields:
- projectNames: array of 3 catchy, relevant project name suggestions
- oneLiners: array of 3 concise one-liner descriptions (under 60 chars)
- appType: one of "saas", "dashboard", "ecommerce", "landing", "api", "other"
- targetUser: detailed description of the target user persona (2-3 sentences)
- techStack: object with recommendations:
  - frontend: "nextjs" | "remix" | "astro"
  - database: "supabase" | "firebase" | "planetscale" | "none"
  - auth: "supabase" | "clerk" | "nextauth" | "none"
  - hosting: "netlify" | "vercel" | "railway"
  - backendAutomation: "n8n" | "edge-functions" | "claude-picks"
  - ai: "claude" | "openai" | "none"
  - marketing: "gohighlevel" | "none"
- theme: one of "purple-tech", "ocean-blue", "forest-green", "sunset-orange", "midnight-dark"
- customFeatures: array of 8-12 specific features derived from the conversation
- customDbTables: suggested database tables/schema in a clear format
- specialRequirements: detailed technical requirements, constraints, and considerations (paragraph form)
- mvpScope: what should be in v1.0 vs later versions
- keyDecisions: important architectural decisions to make early

Be thorough - this will be used to generate a comprehensive master prompt for Claude Code.
Return ONLY valid JSON, no markdown.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Initial project idea: ${prompt}\n\nDiscovery Q&A:\n${qaContext}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate config')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  return NextResponse.json(JSON.parse(content))
}

async function quickGenerate(prompt: string) {
  const systemPrompt = `You are a helpful assistant that analyzes project descriptions and generates configuration suggestions for web applications.

Given a project description, return a JSON object with these fields:
- projectNames: array of 3 catchy, relevant project name suggestions (camelCase or PascalCase, no spaces)
- oneLiners: array of 3 concise one-liner descriptions (under 60 chars each)
- appType: one of "saas", "dashboard", "ecommerce", "landing", "api", "other"
- targetUser: a brief description of the target user persona
- techStack: object with recommendations:
  - frontend: "nextjs" | "remix" | "astro"
  - database: "supabase" | "firebase" | "planetscale" | "none"
  - auth: "supabase" | "clerk" | "nextauth" | "none"
  - hosting: "netlify" | "vercel" | "railway"
  - backendAutomation: "n8n" | "edge-functions" | "claude-picks"
  - ai: "claude" | "openai" | "none"
  - marketing: "gohighlevel" | "none"
- theme: one of "purple-tech", "ocean-blue", "forest-green", "sunset-orange", "midnight-dark"
- customFeatures: array of 3-5 suggested features based on the project description
- specialRequirements: any special technical requirements inferred from the description

Return ONLY valid JSON, no markdown.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Project description: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate suggestions')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  return NextResponse.json(JSON.parse(content))
}

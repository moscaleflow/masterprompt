import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

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

Be practical and match suggestions to the project type. For dashboards, suggest Supabase. For e-commerce, consider auth carefully. Return ONLY valid JSON, no markdown.`

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
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate suggestions' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    const suggestions = JSON.parse(content)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('AI assist error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

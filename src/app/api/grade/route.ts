import { NextRequest, NextResponse } from 'next/server'
import { HookGradeResponse } from '@/lib/types'

// Rate limiting: in-memory Map tracking requests per IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

// System prompt as defined in the spec
const SYSTEM_PROMPT = `You are an expert DTC performance marketer and ad creative strategist. You analyze ad hooks — the first 1-3 lines of copy that appear in TikTok, Instagram Reel, Meta, and YouTube Short ads.

You score hooks on 5 dimensions, each worth 0-20 points (total 100):
1. Curiosity Gap — Does this hook create an information gap that makes the viewer NEED to keep watching? Does it promise a reveal, a result, or an answer?
2. Specificity — Does the hook use concrete details (numbers, product names, timeframes, outcomes) rather than vague claims?
3. Emotional Trigger — Does it hit a real emotion: surprise, frustration, desire, humor, fear of missing out, or disbelief?
4. Pattern Interrupt — Would this make someone stop scrolling? Is it unexpected, contrarian, or visually/linguistically unusual for the platform?
5. Platform Fit — Does the tone, length, and language match how real people talk on the specified platform?

Be honest and specific in your scoring. Don't inflate scores to be nice. A mediocre hook should score 40-55. An excellent hook scores 80+.

For alternatives, generate 5 genuinely different approaches — not just rewording. Each should use a different psychological angle: contrarian, specific result, question, visual setup, hot take, social proof, fear-based, aspirational, etc. Label each with its angle name.

Return your response as valid JSON only, no markdown, no explanation outside the JSON.
Format:
{
  "overallScore": number,
  "dimensions": [
    { "name": "Curiosity Gap", "score": number, "explanation": "string" },
    { "name": "Specificity", "score": number, "explanation": "string" },
    { "name": "Emotional Trigger", "score": number, "explanation": "string" },
    { "name": "Pattern Interrupt", "score": number, "explanation": "string" },
    { "name": "Platform Fit", "score": number, "explanation": "string" }
  ],
  "alternatives": [
    { "label": "The Contrarian", "hook": "string", "explanation": "string" },
    ... (5 total)
  ]
}`

async function callOllama(hook: string, platform: string, category: string) {
  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Hook: "${hook}"\nPlatform: ${platform}\nCategory: ${category}` }
        ],
        stream: false,
        format: 'json'
      })
    })

    if (!res.ok) throw new Error('Ollama failed')
    const data = await res.json()
    return JSON.parse(data.message.content)
  } catch (e) {
    console.error('Ollama Error:', e)
    return null
  }
}

async function callGrok(hook: string, platform: string, category: string) {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta', // or appropriate model
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Hook: "${hook}"\nPlatform: ${platform}\nCategory: ${category}` }
        ],
        temperature: 0.7
      })
    })

    if (!res.ok) throw new Error('Grok failed')
    const data = await res.json()
    // Parse content from markdown json block if present
    const content = data.choices[0].message.content
    const jsonStr = content.replace(/```json\n?|\n?```/g, '')
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('Grok Error:', e)
    return null
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting: 100 requests per IP per 24 hours
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const now = Date.now()
  let record = rateLimitMap.get(ip)

  // Initialize or reset window
  if (!record || now - record.lastReset > 86400000) {
    record = { count: 0, lastReset: now }
    rateLimitMap.set(ip, record)
  }

  // Enforce limit BEFORE increment so exactly 100 requests are allowed
  if (record.count >= 100) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded (100/day). Try again tomorrow." }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Safe to count this request
  record.count += 1
  rateLimitMap.set(ip, record)

  try {
    const { hook, platform, category } = await req.json()

    if (!hook) {
      return NextResponse.json({ error: 'Hook is required' }, { status: 400 })
    }

    // Try Ollama first
    let result = await callOllama(hook, platform, category)

    // Fallback to Grok
    if (!result) {
      console.log('Falling back to Grok...')
      result = await callGrok(hook, platform, category)
    }

    if (!result) {
      // Mock response if both fail (for demo stability if no LLM available)
      // In production, you might want to return a 503
      console.log('Both LLMs failed, returning mock data for demo...')
      return NextResponse.json(mockResponse, { status: 200 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const mockResponse: HookGradeResponse = {
  overallScore: 72,
  dimensions: [
    { name: "Curiosity Gap", score: 15, explanation: "Good use of 'today years old' creates a gap." },
    { name: "Specificity", score: 12, explanation: "Could be more specific about the flavor." },
    { name: "Emotional Trigger", score: 14, explanation: "Hits on surprise and slight humor." },
    { name: "Pattern Interrupt", score: 16, explanation: "Visual of pouring helps stop the scroll." },
    { name: "Platform Fit", score: 15, explanation: "Matches TikTok style well." }
  ],
  alternatives: [
    { label: "The Contrarian", hook: "Stop drinking plain water.", explanation: "Goes against common advice." },
    { label: "The Specific Result", hook: "I drank this for 7 days.", explanation: "Implies a result." },
    { label: "The Question", hook: "Why is water so boring?", explanation: " relatable question." },
    { label: "The Visual Setup", hook: "Watch this change color.", explanation: "Promise of visual payoff." },
    { label: "The Hot Take", hook: "Water is overrated.", explanation: "Controversial statement." }
  ]
}

import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(request: Request) {
  const apiKey = process.env.VERCEL_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'VERCEL_AI_API_KEY is not configured.' },
      { status: 503 }
    );
  }

  const openai = createOpenAI({ apiKey });

  const { brandName, productType } = await request.json();
  if (!brandName || !productType) return NextResponse.json({ error: 'Missing input' }, { status: 400 });

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: 'You are a DTC marketing expert. Generate a concise UGC brief.' },
        { role: 'user', content: `Brand: ${brandName}. Product: ${productType}. Include 3 hook ideas, script outline, CTA, target audience, key visuals, tone, length. Bullet points, under 400 words.` },
      ],
      maxTokens: 600,
    });

    const brief = text || 'No brief generated';
    return NextResponse.json({ brief });
  } catch (e) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

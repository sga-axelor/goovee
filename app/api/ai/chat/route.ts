import {NextRequest, NextResponse} from 'next/server';

const AOS_URL = '<AOS_AI_URL>';
const AOS_JSESSION_ID = '<AOS_JSESSION_ID>';
const AOS_CSRF_TOKEN = '<AOS_CSRF_TOKEN>';
const AOS_COOKIE = `JSESSIONID=${AOS_JSESSION_ID}; CSRF-TOKEN=${AOS_CSRF_TOKEN}`;

export async function POST(req: NextRequest) {
  const {id, messages, context} = await req.json();

  const target = `${AOS_URL}/ws/ai/chat/completions`;

  const upstream = await fetch(target, {
    method: 'POST',
    signal: req.signal,
    headers: {
      'Content-Type': 'application/json',
      Cookie: AOS_COOKIE,
      'X-CSRF-Token': AOS_CSRF_TOKEN,
    },
    body: JSON.stringify({
      id,
      messages,
      options: {context: context ?? {}},
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    return new NextResponse(`AOS error ${upstream.status}: ${text}`, {
      status: upstream.status || 502,
    });
  }

  // Pass the AOS Vercel AI SDK UI message stream straight through to useChat.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ?? 'text/event-stream',
      'x-vercel-ai-ui-message-stream': 'v1',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
  });
}

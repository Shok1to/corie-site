import Anthropic from '@anthropic-ai/sdk';
import { CHAT_MODEL, MAX_OUTPUT_TOKENS, MAX_PAYLOAD_CHARS } from '@/lib/chat-config';
import { describeFailure } from '@/lib/chat-failure';
import { buildSystemPrompt } from '@/lib/chat-knowledge';
import { deliverLead, validateLead, type NormalisedLead } from '@/lib/chat-lead';
import { GUARD_MESSAGE, scanAnswer, type GuardPattern } from '@/lib/chat-output-guard';
import { validateConversation } from '@/lib/chat-validation';
import { clientKeyFromHeaders, leadLimiter, rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/** Constructed on first use, so importing this route never needs an API key. */
let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

/** Built on first use and kept: must stay byte-stable for prompt caching. */
let systemPrompt: string | null = null;
const getSystemPrompt = () => (systemPrompt ??= buildSystemPrompt());

const enabled = () => process.env.CHAT_ENABLED === 'true';

const json = (data: unknown, status: number, headers?: HeadersInit) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

/** One Server-Sent Events frame. JSON.stringify escapes newlines. */
const sseEvent = (event: string, data: unknown) =>
  `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

/** Lets the widget hide itself while the assistant is switched off. */
export async function GET(): Promise<Response> {
  return json({ enabled: enabled() }, 200, { 'Cache-Control': 'no-store' });
}

export async function POST(request: Request): Promise<Response> {
  // 1. Kill switch. Off unless CHAT_ENABLED is exactly "true", so deploying
  //    this cannot expose a billable endpoint by accident.
  if (!enabled()) {
    return json({ error: 'The assistant is unavailable right now.' }, 503);
  }

  // 2. Rate limit before anything expensive.
  const limit = await rateLimiter.check(clientKeyFromHeaders(request.headers));
  if (!limit.ok) {
    return json({ error: 'Too many messages. Please wait a moment.' }, 429, {
      'Retry-After': String(limit.retryAfterSeconds ?? 60),
    });
  }

  // 3. Size, then shape.
  const raw = await request.text();
  if (raw.length > MAX_PAYLOAD_CHARS) {
    return json({ error: 'That conversation is too large.' }, 400);
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  const validation = validateConversation(body);
  if (!validation.ok) {
    return json({ error: validation.error }, 400);
  }

  // The widget sends `lead` with the first message of a conversation only.
  let lead: NormalisedLead | null = null;
  let leadBlocked = false;
  const rawLead = (body as { lead?: unknown }).lead;
  if (rawLead !== undefined) {
    const check = validateLead(rawLead);
    if (!check.ok) {
      return json({ error: check.error, field: check.field }, 400);
    }
    // Sending email gets its own, much tighter budget than asking questions.
    const leadLimit = await leadLimiter.check(clientKeyFromHeaders(request.headers));
    if (leadLimit.ok) {
      lead = check.lead;
    } else {
      leadBlocked = true;
      console.warn('[chat] lead delivery rate-limited');
    }
  }

  const encoder = new TextEncoder();
  // If the visitor closes the widget, stop generating and stop billing.
  const abort = new AbortController();
  request.signal.addEventListener('abort', () => abort.abort());

  const responseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(sseEvent(event, data)));

      try {
        const turns = validation.messages;
        // Runs alongside the model call, so email never delays the first word.
        const delivery = lead
          ? deliverLead(lead, turns[turns.length - 1].content, new Date())
          : null;

        let answer = '';
        let guardTrip: GuardPattern | null = null;

        const stream = getClient().messages.stream(
          {
            model: CHAT_MODEL,
            max_tokens: MAX_OUTPUT_TOKENS,
            // Thinking stays on (the model default) so the rules get weighed;
            // low effort keeps short FAQ answers quick.
            output_config: { effort: 'low' },
            system: [
              { type: 'text', text: getSystemPrompt(), cache_control: { type: 'ephemeral' } },
            ],
            messages: turns.map((t) => ({ role: t.role, content: t.content })),
          },
          { signal: abort.signal },
        );

        stream.on('text', (delta) => {
          if (guardTrip) return;
          answer += delta;
          // Scan BEFORE forwarding, so the words completing a forbidden
          // phrase never reach the visitor.
          guardTrip = scanAnswer(answer);
          if (guardTrip) {
            abort.abort();
            return;
          }
          send('delta', { text: delta });
        });

        let final: Anthropic.Message | undefined;
        try {
          final = await stream.finalMessage();
        } catch (error) {
          // Our own abort above is not a failure. Anything else is real.
          if (!guardTrip) throw error;
        }

        if (final) {
          console.info('[chat] turn complete', {
            cacheRead: final.usage.cache_read_input_tokens,
            output: final.usage.output_tokens,
            stopReason: final.stop_reason,
          });
        }

        // Reported BEFORE any error event: the widget stops reading at `error`.
        if (delivery) {
          send('lead', await delivery);
        } else if (leadBlocked) {
          send('lead', { ok: false });
        }

        if (guardTrip) {
          console.warn('[chat] output guard tripped', { pattern: guardTrip });
          send('error', { message: GUARD_MESSAGE });
        } else if (final?.stop_reason === 'refusal') {
          // The model's safety systems declined. Offer the same way forward.
          send('error', { message: GUARD_MESSAGE });
        }

        send('done', {});
      } catch (error) {
        if (!abort.signal.aborted) {
          const { message, log } = describeFailure(error);
          console.error('[chat] stream failed:', log);
          send('error', { message });
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed by cancel() */
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(responseBody, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

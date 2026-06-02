import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const MODEL_SONNET = "claude-sonnet-4-6";
export const MODEL_HAIKU = "claude-haiku-4-5";

export type ChatTurn = { role: "user" | "assistant"; content: string };

type CallOptions = {
  systemPrompt: string;
  messages: ChatTurn[];
  model?: string;
  maxTokens?: number;
  jsonMode?: boolean;
};

type StreamOptions = {
  systemPrompt: string;
  messages: ChatTurn[];
  model?: string;
  maxTokens?: number;
};

/**
 * Single source of truth untuk semua Claude API call.
 * - Prompt caching aktif (cache_control: ephemeral) di system prompt
 *   → ~90% hemat input token saat percakapan multi-turn.
 * - Hanya kirim 10 pesan terakhir untuk konteks.
 */
export async function callClaude({
  systemPrompt,
  messages,
  model = MODEL_SONNET,
  maxTokens = 1000,
  jsonMode = false,
}: CallOptions) {
  const trimmed = messages.slice(-10);

  const finalMessages = jsonMode
    ? [
        ...trimmed,
        {
          role: "assistant" as const,
          content: "{",
        },
      ]
    : trimmed;

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: finalMessages,
  });

  const text = response.content
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("")
    .trim();

  if (jsonMode) {
    const raw = "{" + text;
    try {
      return { text: raw, json: JSON.parse(raw), usage: response.usage };
    } catch {
      // Fallback: cari blok JSON
      const match = raw.match(/\{[\s\S]*\}/);
      return { text: raw, json: match ? JSON.parse(match[0]) : null, usage: response.usage };
    }
  }

  return { text, json: null, usage: response.usage };
}

/**
 * Streaming variant — emit text deltas via async generator.
 * Konsumer bisa pakai `for await (const chunk of streamClaude(...))`.
 * Setelah generator selesai, baca `final()` untuk dapat full text + usage.
 */
export function streamClaude({
  systemPrompt,
  messages,
  model = MODEL_SONNET,
  maxTokens = 400,
}: StreamOptions) {
  const stream = anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: messages.slice(-10),
  });

  async function* textChunks() {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }

  async function final() {
    const msg = await stream.finalMessage();
    const text = msg.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("")
      .trim();
    return { text, usage: msg.usage };
  }

  return { textChunks, final };
}

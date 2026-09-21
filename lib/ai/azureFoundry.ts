import { z } from "zod";

/**
 * Azure AI Foundry / Azure OpenAI Centralized Service
 * Built for Microsoft AI-103: Azure AI Apps and Agents Developer
 */

export const DEFAULT_AZURE_MODEL = process.env.AZURE_AI_FOUNDRY_MODEL || "gpt-4o";

export function getAzureFoundryEndpoint(): string {
  const raw =
    process.env.AZURE_AI_FOUNDRY_ENDPOINT?.trim() ||
    process.env.AZURE_OPENAI_ENDPOINT?.trim() ||
    "https://yashplacey-resource.services.ai.azure.com/openai/v1";

  // Normalize: ensure it points to the /openai/v1 or /v1 chat completions path
  let endpoint = raw.replace(/\/+$/, "");
  if (!endpoint.endsWith("/openai/v1") && !endpoint.endsWith("/v1")) {
    if (endpoint.includes(".services.ai.azure.com") || endpoint.includes(".openai.azure.com")) {
      endpoint = `${endpoint}/openai/v1`;
    }
  }
  return endpoint;
}

export function isAzureFoundryConfigured(): boolean {
  return Boolean(
    (process.env.AZURE_AI_FOUNDRY_API_KEY?.trim() || process.env.AZURE_OPENAI_API_KEY?.trim()) &&
    (process.env.AZURE_AI_FOUNDRY_ENDPOINT?.trim() || process.env.AZURE_OPENAI_ENDPOINT?.trim())
  );
}

export function getAzureFoundryApiKey(): string {
  const key =
    process.env.AZURE_AI_FOUNDRY_API_KEY?.trim() ||
    process.env.AZURE_OPENAI_API_KEY?.trim();

  if (!key) {
    throw new Error("Azure AI Foundry API Key is missing. Set AZURE_AI_FOUNDRY_API_KEY in server environment.");
  }
  return key;
}

export interface AzureGenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
}

/**
 * Text generation via Azure AI Foundry Model Inference
 */
export async function generateAzureFoundryText(options: AzureGenerateTextOptions): Promise<string> {
  const endpoint = getAzureFoundryEndpoint();
  const apiKey = getAzureFoundryApiKey();
  const model = options.model || DEFAULT_AZURE_MODEL;

  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  if (options.systemInstruction) {
    messages.push({ role: "system", content: options.systemInstruction });
  }
  messages.push({ role: "user", content: options.prompt });

  const res = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: options.temperature ?? 0.2,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Azure AI Foundry request failed (status ${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export interface AzureStructuredOptions<T> {
  prompt: string;
  schema: z.ZodType<T>;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxRetries?: number;
}

/**
 * Structured JSON generation via Azure AI Foundry with Zod schema validation and automatic retry
 */
export async function generateAzureFoundryStructuredJson<T>(
  options: AzureStructuredOptions<T>
): Promise<T> {
  const endpoint = getAzureFoundryEndpoint();
  const apiKey = getAzureFoundryApiKey();
  const model = options.model || DEFAULT_AZURE_MODEL;
  const maxRetries = options.maxRetries ?? 2;

  let currentPrompt = options.prompt;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const messages: Array<{ role: "system" | "user"; content: string }> = [];
      const systemPrompt = [
        options.systemInstruction || "You are an expert AI agent that returns strictly structured JSON matching the requested schema.",
        "CRITICAL: Your response must be 100% valid JSON without markdown code blocks, conversational greetings, or commentary. Return ONLY the JSON object.",
      ].join("\n\n");

      messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: currentPrompt });

      const res = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          temperature: options.temperature ?? 0.1,
          messages,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Azure AI Foundry HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content?.trim();

      if (!rawText) {
        throw new Error("Azure AI Foundry returned an empty response.");
      }

      // Handle possible markdown code fences
      let cleanedJson = rawText;
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(cleanedJson);
      const validation = options.schema.safeParse(parsed);

      if (!validation.success) {
        const errorDetails = JSON.stringify(validation.error.format());
        throw new Error(`Schema validation error: ${errorDetails}`);
      }

      return validation.data;
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Azure AI Foundry Agent] Attempt ${attempt}/${maxRetries} failed: ${msg}`);

      if (attempt < maxRetries) {
        currentPrompt = `${options.prompt}\n\nNOTE: The previous response was rejected: ${msg}. Make sure you adhere strictly to the JSON schema.`;
      }
    }
  }

  const finalMsg = lastError instanceof Error ? lastError.message : "Azure AI Foundry structured generation failed";
  console.error(`[Azure AI Foundry Agent] Structured generation failed after ${maxRetries} attempts:`, finalMsg);
  throw new Error(finalMsg);
}

export interface AzureChatOptions {
  systemInstruction: string;
  messages: Array<{ role: "user" | "model" | "assistant"; content: string }>;
  model?: string;
  temperature?: number;
}

/**
 * Conversational chat completion via Azure AI Foundry
 */
export async function generateAzureFoundryChat(options: AzureChatOptions): Promise<string> {
  const endpoint = getAzureFoundryEndpoint();
  const apiKey = getAzureFoundryApiKey();
  const model = options.model || DEFAULT_AZURE_MODEL;

  const formattedMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: options.systemInstruction },
  ];

  for (const m of options.messages) {
    formattedMessages.push({
      role: m.role === "model" ? "assistant" : (m.role as "user" | "assistant"),
      content: m.content,
    });
  }

  const res = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: options.temperature ?? 0.3,
      messages: formattedMessages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Azure AI Foundry Chat error (status ${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

/**
 * Pings Azure AI Foundry endpoint to verify model latency and connectivity
 */
export async function pingAzureFoundry(): Promise<{
  success: boolean;
  latencyMs: number;
  model: string;
  provider: string;
  error?: string;
}> {
  if (!isAzureFoundryConfigured()) {
    return {
      success: false,
      latencyMs: 0,
      model: DEFAULT_AZURE_MODEL,
      provider: "Azure AI Foundry (AI-103)",
      error: "Azure AI Foundry is not configured. Set AZURE_AI_FOUNDRY_API_KEY.",
    };
  }

  const start = Date.now();
  try {
    const endpoint = getAzureFoundryEndpoint();
    const apiKey = getAzureFoundryApiKey();
    const res = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_AZURE_MODEL,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Azure AI Foundry returned HTTP ${res.status}: ${txt}`);
    }

    return {
      success: true,
      latencyMs: Date.now() - start,
      model: DEFAULT_AZURE_MODEL,
      provider: "Azure AI Foundry (AI-103)",
    };
  } catch (err: unknown) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      model: DEFAULT_AZURE_MODEL,
      provider: "Azure AI Foundry (AI-103)",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// Canonical Aliases for All Agents
export const generateText = generateAzureFoundryText;
export const generateStructuredJson = generateAzureFoundryStructuredJson;
export const generateChatResponse = generateAzureFoundryChat;
export const pingAiService = pingAzureFoundry;
export const isAiConfigured = isAzureFoundryConfigured;
export const pingGemini = pingAzureFoundry; // drop-in backward compat
export const isGeminiConfigured = isAzureFoundryConfigured; // drop-in backward compat
export const DEFAULT_AI_MODEL = DEFAULT_AZURE_MODEL;


import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

/**
 * Centralized Gemini Model Configuration.
 * Defaults to "gemini-3.5-flash-lite", an active Flash-class model optimized for
 * fast response times (<1s), structured JSON output, and multi-agent workflows.
 * Can be overridden server-side via GEMINI_MODEL env variable.
 */
export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

let cachedAiInstance: GoogleGenAI | null = null;

/**
 * Validates that GEMINI_API_KEY is configured on the server.
 * Never exposes the key.
 */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/**
 * Returns a server-side GoogleGenAI client or throws a safe configuration error.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Gemini authentication failed: GEMINI_API_KEY is not set in the server environment."
    );
  }

  if (!cachedAiInstance) {
    cachedAiInstance = new GoogleGenAI({ apiKey });
  }

  return cachedAiInstance;
}

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  modelName?: string;
  temperature?: number;
}

/**
 * Basic text generation through the centralized Gemini service.
 */
export async function generateText(options: GenerateTextOptions): Promise<string> {
  const ai = getGeminiClient();
  const model = options.model || options.modelName || DEFAULT_GEMINI_MODEL;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.2,
      },
    });

    return response.text?.trim() || "";
  } catch (err: unknown) {
    const classified = classifyGeminiError(err);
    console.error("[M.A.C.O.S. Gemini Service] Text generation failed:", sanitizeError(err));
    throw new Error(classified.userMessage);
  }
}

export interface StructuredGenerationOptions<T> {
  prompt: string;
  schema: z.ZodType<T>;
  systemInstruction?: string;
  model?: string;
  modelName?: string;
  temperature?: number;
  maxRetries?: number;
}

/**
 * Centralized structured JSON generation with Zod schema validation and automatic retry.
 */
export async function generateStructuredJson<T>(
  options: StructuredGenerationOptions<T>
): Promise<T> {
  const ai = getGeminiClient();
  const model = options.model || options.modelName || DEFAULT_GEMINI_MODEL;
  const maxRetries = options.maxRetries ?? 2;
  let currentPrompt = options.prompt;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: currentPrompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: "application/json",
          temperature: options.temperature ?? 0.1,
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      // Handle markdown code fences if returned (e.g. ```json ... ```)
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
      const sanitized = sanitizeError(err);
      console.warn(
        `[M.A.C.O.S. Gemini Service] Structured attempt ${attempt}/${maxRetries} failed: ${sanitized}`
      );

      if (attempt < maxRetries) {
        // Feedback the schema error to the model on retry
        currentPrompt = `${options.prompt}\n\nNOTE: The previous response was rejected: ${sanitized}. Ensure you return strictly valid JSON matching the requested schema.`;
      }
    }
  }

  const classified = classifyGeminiError(lastError);
  console.error(
    `[M.A.C.O.S. Gemini Service] Structured generation failed after ${maxRetries} attempts:`,
    sanitizeError(lastError)
  );
  throw new Error(classified.userMessage);
}

export interface ChatGenerationOptions {
  systemInstruction: string;
  messages: Array<{ role: "user" | "model"; content: string }>;
  model?: string;
  modelName?: string;
  temperature?: number;
}

/**
 * Multi-turn chat generation helper for conversational interactions (Ask M.A.C.O.S.).
 */
export async function generateChatResponse(
  options: ChatGenerationOptions
): Promise<string> {
  const ai = getGeminiClient();
  const model = options.model || options.modelName || DEFAULT_GEMINI_MODEL;

  const formattedContents = options.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: formattedContents as unknown as Parameters<
        typeof ai.models.generateContent
      >[0]["contents"],
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.4,
      },
    });

    return response.text?.trim() || "No response received from M.A.C.O.S. conversational agent.";
  } catch (err: unknown) {
    const classified = classifyGeminiError(err);
    console.error("[M.A.C.O.S. Gemini Service] Chat generation failed:", sanitizeError(err));
    throw new Error(classified.userMessage);
  }
}

/**
 * Performs a minimal test generation against Gemini using the active model to verify connectivity.
 */
export async function pingGemini(): Promise<{
  success: boolean;
  latencyMs: number;
  model: string;
  error?: string;
}> {
  if (!isGeminiConfigured()) {
    return {
      success: false,
      latencyMs: 0,
      model: DEFAULT_GEMINI_MODEL,
      error: "Gemini authentication failed: GEMINI_API_KEY is not configured.",
    };
  }

  const start = Date.now();
  try {
    const ai = getGeminiClient();
    await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: "ping",
      config: {
        maxOutputTokens: 5,
        temperature: 0,
      },
    });

    return {
      success: true,
      latencyMs: Date.now() - start,
      model: DEFAULT_GEMINI_MODEL,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const classified = classifyGeminiError(err);
    return {
      success: false,
      latencyMs,
      model: DEFAULT_GEMINI_MODEL,
      error: classified.userMessage,
    };
  }
}

/**
 * Classifies Gemini API errors into distinguishable, safe user-facing error messages.
 */
export function classifyGeminiError(err: unknown): {
  userMessage: string;
  statusCode: number;
  category: "auth_failed" | "model_unavailable" | "rate_limited" | "malformed_output" | "general_error";
} {
  const raw = err instanceof Error ? err.message : String(err);

  // 1. Authentication / Invalid API Key
  if (/API_KEY_INVALID|UNAUTHENTICATED|invalid api key|forbidden|401|403/i.test(raw)) {
    return {
      userMessage: "Gemini authentication failed.",
      statusCode: 401,
      category: "auth_failed",
    };
  }

  // 2. Model Unavailable / Deprecated / 404
  if (/404|NOT_FOUND|no longer available|is not found/i.test(raw)) {
    return {
      userMessage: "The configured Gemini model is unavailable. Please check the current model configuration.",
      statusCode: 404,
      category: "model_unavailable",
    };
  }

  // 3. Rate Limit / Quota Exceeded
  if (/429|RESOURCE_EXHAUSTED|rate limit|quota/i.test(raw)) {
    return {
      userMessage: "Gemini rate limit reached. Please try again.",
      statusCode: 429,
      category: "rate_limited",
    };
  }

  // 4. Malformed Structured Output / Validation
  if (/Schema validation|JSON\.parse|invalid analysis format|empty response/i.test(raw)) {
    return {
      userMessage: "Gemini returned an invalid analysis format. Retrying...",
      statusCode: 502,
      category: "malformed_output",
    };
  }

  // 5. Default General Error
  return {
    userMessage: "An error occurred while communicating with the Gemini AI service.",
    statusCode: 500,
    category: "general_error",
  };
}

/**
 * Strips any potential API key or query string traces from error messages.
 */
export function sanitizeError(err: unknown): string {
  if (!err) return "Unknown error";
  const str = err instanceof Error ? err.message : String(err);
  return str
    .replace(/key=[A-Za-z0-9_-]+/gi, "key=[REDACTED]")
    .replace(/api[-_]?key[:=]\s*[A-Za-z0-9_-]+/gi, "api_key=[REDACTED]")
    .replace(/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED_KEY]");
}

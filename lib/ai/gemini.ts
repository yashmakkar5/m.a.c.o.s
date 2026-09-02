import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// Centralized model configuration
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
      "GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your .env.local file on the server."
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
  temperature?: number;
}

/**
 * Basic text generation through the centralized Gemini service.
 */
export async function generateText(options: GenerateTextOptions): Promise<string> {
  const ai = getGeminiClient();
  const model = options.model || DEFAULT_GEMINI_MODEL;

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
    const sanitizedError = sanitizeError(err);
    console.error("[M.A.C.O.S. Gemini Service] Text generation error:", sanitizedError);
    throw new Error(`Gemini generation failed: ${sanitizedError}`);
  }
}

export interface StructuredGenerationOptions<T> {
  prompt: string;
  schema: z.ZodType<T>;
  systemInstruction?: string;
  model?: string;
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
  const model = options.model || DEFAULT_GEMINI_MODEL;
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

      // Handle markdown code fences if returned
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
        currentPrompt = `${options.prompt}\n\nNOTE: The previous response did not match the required schema: ${sanitized}. Ensure you return strictly compliant JSON according to the schema.`;
      }
    }
  }

  const finalMsg = sanitizeError(lastError);
  throw new Error(`Structured output generation failed after ${maxRetries} attempts: ${finalMsg}`);
}

/**
 * Performs a minimal test generation against Gemini to verify connectivity and credentials.
 */
export async function pingGemini(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  if (!isGeminiConfigured()) {
    return {
      success: false,
      latencyMs: 0,
      error: "GEMINI_API_KEY is not configured",
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
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const sanitized = sanitizeError(err);
    return {
      success: false,
      latencyMs,
      error: sanitized,
    };
  }
}

/**
 * Strips any potential API key or query string traces from error messages.
 */
function sanitizeError(err: unknown): string {
  if (!err) return "Unknown error";
  const str = err instanceof Error ? err.message : String(err);
  // Remove anything looking like key=... or api_key=... or long alphanumeric tokens
  return str
    .replace(/key=[A-Za-z0-9_-]+/gi, "key=[REDACTED]")
    .replace(/api[-_]?key[:=]\s*[A-Za-z0-9_-]+/gi, "api_key=[REDACTED]")
    .replace(/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED_KEY]");
}

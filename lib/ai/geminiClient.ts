import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * Returns a configured GoogleGenAI instance or throws a descriptive error.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in your .env.local file to enable AI career orchestration."
    );
  }

  return new GoogleGenAI({ apiKey });
}

export interface StructuredGenerationOptions<T> {
  systemInstruction?: string;
  prompt: string;
  schema: z.ZodType<T>;
  modelName?: string;
  maxRetries?: number;
  temperature?: number;
}

/**
 * Executes a structured JSON generation request against Gemini,
 * parsing and validating the response against a Zod schema with automatic retry.
 */
export async function generateStructuredJson<T>({
  systemInstruction,
  prompt,
  schema,
  modelName = DEFAULT_MODEL,
  maxRetries = 2,
  temperature = 0.2,
}: StructuredGenerationOptions<T>): Promise<T> {
  const ai = getGeminiClient();
  let lastError: unknown = null;
  let currentPrompt = prompt;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: currentPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature,
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      // Handle cases where JSON might be wrapped in ```json ... ``` blocks
      let cleanedJson = rawText;
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsedData = JSON.parse(cleanedJson);
      const validationResult = schema.safeParse(parsedData);

      if (!validationResult.success) {
        const errorDetails = JSON.stringify(validationResult.error.format(), null, 2);
        throw new Error(`Schema validation failed on attempt ${attempt}: ${errorDetails}`);
      }

      return validationResult.data;
    } catch (err: unknown) {
      lastError = err;
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[M.A.C.O.S. Gemini] Generation attempt ${attempt}/${maxRetries} failed: ${errorMsg}`);

      if (attempt < maxRetries) {
        // Feedback the schema error to the model on retry
        currentPrompt = `${prompt}\n\nPREVIOUS ATTEMPT RETURNED INVALID FORMAT: ${errorMsg}. Ensure you return strictly compliant JSON according to the requested schema.`;
      }
    }
  }

  throw new Error(
    `Failed to generate valid structured response from Gemini after ${maxRetries} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

/**
 * Text generation helper for conversational interactions (Ask M.A.C.O.S.).
 */
export async function generateChatResponse(options: {
  systemInstruction: string;
  messages: Array<{ role: "user" | "model"; content: string }>;
  modelName?: string;
}): Promise<string> {
  const ai = getGeminiClient();

  const formattedContents = options.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: options.modelName || DEFAULT_MODEL,
    contents: formattedContents as unknown as Parameters<
      typeof ai.models.generateContent
    >[0]["contents"],
    config: {
      systemInstruction: options.systemInstruction,
      temperature: 0.4,
    },
  });

  return response.text?.trim() || "No response received from M.A.C.O.S. conversational agent.";
}

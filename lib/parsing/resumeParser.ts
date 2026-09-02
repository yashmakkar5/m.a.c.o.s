import { extractText } from "unpdf";
import mammoth from "mammoth";

export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface ParseResult {
  text: string;
  totalPages?: number;
}

/**
 * Validates file extension, size, and MIME type.
 */
export function validateResumeFile(
  fileName: string,
  fileSizeBytes: number,
  mimeType?: string
): FileValidationResult {
  if (!fileName || typeof fileName !== "string") {
    return { valid: false, error: "Invalid file name provided." };
  }

  const lowerName = fileName.toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

  if (!hasValidExt) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a PDF or DOCX file (.pdf, .docx).",
    };
  }

  if (fileSizeBytes <= 0) {
    return { valid: false, error: "The uploaded file is empty (0 bytes)." };
  }

  if (fileSizeBytes > MAX_RESUME_FILE_SIZE_BYTES) {
    const sizeMb = (fileSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 5 MB.`,
    };
  }

  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase()) && !hasValidExt) {
    return {
      valid: false,
      error: "Invalid file MIME type. Only PDF and DOCX documents are supported.",
    };
  }

  return { valid: true };
}

/**
 * Extracts raw text from PDF or DOCX binary buffer.
 */
export async function parseResumeBuffer(
  buffer: ArrayBuffer | Uint8Array | Buffer,
  fileName: string
): Promise<ParseResult> {
  const lowerName = fileName.toLowerCase();

  try {
    if (lowerName.endsWith(".pdf")) {
      const uint8Array: Uint8Array =
        buffer instanceof Uint8Array
          ? buffer
          : buffer instanceof ArrayBuffer
          ? new Uint8Array(buffer)
          : new Uint8Array(Buffer.from(buffer as unknown as Buffer));

      const { text, totalPages } = await extractText(uint8Array, {
        mergePages: true,
      });

      const raw = text as unknown;
      const cleanText = (
        typeof raw === "string"
          ? raw
          : Array.isArray(raw)
          ? (raw as string[]).join("\n")
          : ""
      )
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, " ")
        .trim();

      if (!cleanText || cleanText.length < 50) {
        throw new Error(
          "The uploaded PDF does not contain sufficient readable text. It may be scanned, image-only, or encrypted. Please upload a searchable text-based PDF or DOCX."
        );
      }

      return { text: cleanText, totalPages };
    } else if (lowerName.endsWith(".docx")) {
      const nodeBuffer: Buffer = Buffer.isBuffer(buffer)
        ? buffer
        : buffer instanceof ArrayBuffer
        ? Buffer.from(buffer)
        : Buffer.from((buffer as Uint8Array).buffer);

      const result = await mammoth.extractRawText({ buffer: nodeBuffer });
      const cleanText = result.value
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, " ")
        .trim();

      if (!cleanText || cleanText.length < 50) {
        throw new Error(
          "The uploaded DOCX file does not contain sufficient text. Please check that the document has readable content."
        );
      }

      return { text: cleanText, totalPages: 1 };
    } else {
      throw new Error("Unsupported document type. Only .pdf and .docx files are permitted.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to parse resume: ${String(error)}`);
  }
}

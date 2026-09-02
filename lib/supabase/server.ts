import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverInstance: SupabaseClient | null = null;

/**
 * Checks if Supabase server-side credentials are configured.
 */
export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

/**
 * Server-only Supabase client.
 * Uses SUPABASE_SERVICE_ROLE_KEY for administrative operations when available,
 * falling back safely to the server-side anon key.
 */
export function getServerSupabaseClient(): SupabaseClient | null {
  if (serverInstance) {
    return serverInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  try {
    serverInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return serverInstance;
  } catch (err) {
    console.error("[M.A.C.O.S. Supabase Server] Initialization error:", err);
    return null;
  }
}

/**
 * Performs a safe query against Supabase to verify database connectivity.
 */
export async function pingSupabase(): Promise<{
  success: boolean;
  latencyMs: number;
  tableFound?: boolean;
  error?: string;
}> {
  if (!isSupabaseServerConfigured()) {
    return {
      success: false,
      latencyMs: 0,
      error: "Supabase environment variables (URL / Key) are not configured.",
    };
  }

  const client = getServerSupabaseClient();
  if (!client) {
    return {
      success: false,
      latencyMs: 0,
      error: "Unable to initialize Supabase client.",
    };
  }

  const start = Date.now();
  try {
    // Attempt a light query against the analyses table
    const { error } = await client
      .from("analyses")
      .select("id")
      .limit(1);

    const latencyMs = Date.now() - start;

    if (error) {
      // If table doesn't exist yet, but connection was made to Postgres
      if (error.code === "42P01") {
        return {
          success: true,
          latencyMs,
          tableFound: false,
          error: "Database connected, but 'analyses' table is not yet created. Run the migration SQL in Supabase.",
        };
      }

      return {
        success: false,
        latencyMs,
        error: error.message,
      };
    }

    return {
      success: true,
      latencyMs,
      tableFound: true,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      latencyMs,
      error: msg,
    };
  }
}

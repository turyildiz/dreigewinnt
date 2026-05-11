import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Service role client — bypasses RLS. Server-side only. Never expose to browser.
let _client: ReturnType<typeof createClient<Database>> | null = null;

function getClient() {
  if (!_client) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    _client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _client;
}

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop: string | symbol) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

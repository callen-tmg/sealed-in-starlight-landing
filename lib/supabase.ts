import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

function createSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build time, env vars may not be available.
    // Return a client with placeholder values — it won't be used
    // since pages that depend on it are marked as force-dynamic.
    return createClient<Database>(
      "https://placeholder.supabase.co",
      "placeholder-key-for-build"
    );
  }

  return createClient<Database>(url, key);
}

export const supabase = createSupabaseClient();

import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service role key, which bypasses Row Level
// Security. Never import this from a Client Component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

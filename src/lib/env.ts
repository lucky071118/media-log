import "server-only";

type SupabaseEnv = {
  anonKey: string;
  url: string;
};

function readEnv(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY") {
  const legacyName =
    name === "SUPABASE_URL" ? "NEXT_PUBLIC_SUPABASE_URL" : "NEXT_PUBLIC_SUPABASE_ANON_KEY";

  return process.env[name] ?? process.env[legacyName];
}

export function hasSupabaseEnv() {
  return Boolean(readEnv("SUPABASE_URL") && readEnv("SUPABASE_ANON_KEY"));
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = readEnv("SUPABASE_URL");
  const anonKey = readEnv("SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY, or fall back to NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { anonKey, url };
}

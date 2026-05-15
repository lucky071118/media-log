type SupabaseEnv = {
  anonKey: string;
  url: string;
};

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasOwnerEmail() {
  return Boolean(process.env.SITE_OWNER_EMAIL);
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { anonKey, url };
}

export function getOwnerEmail() {
  const ownerEmail = process.env.SITE_OWNER_EMAIL?.trim().toLowerCase();

  if (!ownerEmail) {
    throw new Error("Missing SITE_OWNER_EMAIL. Set it to the email address that owns the media log.");
  }

  return ownerEmail;
}

export function isSiteOwnerEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return email.trim().toLowerCase() === getOwnerEmail();
}

export function getBaseUrl(headers: Headers) {
  const origin = headers.get("origin");

  if (origin) {
    return origin;
  }

  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const protocol =
    headers.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getErrorMessage(error: { message?: string } | null, fallback: string) {
  return error?.message ?? fallback;
}

import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const params = new URLSearchParams({
        error: error.message,
      });

      return NextResponse.redirect(new URL(`/?${params.toString()}`, request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}

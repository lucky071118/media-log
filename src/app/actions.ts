"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getBaseUrl, getErrorMessage, isSiteOwnerEmail } from "@/lib/env";
import { parseMediaFormData } from "@/lib/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectWithMessage(kind: "error" | "message", message: string): never {
  const params = new URLSearchParams({
    [kind]: message,
  });

  redirect(`/?${params.toString()}`);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirectWithMessage("error", "Enter an email address to receive a magic link.");
  }

  if (!isSiteOwnerEmail(email)) {
    redirectWithMessage("error", "Only the site owner can sign in to manage this media log.");
  }

  const supabase = await createSupabaseServerClient();
  const requestHeaders = await headers();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl(requestHeaders)}/auth/callback`,
    },
  });

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not send the sign-in link."));
  }

  redirectWithMessage("message", "Check your email for the sign-in link.");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not sign out."));
  }

  revalidatePath("/");
  redirect("/");
}

export async function createMediaEntry(formData: FormData) {
  const parsedMedia = parseMediaFormData(formData);

  if (!parsedMedia.success) {
    redirectWithMessage("error", parsedMedia.error);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithMessage("error", "Sign in before adding an entry to your log.");
  }

  if (!isSiteOwnerEmail(user.email)) {
    redirectWithMessage("error", "Only the site owner can manage this media log.");
  }

  const { error } = await supabase.from("media_entries").insert({
    ...parsedMedia.data,
  });

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not save the entry."));
  }

  revalidatePath("/");
  redirectWithMessage("message", `${parsedMedia.data.title} was added to your media log.`);
}

export async function deleteMediaEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirectWithMessage("error", "Missing entry identifier.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithMessage("error", "Sign in before deleting an entry.");
  }

  if (!isSiteOwnerEmail(user.email)) {
    redirectWithMessage("error", "Only the site owner can manage this media log.");
  }

  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("id", id);

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not delete the entry."));
  }

  revalidatePath("/");
  redirectWithMessage("message", "The entry was removed from your log.");
}

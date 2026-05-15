"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getBaseUrl, getErrorMessage, isSiteOwnerEmail } from "@/lib/env";
import { parseMovieFormData } from "@/lib/movies";
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

export async function createMovieEntry(formData: FormData) {
  const parsedMovie = parseMovieFormData(formData);

  if (!parsedMovie.success) {
    redirectWithMessage("error", parsedMovie.error);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithMessage("error", "Sign in before adding a movie to your log.");
  }

  if (!isSiteOwnerEmail(user.email)) {
    redirectWithMessage("error", "Only the site owner can manage this media log.");
  }

  const { error } = await supabase.from("media_entries").insert({
    ...parsedMovie.data,
    user_id: user.id,
  });

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not save the movie entry."));
  }

  revalidatePath("/");
  redirectWithMessage("message", `${parsedMovie.data.title} was added to your media log.`);
}

export async function deleteMovieEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirectWithMessage("error", "Missing movie entry identifier.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithMessage("error", "Sign in before deleting a movie entry.");
  }

  if (!isSiteOwnerEmail(user.email)) {
    redirectWithMessage("error", "Only the site owner can manage this media log.");
  }

  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirectWithMessage("error", getErrorMessage(error, "Could not delete the movie entry."));
  }

  revalidatePath("/");
  redirectWithMessage("message", "The movie entry was removed from your log.");
}

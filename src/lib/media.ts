import { z } from "zod";

const mediaEntrySchema = z.object({
  review: z
    .string()
    .trim()
    .max(280, "Reviews must be 280 characters or fewer.")
    .transform((value) => value || null),
  rating: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine((value) => value === null || (Number.isInteger(value) && value >= 0 && value <= 5), {
      message: "Rating must be between 0 and 5.",
    }),
  releaseYear: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine(
      (value) => value === null || (Number.isInteger(value) && value >= 1888 && value <= 2100),
      {
        message: "Release year must be between 1888 and 2100.",
      },
    ),
  title: z
    .string()
    .trim()
    .min(1, "Add a title.")
    .max(120, "Titles must be 120 characters or fewer."),
  watchedOn: z
    .string()
    .trim()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: "Choose the date you watched it.",
    }),
});

type ParsedMediaEntry = {
  review: string | null;
  rating: number | null;
  release_year: number | null;
  title: string;
  watched_on: string;
};

export type MediaEntry = {
  created_at: string;
  id: string;
  review: string | null;
  rating: number | null;
  release_year: number | null;
  title: string;
  watched_on: string;
};

type ParseResult<T> = { data: T; success: true } | { error: string; success: false };

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFirstIssueMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "There was a problem with your form data.";
}

export function parseMediaFormData(formData: FormData): ParseResult<ParsedMediaEntry> {
  const result = mediaEntrySchema.safeParse({
    review: getString(formData, "review"),
    rating: getString(formData, "rating"),
    releaseYear: getString(formData, "releaseYear"),
    title: getString(formData, "title"),
    watchedOn: getString(formData, "watchedOn"),
  });

  if (!result.success) {
    return { error: getFirstIssueMessage(result.error), success: false };
  }

  return {
    data: {
      review: result.data.review,
      rating: result.data.rating,
      release_year: result.data.releaseYear,
      title: result.data.title,
      watched_on: result.data.watchedOn,
    },
    success: true,
  };
}

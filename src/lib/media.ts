export type MediaEntry = {
  created_at: string;
  id: string;
  review: string | null;
  rating: number | null;
  release_year: number | null;
  title: string;
  watched_on: string;
};

const MAX_TITLE_LENGTH = 120;
const MAX_REVIEW_LENGTH = 280;
const MIN_RELEASE_YEAR = 1888;
const MAX_RELEASE_YEAR = 2100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeRequiredText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (normalized.length === 0 || normalized.length > maxLength) {
    return null;
  }

  return normalized;
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizeRequiredText(value, maxLength);
}

function normalizeInteger(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    return null;
  }

  return value;
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (normalized.length === 0 || Number.isNaN(new Date(normalized).getTime())) {
    return null;
  }

  return normalized;
}

function normalizeMediaEntry(value: unknown): MediaEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = normalizeRequiredText(value.id, 64);
  const title = normalizeRequiredText(value.title, MAX_TITLE_LENGTH);
  const watchedOn = normalizeDate(value.watched_on);
  const createdAt = normalizeDate(value.created_at);

  if (!id || !title || !watchedOn || !createdAt) {
    return null;
  }

  return {
    id,
    title,
    watched_on: watchedOn,
    created_at: createdAt,
    release_year:
      value.release_year === null || value.release_year === undefined
        ? null
        : normalizeInteger(value.release_year, MIN_RELEASE_YEAR, MAX_RELEASE_YEAR),
    rating:
      value.rating === null || value.rating === undefined
        ? null
        : normalizeInteger(value.rating, 0, 5),
    review: normalizeOptionalText(value.review, MAX_REVIEW_LENGTH),
  };
}

export function normalizeMediaEntries(value: unknown): MediaEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    const normalizedEntry = normalizeMediaEntry(entry);

    return normalizedEntry ? [normalizedEntry] : [];
  });
}

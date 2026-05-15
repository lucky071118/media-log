create extension if not exists pgcrypto;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.media_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  release_year integer,
  watched_on date not null default current_date,
  rating integer,
  review text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint media_entries_title_length check (char_length(title) between 1 and 120),
  constraint media_entries_release_year_range check (
    release_year is null or release_year between 1888 and 2100
  ),
  constraint media_entries_rating_range check (
    rating is null or rating between 0 and 5
  ),
  constraint media_entries_review_length check (
    review is null or char_length(review) <= 280
  )
);

create trigger set_media_entries_updated_at
before update on public.media_entries
for each row
execute function public.handle_updated_at();

alter table public.media_entries enable row level security;

create policy "Anyone can read the media log"
on public.media_entries
for select
to public
using (true);

create policy "Users can create their own movie entries"
on public.media_entries
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own movie entries"
on public.media_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own movie entries"
on public.media_entries
for delete
to authenticated
using (auth.uid() = user_id);

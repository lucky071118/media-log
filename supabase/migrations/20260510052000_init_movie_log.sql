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

create table if not exists public.movie_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  release_year integer,
  watched_on date not null default current_date,
  rating integer,
  review text,
  poster_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint movie_entries_title_length check (char_length(title) between 1 and 120),
  constraint movie_entries_release_year_range check (
    release_year is null or release_year between 1888 and 2100
  ),
  constraint movie_entries_rating_range check (
    rating is null or rating between 0 and 5
  ),
  constraint movie_entries_review_length check (
    review is null or char_length(review) <= 280
  )
);

create trigger set_movie_entries_updated_at
before update on public.movie_entries
for each row
execute function public.handle_updated_at();

alter table public.movie_entries enable row level security;

create policy "Anyone can read the movie log"
on public.movie_entries
for select
to public
using (true);

create policy "Users can create their own movie entries"
on public.movie_entries
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own movie entries"
on public.movie_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own movie entries"
on public.movie_entries
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'posters',
  'posters',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Poster images are public"
on storage.objects
for select
to public
using (bucket_id = 'posters');

create policy "Authenticated users can upload poster images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'posters'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users can update their poster images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'posters'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'posters'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users can delete their poster images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'posters'
  and (storage.foldername(name))[1] = auth.uid()::text
);

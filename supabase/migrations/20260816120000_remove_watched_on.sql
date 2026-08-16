alter table public.media_entries
  drop column watched_on;

revoke select on table public.media_entries from anon, authenticated;

grant select (id, title, release_year, rating, review, created_at)
on table public.media_entries
to anon, authenticated;

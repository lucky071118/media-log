alter table public.media_entries
  add constraint media_entries_title_trimmed check (title = btrim(title)),
  add constraint media_entries_title_not_blank check (char_length(btrim(title)) > 0),
  add constraint media_entries_review_trimmed check (
    review is null or review = btrim(review)
  ),
  add constraint media_entries_review_not_blank check (
    review is null or char_length(btrim(review)) > 0
  ),
  add constraint media_entries_watched_on_not_future check (watched_on <= current_date);

revoke select on table public.media_entries from anon, authenticated;

grant select (id, title, release_year, watched_on, rating, review, created_at)
on table public.media_entries
to anon, authenticated;

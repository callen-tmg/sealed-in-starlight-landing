alter table public.waitlist
  add column if not exists status text,
  add column if not exists intent text,
  add column if not exists internal_note text,
  add column if not exists tags text[];

update public.waitlist
set
  status = coalesce(status, 'new'),
  tags = coalesce(tags, '{}'::text[]);

alter table public.waitlist
  alter column status set default 'new',
  alter column status set not null,
  alter column tags set default '{}'::text[],
  alter column tags set not null;

alter table public.waitlist
  drop constraint if exists waitlist_status_check;

alter table public.waitlist
  add constraint waitlist_status_check
    check (status in ('new', 'reviewed', 'invited', 'joined', 'archived'));

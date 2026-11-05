-- Activation Scorecard persistence (Supabase).
-- Backs src/lib/scorecard/store.supabase.ts: analysis cache by URL, per-email
-- dedupe, and report retrieval by unguessable slug for the hosted /s/<slug> page.

create table if not exists public.scorecard_reports (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  url               text not null,
  domain            text not null,
  email             text not null,
  name              text not null,
  company           text not null,
  stage             text not null,
  overall_score     integer not null,
  result            jsonb not null,
  previous_score    integer,
  delta             integer,
  served_from_cache boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Cache/cooldown lookups hit (url, created_at); dedupe hits (url, email).
create index if not exists scorecard_reports_url_created_idx
  on public.scorecard_reports (url, created_at desc);
create index if not exists scorecard_reports_url_email_idx
  on public.scorecard_reports (url, email);

-- Server code uses the service-role key (bypasses RLS). Enable RLS with no public
-- policies so the anon key cannot read leads/reports directly.
alter table public.scorecard_reports enable row level security;

-- ---------------------------------------------------------------------------
-- Migration 2026-11-05: one preview system, two kickoff paths, learning record.
-- Idempotent; safe to re-run. Existing rows become self_serve / sent.
-- ---------------------------------------------------------------------------
alter table public.scorecard_reports
  add column if not exists kickoff        text not null default 'self_serve'
    check (kickoff in ('self_serve', 'operator')),
  add column if not exists rubric_version text,
  add column if not exists status         text not null default 'sent'
    check (status in ('pending_approval', 'sent', 'failed')),
  add column if not exists internal       jsonb,
  add column if not exists review_events  jsonb not null default '[]'::jsonb,
  add column if not exists sent_at        timestamptz,
  add column if not exists last_error     text;

create index if not exists scorecard_reports_created_idx
  on public.scorecard_reports (created_at desc);

-- Private bucket for redacted evidence crops. No public policies: images are
-- served only through the app route /s/<slug>/evidence/<key>.
insert into storage.buckets (id, name, public)
values ('scorecard-evidence', 'scorecard-evidence', false)
on conflict (id) do nothing;

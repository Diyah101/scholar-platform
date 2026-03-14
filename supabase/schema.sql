-- Scholar Platform Supabase schema & RLS
-- Run this in your Supabase project SQL editor or via the Supabase CLI.

-- Ensure pgcrypto is available (for gen_random_uuid)
create extension if not exists "pgcrypto";

-- =========================
-- =========================
-- Tables
-- =========================

-- Users profile table (linked to auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('student', 'partner', 'admin')),
  name text,
  country text,
  field_of_study text,
  degree_level text,
  university text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on public.users (role);
create index if not exists users_email_idx on public.users (lower(email));

-- =========================
-- Helper: admin check
-- (defined after users table exists)
-- =========================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
      and u.is_active = true
  );
$$;

-- Opportunities (scholarships + internships)
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null check (type in ('scholarship', 'internship')),
  country text not null,
  field text,
  degree_level text,
  deadline timestamptz not null,
  award_amount numeric,
  eligibility text,
  application_link text not null,
  logo_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'archived')),
  submitted_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_status_idx on public.opportunities (status);
create index if not exists opportunities_deadline_idx on public.opportunities (deadline);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_country_idx on public.opportunities (country);
create index if not exists opportunities_field_idx on public.opportunities (field);

-- Reminders
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  reminder_dates timestamptz[] not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reminders_user_id_idx on public.reminders (user_id);
create index if not exists reminders_opportunity_id_idx on public.reminders (opportunity_id);
create index if not exists reminders_active_idx on public.reminders (is_active);

-- Saved opportunities
create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

create index if not exists saved_user_id_idx on public.saved_opportunities (user_id);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('reminder', 'new_match', 'announcement')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_type_idx on public.notifications (type);
create index if not exists notifications_is_read_idx on public.notifications (is_read);

-- Partner applications
create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  organisation_name text not null,
  website text,
  contact_person text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  applied_at timestamptz not null default now()
);

create index if not exists partner_applications_user_id_idx on public.partner_applications (user_id);
create index if not exists partner_applications_status_idx on public.partner_applications (status);

-- Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  sent_by uuid not null references public.users(id) on delete set null,
  sent_at timestamptz not null default now()
);

create index if not exists announcements_sent_at_idx on public.announcements (sent_at);

-- Simple activity logs (system logs)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_event_type_idx on public.activity_logs (event_type);
create index if not exists activity_logs_created_at_idx on public.activity_logs (created_at);

-- =========================
-- Row Level Security (RLS)
-- =========================

alter table public.users enable row level security;
alter table public.opportunities enable row level security;
alter table public.reminders enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.notifications enable row level security;
alter table public.partner_applications enable row level security;
alter table public.announcements enable row level security;
alter table public.activity_logs enable row level security;

-- ---------- users ----------

-- Students/partners can see and update their own profile.
-- Admins can see and manage everyone via is_admin().

create policy "Users: self or admin select"
on public.users
for select
using (
  auth.uid() = id
  or public.is_admin()
);

create policy "Users: self update"
on public.users
for update
using (auth.uid() = id);

create policy "Users: admin full access"
on public.users
for all
using (public.is_admin());

-- ---------- opportunities ----------

-- Public (including unauthenticated) can see approved opportunities.
create policy "Opps: public read approved"
on public.opportunities
for select
to public
using (status = 'approved');

-- Partners can see and manage their own submissions.
create policy "Opps: partner manage own"
on public.opportunities
for all
to authenticated
using (
  submitted_by = auth.uid()
)
with check (
  submitted_by = auth.uid()
);

-- Admins full access.
create policy "Opps: admin full access"
on public.opportunities
for all
using (public.is_admin());

-- ---------- reminders ----------

-- Students can manage their own reminders.
create policy "Reminders: own read"
on public.reminders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Reminders: own insert"
on public.reminders
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

create policy "Reminders: own update"
on public.reminders
for update
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Reminders: own delete"
on public.reminders
for delete
to authenticated
using (user_id = auth.uid() or public.is_admin());

-- ---------- saved_opportunities ----------

create policy "Saved: own read"
on public.saved_opportunities
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Saved: own insert"
on public.saved_opportunities
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

create policy "Saved: own update"
on public.saved_opportunities
for update
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Saved: own delete"
on public.saved_opportunities
for delete
to authenticated
using (user_id = auth.uid() or public.is_admin());

-- ---------- notifications ----------

create policy "Notifications: own read"
on public.notifications
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Notifications: own insert"
on public.notifications
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

create policy "Notifications: own update"
on public.notifications
for update
to authenticated
using (user_id = auth.uid() or public.is_admin());

-- ---------- partner_applications ----------

-- Partners (students applying as partners) can see and create their own application.
create policy "Partner applications: own read"
on public.partner_applications
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Partner applications: own insert"
on public.partner_applications
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

-- Only admin can update status / notes.
create policy "Partner applications: admin update"
on public.partner_applications
for update
to authenticated
using (public.is_admin());

-- ---------- announcements ----------

-- Everyone can read announcements.
create policy "Announcements: public read"
on public.announcements
for select
to public
using (true);

-- Only admin can insert announcements.
create policy "Announcements: admin manage"
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------- activity_logs ----------

-- Only admins can read/write logs.
create policy "Logs: admin only"
on public.activity_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());


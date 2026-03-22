-- MRI Viewer Supabase Schema
-- Run this in the Supabase SQL Editor

create table if not exists studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  patient_name text,
  study_date text,
  modality text,
  description text,
  institution text,
  accession text,
  minio_prefix text,
  paid boolean default false,
  stripe_session_id text,
  created_at timestamptz default now()
);

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  study_id uuid references studies(id) on delete cascade,
  body_region text,
  name text,
  image_count int,
  minio_prefix text
);

create table if not exists dicom_files (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  slice_index int,
  minio_key text,
  file_name text
);

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  dicom_file_id uuid references dicom_files(id) on delete cascade,
  findings jsonb,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  study_id uuid references studies(id),
  stripe_session_id text unique,
  stripe_payment_id text,
  status text default 'pending',
  amount int,
  currency text default 'usd',
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- Row Level Security
alter table studies enable row level security;
alter table series enable row level security;
alter table dicom_files enable row level security;
alter table annotations enable row level security;
alter table payments enable row level security;

-- Policies
create policy "own studies" on studies for all using (auth.uid() = user_id);

create policy "own series" on series for all using (
  study_id in (select id from studies where user_id = auth.uid())
);

create policy "own files" on dicom_files for all using (
  series_id in (select id from series where study_id in (
    select id from studies where user_id = auth.uid()
  ))
);

create policy "own annotations" on annotations for all using (
  dicom_file_id in (select id from dicom_files where series_id in (
    select id from series where study_id in (
      select id from studies where user_id = auth.uid()
    )
  ))
);

create policy "own payments" on payments for all using (auth.uid() = user_id);

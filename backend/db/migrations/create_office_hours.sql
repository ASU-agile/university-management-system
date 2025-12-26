-- Migration: create_office_hours.sql
-- Run this in your Supabase SQL editor or psql to create the office_hours table

CREATE TABLE IF NOT EXISTS public.office_hours (
  id bigserial PRIMARY KEY,
  staff_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
  day text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Optional index for faster staff lookups
CREATE INDEX IF NOT EXISTS idx_office_hours_staff_id ON public.office_hours (staff_id);

-- Migration: create_staff_subjects.sql
-- Run this in your Supabase SQL editor or psql to create the staff_subjects join table

CREATE TABLE IF NOT EXISTS public.staff_subjects (
  id bigserial PRIMARY KEY,
  staff_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id bigint REFERENCES public.subjects(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE (staff_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_subjects_staff_id ON public.staff_subjects (staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_subjects_subject_id ON public.staff_subjects (subject_id);

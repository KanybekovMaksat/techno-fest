-- =============================================
-- TECHNO FEST 2026 — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Registrations table
CREATE TABLE registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  institution TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  event TEXT NOT NULL,
  team_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Team members table
CREATE TABLE team_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registration_id BIGINT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public registration form)
CREATE POLICY "Allow anonymous insert" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON team_members
  FOR INSERT WITH CHECK (true);

-- Allow anonymous select (for admin panel reading via anon key)
CREATE POLICY "Allow anonymous select" ON registrations
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous select" ON team_members
  FOR SELECT USING (true);

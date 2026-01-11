-- MasterPrompt Generator Database Schema
-- Run this in your Supabase SQL Editor

-- User prompt configurations
CREATE TABLE IF NOT EXISTS prompt_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,

  -- Project basics
  project_name VARCHAR(255),
  one_liner TEXT,
  ship_by DATE,
  target_user TEXT,
  app_type VARCHAR(50),

  -- Tech stack (stored as JSON for flexibility)
  tech_stack JSONB DEFAULT '{}',

  -- Design
  theme VARCHAR(50) DEFAULT 'purple-tech',
  color_mode VARCHAR(20) DEFAULT 'dark-only',

  -- Options
  include_sentry BOOLEAN DEFAULT TRUE,
  include_fuzzy_search BOOLEAN DEFAULT TRUE,
  include_toasts BOOLEAN DEFAULT TRUE,

  -- Custom sections
  custom_features TEXT[] DEFAULT '{}',
  custom_db_tables TEXT,
  special_requirements TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE prompt_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own configs"
  ON prompt_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own configs"
  ON prompt_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own configs"
  ON prompt_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own configs"
  ON prompt_configs FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prompt_configs_updated_at
  BEFORE UPDATE ON prompt_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompt_configs_user_id ON prompt_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_configs_is_deleted ON prompt_configs(is_deleted);

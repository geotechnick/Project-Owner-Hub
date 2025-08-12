-- Project Owner Hub Database Schema
-- Run this in Supabase SQL Editor

-- Users table for authentication and profiles
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  organization_name VARCHAR,
  contact_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table for infrastructure projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  sector VARCHAR,
  location_address TEXT,
  location_coords POINT,
  estimated_size VARCHAR,
  start_date DATE,
  end_date DATE,
  labor_hours INTEGER,
  material_requirements JSONB,
  files JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cost estimates table linked to projects
CREATE TABLE cost_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  labor_cost DECIMAL(12,2),
  material_cost DECIMAL(12,2),
  equipment_cost DECIMAL(12,2),
  contingency_cost DECIMAL(12,2),
  total_cost DECIMAL(12,2),
  rates_used JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarked grants table for saving interesting grants per project
CREATE TABLE bookmarked_grants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  grant_id VARCHAR NOT NULL,
  grant_title VARCHAR,
  grant_agency VARCHAR,
  grant_deadline DATE,
  grant_amount VARCHAR,
  grant_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default rates table for cost calculations
CREATE TABLE default_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR NOT NULL,
  subcategory VARCHAR,
  rate DECIMAL(10,2) NOT NULL,
  unit VARCHAR NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample default rates for cost estimation
INSERT INTO default_rates (category, subcategory, rate, unit) VALUES
('labor', 'general', 25.00, 'hour'),
('labor', 'skilled', 35.00, 'hour'),
('labor', 'specialized', 50.00, 'hour'),
('labor', 'supervisor', 45.00, 'hour'),
('material', 'concrete', 120.00, 'cubic_yard'),
('material', 'steel', 0.85, 'pound'),
('material', 'lumber', 2.50, 'board_foot'),
('material', 'asphalt', 90.00, 'ton'),
('equipment', 'excavator', 300.00, 'day'),
('equipment', 'crane', 500.00, 'day'),
('equipment', 'bulldozer', 400.00, 'day'),
('equipment', 'truck', 150.00, 'day');

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_cost_estimates_project_id ON cost_estimates(project_id);
CREATE INDEX idx_bookmarked_grants_project_id ON bookmarked_grants(project_id);
CREATE INDEX idx_default_rates_category ON default_rates(category);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_grants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for projects table
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cost_estimates table
CREATE POLICY "Users can view cost estimates for own projects" ON cost_estimates
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can insert cost estimates for own projects" ON cost_estimates
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

-- Create RLS policies for bookmarked_grants table
CREATE POLICY "Users can view bookmarks for own projects" ON bookmarked_grants
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can insert bookmarks for own projects" ON bookmarked_grants
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can delete own bookmarks" ON bookmarked_grants
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

-- Default rates are readable by all authenticated users
CREATE POLICY "Authenticated users can view default rates" ON default_rates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
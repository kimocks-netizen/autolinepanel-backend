-- 1. Quotes table (customer submissions)
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_model TEXT,
  damage_description TEXT,
  images TEXT[], -- Stores Supabase Storage URLs
  status TEXT DEFAULT 'pending', -- 'pending' | 'contacted' | 'completed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Admin table (single admin login)
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Insert a test admin (use a real email & hashed password later)
INSERT INTO admins (email, password_hash) 
VALUES ('admin@example.com', 'hashed_password_here');
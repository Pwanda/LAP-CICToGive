-- Database initialization script for CIC to Give
-- This script sets up the initial database structure and sample data

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    reserved BOOLEAN DEFAULT FALSE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create item_images table for storing image URLs
CREATE TABLE IF NOT EXISTS item_images (
    item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (item_id, image_url)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comment (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    item_id BIGINT REFERENCES items(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_reserved ON items(reserved);
CREATE INDEX IF NOT EXISTS idx_comments_item_id ON comment(item_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comment(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - you can remove this section if not needed)
-- Note: Passwords are BCrypt hashed version of 'password123'
INSERT INTO users (username, email, password) VALUES
    ('admin', 'admin@cictogive.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FaQJdFfhWO/FdJwF7dWQbN8A5JzNQK'),
    ('john_doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FaQJdFfhWO/FdJwF7dWQbN8A5JzNQK'),
    ('jane_smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FaQJdFfhWO/FdJwF7dWQbN8A5JzNQK')
ON CONFLICT (username) DO NOTHING;

-- Insert sample items
INSERT INTO items (name, description, category, location, user_id) VALUES
    ('Alter Laptop', 'Funktionsfähiger Laptop, perfekt für Studenten', 'Electronics', 'Wien', 1),
    ('Küchengeschirr Set', 'Komplettes Geschirr-Set für 4 Personen', 'Other', 'Graz', 2),
    ('Bücher Sammlung', 'Verschiedene Romane und Sachbücher', 'Books', 'Linz', 3),
    ('Fahrrad', 'Stadtfahrrad in gutem Zustand', 'Vehicles', 'Salzburg', 1),
    ('Sofa', 'Gemütliches 2-Sitzer Sofa', 'Furniture', 'Innsbruck', 2)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comment (text, user_id, item_id) VALUES
    ('Ist der Laptop noch verfügbar?', 2, 1),
    ('Sieht sehr gut aus! Wann kann ich es abholen?', 3, 2),
    ('Welche Bücher sind dabei?', 1, 3)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message
SELECT 'Database initialization completed successfully!' as message;

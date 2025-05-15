-- Insert sample users (password is 'password' encoded with BCrypt)
INSERT INTO users (username, email, password) 
VALUES ('user1', 'user1@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a');

INSERT INTO users (username, email, password) 
VALUES ('user2', 'user2@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a');

-- Insert sample items
INSERT INTO item (name, description, category, location, created_at, updated_at, user_id) 
VALUES ('iPhone 13 Pro', 'Like new iPhone 13 Pro, 256GB storage, Pacific Blue color', 'Electronics', 'Vienna', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 1);

INSERT INTO item (name, description, category, location, created_at, updated_at, user_id) 
VALUES ('Mountain Bike', 'Trek mountain bike, excellent condition, barely used', 'Sports', 'Graz', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 1);

INSERT INTO item (name, description, category, location, created_at, updated_at, user_id) 
VALUES ('Leather Sofa', 'Brown leather sofa, 3 years old but in good condition', 'Furniture', 'Salzburg', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 2);

INSERT INTO item (name, description, category, location, created_at, updated_at, user_id) 
VALUES ('MacBook Pro 2022', 'M1 Pro chip, 16GB RAM, 512GB SSD, Space Gray', 'Electronics', 'Linz', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 2);

INSERT INTO item (name, description, category, location, created_at, updated_at, user_id) 
VALUES ('Dining Table Set', 'Wooden dining table with 6 chairs, excellent condition', 'Furniture', 'Vienna', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 1);

-- Insert sample item images
INSERT INTO item_images (item_id, image_url) VALUES (1, '/api/upload/images/sample-iphone.jpg');
INSERT INTO item_images (item_id, image_url) VALUES (2, '/api/upload/images/sample-bike.jpg');
INSERT INTO item_images (item_id, image_url) VALUES (3, '/api/upload/images/sample-sofa.jpg');
INSERT INTO item_images (item_id, image_url) VALUES (4, '/api/upload/images/sample-macbook.jpg');
INSERT INTO item_images (item_id, image_url) VALUES (5, '/api/upload/images/sample-table.jpg');

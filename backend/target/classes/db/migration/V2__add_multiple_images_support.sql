-- Migration to support multiple images per item
-- Drop the old image_url column and create new item_images table

-- Create the item_images table for multiple image URLs
CREATE TABLE IF NOT EXISTS item_images (
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (item_id, image_url)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON item_images(item_id);

-- Migrate existing single image URLs to the new table
INSERT INTO item_images (item_id, image_url)
SELECT id, image_url
FROM items
WHERE image_url IS NOT NULL AND image_url != '';

-- Drop the old image_url column
ALTER TABLE items DROP COLUMN IF EXISTS image_url;

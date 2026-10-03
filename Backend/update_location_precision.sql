-- Update location columns to store coordinates with higher precision
-- This fixes the issue where coordinates were being rounded to 2 decimal places

ALTER TABLE licenses MODIFY COLUMN location_lat DECIMAL(15, 10);
ALTER TABLE licenses MODIFY COLUMN location_lng DECIMAL(15, 10);

ALTER TABLE license_applications MODIFY COLUMN location_lat DECIMAL(15, 10);
ALTER TABLE license_applications MODIFY COLUMN location_lng DECIMAL(15, 10);

ALTER TABLE vending_zones MODIFY COLUMN latitude DECIMAL(15, 10);
ALTER TABLE vending_zones MODIFY COLUMN longitude DECIMAL(15, 10);

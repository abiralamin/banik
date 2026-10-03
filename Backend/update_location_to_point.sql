-- SQL script to change location from rectangle bounds to single point
-- Run this manually in your MySQL database

-- Drop old rectangle columns from license_applications
ALTER TABLE license_applications DROP COLUMN IF EXISTS location_sw_lat;
ALTER TABLE license_applications DROP COLUMN IF EXISTS location_sw_lng;
ALTER TABLE license_applications DROP COLUMN IF EXISTS location_ne_lat;
ALTER TABLE license_applications DROP COLUMN IF EXISTS location_ne_lng;

-- Add new point columns to license_applications
ALTER TABLE license_applications ADD COLUMN location_lat DECIMAL(10, 8);
ALTER TABLE license_applications ADD COLUMN location_lng DECIMAL(11, 8);

-- Drop old rectangle columns from licenses
ALTER TABLE licenses DROP COLUMN IF EXISTS location_sw_lat;
ALTER TABLE licenses DROP COLUMN IF EXISTS location_sw_lng;
ALTER TABLE licenses DROP COLUMN IF EXISTS location_ne_lat;
ALTER TABLE licenses DROP COLUMN IF EXISTS location_ne_lng;

-- Add new point columns to licenses
ALTER TABLE licenses ADD COLUMN location_lat DECIMAL(10, 8);
ALTER TABLE licenses ADD COLUMN location_lng DECIMAL(11, 8);

-- Verify the changes
SELECT 'license_applications columns' AS table_name;
SHOW COLUMNS FROM license_applications LIKE 'location_%';

SELECT 'licenses columns' AS table_name;
SHOW COLUMNS FROM licenses LIKE 'location_%';

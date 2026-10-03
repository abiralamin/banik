-- SQL script to add location coordinate columns to license_applications and licenses tables
-- Run this manually in your MySQL database

-- Add location columns to license_applications table
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'license_applications'
    AND COLUMN_NAME = 'location_sw_lat'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE license_applications ADD COLUMN location_sw_lat DECIMAL(10, 8)',
    'SELECT ''Column location_sw_lat already exists in license_applications'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'license_applications'
    AND COLUMN_NAME = 'location_sw_lng'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE license_applications ADD COLUMN location_sw_lng DECIMAL(11, 8)',
    'SELECT ''Column location_sw_lng already exists in license_applications'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'license_applications'
    AND COLUMN_NAME = 'location_ne_lat'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE license_applications ADD COLUMN location_ne_lat DECIMAL(10, 8)',
    'SELECT ''Column location_ne_lat already exists in license_applications'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'license_applications'
    AND COLUMN_NAME = 'location_ne_lng'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE license_applications ADD COLUMN location_ne_lng DECIMAL(11, 8)',
    'SELECT ''Column location_ne_lng already exists in license_applications'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add location columns to licenses table
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'licenses'
    AND COLUMN_NAME = 'location_sw_lat'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE licenses ADD COLUMN location_sw_lat DECIMAL(10, 8)',
    'SELECT ''Column location_sw_lat already exists in licenses'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'licenses'
    AND COLUMN_NAME = 'location_sw_lng'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE licenses ADD COLUMN location_sw_lng DECIMAL(11, 8)',
    'SELECT ''Column location_sw_lng already exists in licenses'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'licenses'
    AND COLUMN_NAME = 'location_ne_lat'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE licenses ADD COLUMN location_ne_lat DECIMAL(10, 8)',
    'SELECT ''Column location_ne_lat already exists in licenses'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'banik'
    AND TABLE_NAME = 'licenses'
    AND COLUMN_NAME = 'location_ne_lng'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE licenses ADD COLUMN location_ne_lng DECIMAL(11, 8)',
    'SELECT ''Column location_ne_lng already exists in licenses'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the columns were added
SELECT 'license_applications columns' AS table_name;
SHOW COLUMNS FROM license_applications LIKE 'location_%';

SELECT 'licenses columns' AS table_name;
SHOW COLUMNS FROM licenses LIKE 'location_%';

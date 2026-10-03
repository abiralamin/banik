-- Manual SQL script to update existing applications with missing data
-- Run this manually in your MySQL database

-- Check if facilities column exists, if not add it
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'banik' 
    AND TABLE_NAME = 'license_applications' 
    AND COLUMN_NAME = 'facilities'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE license_applications ADD COLUMN facilities VARCHAR(255) DEFAULT ''None''',
    'SELECT ''Column already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing applications to have default values for the new fields
UPDATE license_applications 
SET stall_dimensions = COALESCE(stall_dimensions, 'Standard'),
    operating_hours = COALESCE(operating_hours, '09:00-18:00'),
    facilities = COALESCE(facilities, 'None'),
    business_type = COALESCE(business_type, 'General')
WHERE stall_dimensions IS NULL OR operating_hours IS NULL OR facilities IS NULL OR business_type IS NULL;

-- Verify the updates
SELECT id, full_name, business_type, stall_dimensions, operating_hours, facilities 
FROM license_applications 
WHERE id = 13;

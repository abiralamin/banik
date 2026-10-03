-- Banik - Street Vendor Management System
-- 05_database_modifications.sql
-- Append future ALTER TABLE / migration statements here as the schema evolves.
-- Keeping historical modifications in one place makes it easy to re-apply on a fresh DB
-- after running 01-04, or to review schema history.

USE banik;

-- Example (no-op placeholder): future migrations go below this line.

-- Link each complaint to the specific license it concerns (vendor 1:N license 1:N complaint).
-- Safe to re-run on a fresh DB created from 01-04 since the column already exists there.
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS license_id BIGINT NULL AFTER vendor_id;

ALTER TABLE complaints
ADD CONSTRAINT fk_complaint_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_complaints_license ON complaints (license_id);

-- qr_code_data holds a full base64-encoded PNG data URL which is far longer than 500 chars;
-- VARCHAR(500) silently truncated it and caused every license approval/issuance to fail.
ALTER TABLE licenses MODIFY COLUMN qr_code_data LONGTEXT;
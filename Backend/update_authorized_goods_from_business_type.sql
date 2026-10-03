-- Update existing licenses to populate authorized_goods with business_type from the application
-- This fixes licenses that were issued before the business type was being used

UPDATE licenses l
SET authorized_goods = (
    SELECT business_type
    FROM license_applications
    WHERE id = l.application_id
)
WHERE authorized_goods IS NULL OR authorized_goods = '' OR authorized_goods = '—';

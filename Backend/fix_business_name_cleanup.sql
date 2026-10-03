-- Update applications with "Pending Update" to "Not Specified"
UPDATE license_applications
SET business_name = 'Not Specified'
WHERE business_name = 'Pending Update';

-- Verify the update
SELECT id, full_name, business_name
FROM license_applications
WHERE business_name = 'Not Specified';

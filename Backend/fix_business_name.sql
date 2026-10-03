-- Update existing applications that have "Business Name" as hardcoded value
-- Use the vendor's profile business name instead

UPDATE license_applications la
JOIN users u ON la.vendor_id = u.id
LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
SET la.business_name = COALESCE(vp.business_name, 'Pending Update')
WHERE la.business_name = 'Business Name';

-- Verify the update
SELECT la.id, la.full_name, la.business_name, vp.business_name as profile_business_name
FROM license_applications la
JOIN users u ON la.vendor_id = u.id
LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
WHERE la.business_name = 'Business Name' OR la.business_name = 'Pending Update';

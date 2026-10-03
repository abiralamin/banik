-- Banik - Street Vendor Management System
-- 04_create_indexes.sql : performance indexes beyond PK/FK auto-indexes
USE banik;

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_users_email_verified ON users (email_verified);

CREATE INDEX idx_otp_user_purpose ON otp_codes (user_id, purpose, used);

CREATE INDEX idx_zones_area ON vending_zones (area);

CREATE INDEX idx_zones_status ON vending_zones (status);

CREATE INDEX idx_applications_vendor ON license_applications (vendor_id);

CREATE INDEX idx_applications_status ON license_applications (status);

CREATE INDEX idx_applications_zone ON license_applications (primary_zone_id);

CREATE INDEX idx_applications_submitted_at ON license_applications (submitted_at);

CREATE INDEX idx_licenses_vendor ON licenses (vendor_id);

CREATE INDEX idx_licenses_status ON licenses (status);

CREATE INDEX idx_licenses_validity_end ON licenses (validity_end);

CREATE INDEX idx_licenses_zone ON licenses (zone_id);

CREATE INDEX idx_renewals_license ON license_renewals (license_id, status);

CREATE INDEX idx_payments_status ON license_payments (status, payment_type);

CREATE INDEX idx_complaints_vendor ON complaints (vendor_id);

CREATE INDEX idx_complaints_license ON complaints (license_id);

CREATE INDEX idx_complaints_status ON complaints (status);

CREATE INDEX idx_complaints_category ON complaints (category);

CREATE INDEX idx_notifications_category ON notifications (category);

CREATE INDEX idx_notification_recipients_user ON notification_recipients (user_id, is_read);

CREATE INDEX idx_announcements_pinned ON announcements (is_pinned, is_archived);

CREATE INDEX idx_activity_logs_actor ON activity_logs (actor_id, created_at);
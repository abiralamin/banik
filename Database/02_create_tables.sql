-- Banik - Street Vendor Management System
-- 02_create_tables.sql : all core tables, PKs and FKs
USE banik;

-- ===================== USERS & AUTH =====================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('VENDOR', 'ADMIN') NOT NULL DEFAULT 'VENDOR',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE otp_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose ENUM(
        'REGISTER_VERIFY',
        'RESET_PASSWORD'
    ) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ===================== VENDOR PROFILE =====================
CREATE TABLE vendor_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    date_of_birth DATE,
    address VARCHAR(255),
    phone VARCHAR(30),
    business_name VARCHAR(150),
    business_type VARCHAR(100),
    stall_dimensions VARCHAR(50),
    operating_hours VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    national_id_number VARCHAR(50),
    profile_completion INT NOT NULL DEFAULT 0,
    deactivation_requested BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendorprofile_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ===================== ZONES =====================
CREATE TABLE vending_zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    area VARCHAR(150) NOT NULL,
    zone_type VARCHAR(80),
    description VARCHAR(500),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    dimensions_sqm DECIMAL(10, 2),
    total_spots INT NOT NULL DEFAULT 0,
    occupied_spots INT NOT NULL DEFAULT 0,
    has_electricity BOOLEAN NOT NULL DEFAULT FALSE,
    has_water BOOLEAN NOT NULL DEFAULT FALSE,
    has_shade BOOLEAN NOT NULL DEFAULT FALSE,
    nearby_landmarks VARCHAR(255),
    operating_hours VARCHAR(100),
    rules VARCHAR(1000),
    supervisor_name VARCHAR(150),
    supervisor_contact VARCHAR(50),
    price_daily DECIMAL(10, 2) DEFAULT 0,
    price_weekly DECIMAL(10, 2) DEFAULT 0,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_annual DECIMAL(10, 2) DEFAULT 0,
    status ENUM(
        'AVAILABLE',
        'PARTIAL',
        'FULL'
    ) NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE zone_spots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    zone_id BIGINT NOT NULL,
    spot_number VARCHAR(20) NOT NULL,
    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
    license_id BIGINT NULL,
    CONSTRAINT fk_zonespot_zone FOREIGN KEY (zone_id) REFERENCES vending_zones (id) ON DELETE CASCADE,
    UNIQUE KEY uq_zone_spot (zone_id, spot_number)
) ENGINE = InnoDB;

-- ===================== LICENSE APPLICATIONS =====================
CREATE TABLE license_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    date_of_birth DATE,
    address VARCHAR(255),
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(100),
    stall_dimensions VARCHAR(50),
    operating_hours VARCHAR(100),
    primary_zone_id BIGINT NOT NULL,
    alternate_zone_id BIGINT NULL,
    license_type ENUM(
        'DAILY',
        'WEEKLY',
        'MONTHLY',
        'ANNUAL'
    ) NOT NULL,
    status ENUM(
        'SUBMITTED',
        'UNDER_REVIEW',
        'MORE_INFO_REQUESTED',
        'APPROVED',
        'REJECTED',
        'WITHDRAWN'
    ) NOT NULL DEFAULT 'SUBMITTED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    rejection_reason VARCHAR(500),
    admin_notes VARCHAR(1000),
    assigned_officer_id BIGINT NULL,
    documents_verified BOOLEAN NOT NULL DEFAULT FALSE,
    background_check_done BOOLEAN NOT NULL DEFAULT FALSE,
    zone_availability_checked BOOLEAN NOT NULL DEFAULT FALSE,
    fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_app_primary_zone FOREIGN KEY (primary_zone_id) REFERENCES vending_zones (id),
    CONSTRAINT fk_app_alt_zone FOREIGN KEY (alternate_zone_id) REFERENCES vending_zones (id),
    CONSTRAINT fk_app_officer FOREIGN KEY (assigned_officer_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE application_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    doc_type ENUM(
        'NATIONAL_ID',
        'BANK_DETAILS',
        'OTHER'
    ) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_name VARCHAR(255),
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_app FOREIGN KEY (application_id) REFERENCES license_applications (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE application_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    remarks VARCHAR(500),
    changed_by BIGINT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_app FOREIGN KEY (application_id) REFERENCES license_applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users (id)
) ENGINE = InnoDB;

-- ===================== LICENSES =====================
CREATE TABLE licenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    vendor_id BIGINT NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    zone_id BIGINT NOT NULL,
    license_type ENUM(
        'DAILY',
        'WEEKLY',
        'MONTHLY',
        'ANNUAL'
    ) NOT NULL,
    category VARCHAR(80),
    authorized_goods VARCHAR(255),
    issue_date DATE NOT NULL,
    validity_start DATE NOT NULL,
    validity_end DATE NOT NULL,
    status ENUM(
        'ACTIVE',
        'EXPIRED',
        'REVOKED',
        'SUSPENDED'
    ) NOT NULL DEFAULT 'ACTIVE',
    qr_code_data LONGTEXT,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    lost_reported BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_license_app FOREIGN KEY (application_id) REFERENCES license_applications (id),
    CONSTRAINT fk_license_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_license_zone FOREIGN KEY (zone_id) REFERENCES vending_zones (id)
) ENGINE = InnoDB;

CREATE TABLE license_renewals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_id BIGINT NOT NULL,
    period ENUM(
        'ONE_MONTH',
        'THREE_MONTHS',
        'SIX_MONTHS',
        'ONE_YEAR'
    ) NOT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM(
        'PENDING',
        'PAID',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',
    new_validity_end DATE,
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME NULL,
    CONSTRAINT fk_renewal_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE license_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_id BIGINT NULL,
    application_id BIGINT NULL,
    renewal_id BIGINT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type ENUM(
        'APPLICATION_FEE',
        'RENEWAL_FEE'
    ) NOT NULL,
    status ENUM(
        'PENDING',
        'PAID',
        'DUMMY_PAID'
    ) NOT NULL DEFAULT 'PENDING',
    method VARCHAR(50) DEFAULT 'DUMMY',
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_app FOREIGN KEY (application_id) REFERENCES license_applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_renewal FOREIGN KEY (renewal_id) REFERENCES license_renewals (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ===================== COMPLAINTS =====================
CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    license_id BIGINT NULL,
    tracking_number VARCHAR(30) NOT NULL UNIQUE,
    subject VARCHAR(150) NOT NULL,
    category ENUM(
        'ZONE_ISSUE',
        'LICENSE_PROBLEM',
        'PAYMENT_ISSUE',
        'HARASSMENT',
        'ILLEGAL_EVICTION',
        'OTHERS'
    ) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
    ) NOT NULL DEFAULT 'OPEN',
    assigned_admin_id BIGINT NULL,
    rating INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_complaint_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE SET NULL,
    CONSTRAINT fk_complaint_admin FOREIGN KEY (assigned_admin_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE complaint_evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidence_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE complaint_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    actor_id BIGINT NULL,
    action VARCHAR(60) NOT NULL,
    comment VARCHAR(1000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chistory_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE,
    CONSTRAINT fk_chistory_actor FOREIGN KEY (actor_id) REFERENCES users (id)
) ENGINE = InnoDB;

-- ===================== NOTIFICATIONS =====================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    category ENUM(
        'LICENSE_UPDATE',
        'PAYMENT_REMINDER',
        'RENEWAL_ALERT',
        'ZONE_CHANGE',
        'INSPECTION_NOTICE',
        'SYSTEM_ANNOUNCEMENT'
    ) NOT NULL,
    target_type ENUM(
        'ALL',
        'ZONE',
        'LICENSE_TYPE',
        'INDIVIDUAL'
    ) NOT NULL DEFAULT 'ALL',
    target_value VARCHAR(100),
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    channel_email BOOLEAN NOT NULL DEFAULT TRUE,
    channel_sms BOOLEAN NOT NULL DEFAULT FALSE,
    channel_inapp BOOLEAN NOT NULL DEFAULT TRUE,
    scheduled_at DATETIME NULL,
    sent_at DATETIME NULL,
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE notification_recipients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME NULL,
    delivered_at DATETIME NULL,
    CONSTRAINT fk_recipient_notification FOREIGN KEY (notification_id) REFERENCES notifications (id) ON DELETE CASCADE,
    CONSTRAINT fk_recipient_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ===================== ANNOUNCEMENTS / FAQ / FEEDBACK / SUPPORT =====================
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    category ENUM(
        'POLICY_CHANGE',
        'NEW_FEATURE',
        'EVENT',
        'HOLIDAY'
    ) NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    attachment_path VARCHAR(500),
    created_by BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category ENUM(
        'REGISTRATION',
        'LICENSING',
        'PAYMENTS',
        'RENEWALS',
        'COMPLAINTS'
    ) NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NULL,
    rating INT NOT NULL,
    message VARCHAR(2000),
    feature_request VARCHAR(1000),
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
    ) NOT NULL DEFAULT 'OPEN',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ===================== INSPECTIONS / ACTIVITY LOG / WOMEN SUPPORT =====================
CREATE TABLE inspections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_id BIGINT NULL,
    application_id BIGINT NULL,
    scheduled_at DATETIME NOT NULL,
    inspector_id BIGINT NULL,
    findings VARCHAR(1000),
    status ENUM(
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'SCHEDULED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inspection_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE,
    CONSTRAINT fk_inspection_app FOREIGN KEY (application_id) REFERENCES license_applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_inspection_inspector FOREIGN KEY (inspector_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(60),
    entity_id BIGINT,
    details VARCHAR(1000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE women_community_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content VARCHAR(3000) NOT NULL,
    is_success_story BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_womenpost_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;
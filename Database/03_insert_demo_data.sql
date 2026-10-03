-- Banik - Street Vendor Management System
-- 03_insert_demo_data.sql
-- NOTE: Demo USERS (admin/vendors), profiles, applications, licenses, complaints and notifications
-- are seeded by the Spring Boot backend on startup (see DataSeeder.java) so that passwords are
-- properly BCrypt-hashed and relational IDs stay consistent. This script only seeds static
-- reference/demo data that does not involve password hashing: zones, FAQs, announcements.
USE banik;

INSERT INTO
    vending_zones (
        name,
        area,
        zone_type,
        description,
        latitude,
        longitude,
        dimensions_sqm,
        total_spots,
        occupied_spots,
        has_electricity,
        has_water,
        has_shade,
        nearby_landmarks,
        operating_hours,
        rules,
        supervisor_name,
        supervisor_contact,
        price_daily,
        price_weekly,
        price_monthly,
        price_annual,
        status
    )
VALUES (
        'Mirpur Central Hawkers Market',
        'Mirpur',
        'Food & Retail',
        'Busy central market zone near Mirpur 10 roundabout.',
        23.8067,
        90.3687,
        250.00,
        40,
        18,
        TRUE,
        TRUE,
        TRUE,
        'Mirpur 10 Circle, Metro Rail Station',
        '07:00-21:00',
        'No permanent structures. Keep walkway clear.',
        'Md. Kamal Hossain',
        '01711000001',
        50.00,
        300.00,
        1100.00,
        12000.00,
        'PARTIAL'
    ),
    (
        'Farmgate Footpath Zone',
        'Farmgate',
        'Food & Retail',
        'High foot-traffic zone near Farmgate overbridge.',
        23.7576,
        90.3888,
        180.00,
        30,
        30,
        TRUE,
        FALSE,
        TRUE,
        'Farmgate Overbridge, Tejgaon College',
        '06:00-22:00',
        'Fire safety equipment mandatory for food stalls.',
        'Rehana Akter',
        '01711000002',
        60.00,
        350.00,
        1300.00,
        14000.00,
        'FULL'
    ),
    (
        'Gulshan-2 Vendor Corner',
        'Gulshan',
        'Retail',
        'Upscale retail vending corner.',
        23.7925,
        90.4078,
        300.00,
        25,
        5,
        TRUE,
        TRUE,
        FALSE,
        'Gulshan-2 Circle',
        '09:00-20:00',
        'Uniform stall design required.',
        'Anisur Rahman',
        '01711000003',
        80.00,
        450.00,
        1700.00,
        18000.00,
        'AVAILABLE'
    ),
    (
        'Uttara Sector 7 Market Strip',
        'Uttara',
        'Food & Retail',
        'Residential-adjacent vending strip.',
        23.8759,
        90.3795,
        200.00,
        35,
        10,
        FALSE,
        TRUE,
        TRUE,
        'Sector 7 Park, Rajlokkhi School',
        '07:00-20:00',
        'No loudspeakers after 8 PM.',
        'Sharmin Sultana',
        '01711000004',
        45.00,
        280.00,
        1000.00,
        11000.00,
        'AVAILABLE'
    );

INSERT INTO
    faqs (category, question, answer)
VALUES (
        'REGISTRATION',
        'How do I register as a vendor?',
        'Go to the Register page, enter your email and password, then verify the OTP sent to your email.'
    ),
    (
        'REGISTRATION',
        'I did not receive my OTP, what do I do?',
        'Use the Resend OTP option on the verification page. Codes expire after 10 minutes.'
    ),
    (
        'LICENSING',
        'How many licenses can I hold?',
        'You may apply for and hold multiple licenses across different zones simultaneously.'
    ),
    (
        'LICENSING',
        'What documents are required?',
        'A valid National ID proof and your bank account details are required during application.'
    ),
    (
        'PAYMENTS',
        'Can I pay later?',
        'Yes, you may submit your application and choose "Pay Later", but the license is only issued after payment is confirmed.'
    ),
    (
        'RENEWALS',
        'When can I renew my license?',
        'Renewal becomes available 30 days before expiry. Early-bird discounts apply if renewed early.'
    ),
    (
        'COMPLAINTS',
        'How do I track my complaint?',
        'Every submitted complaint receives a tracking number visible under "My Complaints".'
    );

INSERT INTO
    announcements (
        title,
        body,
        category,
        is_pinned,
        created_at
    )
VALUES (
        'Welcome to Banik',
        'The digital street vendor management platform is now live for all vendors.',
        'NEW_FEATURE',
        TRUE,
        NOW()
    ),
    (
        'Eid Holiday Notice',
        'License application review will be paused during the Eid holidays.',
        'HOLIDAY',
        FALSE,
        NOW()
    ),
    (
        'Updated Renewal Policy',
        'Early-bird renewal discounts increased to 10% for annual licenses.',
        'POLICY_CHANGE',
        FALSE,
        NOW()
    );
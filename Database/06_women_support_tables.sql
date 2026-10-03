-- Women Vendor Support Tables
USE banik;

-- Women Schemes Table
CREATE TABLE women_schemes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    benefits TEXT,
    eligibility_criteria TEXT,
    application_process TEXT,
    deadline VARCHAR(100),
    contact_info VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Women Community Posts Table (replacing the existing one if needed)
DROP TABLE IF EXISTS women_community_posts;
CREATE TABLE women_community_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_success_story BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_womenpost_vendor FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Safety Tips Table
CREATE TABLE safety_tips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    tip_category VARCHAR(50),
    emergency_contact VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Insert sample data
INSERT INTO women_schemes (title, description, benefits, eligibility_criteria, application_process, deadline, contact_info) VALUES
('Women Entrepreneurship Grant', 'Financial support for women street vendors to start or expand their business', 'Up to ৳50,000 grant, business training, mentorship support', 'Female vendor, operating for at least 6 months, annual income below ৳200,000', 'Submit application with business plan and income statement to the local municipal office', '2026-12-31', 'Contact: 01712-345678, Email: women.support@banik.gov.bd'),
('Micro-Loan Scheme', 'Low-interest loans for women vendors to purchase equipment and inventory', 'Interest rate: 5% per annum, loan amount: ৳10,000-৳100,000, flexible repayment terms', 'Female vendor, valid business license, good credit history', 'Apply through designated micro-finance institutions with Banik recommendation', 'Rolling basis', 'Contact: 01812-345678, Email: microloan@banik.gov.bd'),
('Health Insurance Subsidy', 'Subsidized health insurance for women vendors and their families', '50% premium subsidy, coverage for medical expenses, maternity benefits', 'Female vendor with active license, family income below ৳300,000', 'Submit application to health department with income proof', '2026-11-30', 'Contact: 01912-345678, Email: health@banik.gov.bd');

INSERT INTO safety_tips (title, content, tip_category, emergency_contact) VALUES
('Emergency Contacts', 'Keep these numbers handy: Police: 999, Women Helpline: 999, Banik Support: 01712-345678', 'Emergency', 'Police: 999, Women Helpline: 999, Banik Support: 01712-345678'),
('Safety During Night Hours', 'Avoid working alone at night. If you must, stay in well-lit areas and inform family of your location', 'General Safety', 'Police: 999, Women Helpline: 999'),
('Protect Your Equipment', 'Secure your stall with good locks. Never leave valuable items unattended. Consider installing a small CCTV if possible', 'Property Safety', 'Local Police Station: Contact your zone in-charge'),
('Report Harassment Immediately', 'If you face any form of harassment, report it immediately to the zone in-charge or call the women helpline. Your identity will be protected if requested', 'Personal Safety', 'Women Helpline: 999, Banik Support: 01712-345678'),
('Financial Safety', 'Keep daily earnings in a secure place. Use mobile banking when possible. Don\'t carry large amounts of cash', 'Financial Safety', 'Bank Helpline: 16216, Police: 999');

INSERT INTO women_community_posts (vendor_id, title, content, is_success_story) VALUES
(2, 'From Street Stall to Shop Owner', 'I started with a small fruit cart 3 years ago. With the help of Banik and the women entrepreneur grant, I now own a proper shop with 3 employees. Never give up on your dreams!', true),
(2, 'Tips for New Vendors', 'Always maintain good relations with customers. Quality products and honest pricing will bring you regular customers. Be patient in the beginning.', false),
(2, 'Balancing Family and Business', 'As a mother of two, it was challenging to manage both. I started early morning operations and closed by afternoon to be with my kids. My husband helps on weekends. Teamwork makes it possible!', true);
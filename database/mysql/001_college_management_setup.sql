CREATE DATABASE IF NOT EXISTS `college_management` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `college_management`;

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(160) NOT NULL,
  `code` VARCHAR(40) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `institutes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `code` VARCHAR(40) NOT NULL,
  `type` VARCHAR(80) DEFAULT NULL,
  `contact_email` VARCHAR(160) DEFAULT NULL,
  `contact_phone` VARCHAR(30) DEFAULT NULL,
  `receipt_prefix` VARCHAR(20) DEFAULT NULL,
  `header_title` VARCHAR(255) DEFAULT NULL,
  `header_subtitle` VARCHAR(255) DEFAULT NULL,
  `header_address` TEXT DEFAULT NULL,
  `principal_name` VARCHAR(160) DEFAULT NULL,
  `footer_note` TEXT DEFAULT NULL,
  `website_url` VARCHAR(180) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `academic_years` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `label` VARCHAR(20) NOT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `is_current` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `theme_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` INT UNSIGNED NOT NULL,
  `institute_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(120) NOT NULL,
  `theme_json` LONGTEXT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED DEFAULT NULL,
  `username` VARCHAR(60) NOT NULL,
  `full_name` VARCHAR(160) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `role_code` VARCHAR(40) NOT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `whatsapp_number` VARCHAR(30) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `students` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `gr_number` VARCHAR(40) NOT NULL,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `category` VARCHAR(40) DEFAULT NULL,
  `current_class` VARCHAR(40) DEFAULT NULL,
  `division` VARCHAR(10) DEFAULT NULL,
  `mobile_number` VARCHAR(30) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_students_gr_number` (`gr_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `scholarship_applications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `scheme_name` VARCHAR(160) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'pending',
  `is_eligible` TINYINT(1) NOT NULL DEFAULT 1,
  `expected_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `student_ledger_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `entry_date` DATE NOT NULL,
  `reference` VARCHAR(160) NOT NULL,
  `mode` VARCHAR(40) DEFAULT NULL,
  `debit` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `credit` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `note` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `dashboard_targets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `module` VARCHAR(120) NOT NULL,
  `target` INT NOT NULL DEFAULT 0,
  `achieved` INT NOT NULL DEFAULT 0,
  `pending` INT NOT NULL DEFAULT 0,
  `owner` VARCHAR(120) DEFAULT NULL,
  `trend` VARCHAR(20) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `enquiry_number` VARCHAR(40) NOT NULL,
  `student_name` VARCHAR(160) NOT NULL,
  `mobile_number` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(160) DEFAULT NULL,
  `source` VARCHAR(40) DEFAULT NULL,
  `desired_course` VARCHAR(80) DEFAULT NULL,
  `current_class` VARCHAR(40) DEFAULT NULL,
  `category` VARCHAR(40) DEFAULT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'new',
  `assigned_to` VARCHAR(120) DEFAULT NULL,
  `follow_up_date` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enquiries_enquiry_number` (`enquiry_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enquiry_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED DEFAULT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `admission_number` VARCHAR(40) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'confirmed',
  `admitted_on` DATE DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admissions_admission_number` (`admission_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `certificate_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `request_number` VARCHAR(50) NOT NULL,
  `certificate_type` VARCHAR(60) NOT NULL,
  `purpose` TEXT DEFAULT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'requested',
  `verification_token` VARCHAR(80) DEFAULT NULL,
  `issued_on` DATE DEFAULT NULL,
  `requested_by` VARCHAR(120) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_certificate_requests_request_number` (`request_number`),
  UNIQUE KEY `uq_certificate_requests_verification_token` (`verification_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `fee_receipts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `ledger_entry_id` INT UNSIGNED DEFAULT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED NOT NULL,
  `receipt_number` VARCHAR(50) NOT NULL,
  `receipt_date` DATE NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `payment_mode` VARCHAR(40) DEFAULT NULL,
  `received_by` VARCHAR(120) DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `verification_token` VARCHAR(80) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fee_receipts_receipt_number` (`receipt_number`),
  UNIQUE KEY `uq_fee_receipts_verification_token` (`verification_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `organizations` (`id`, `name`, `code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Demo Education Trust', 'DET', 'active', NOW(), NOW());

INSERT IGNORE INTO `institutes` (`id`, `organization_id`, `name`, `code`, `type`, `contact_email`, `contact_phone`, `receipt_prefix`, `header_title`, `header_subtitle`, `header_address`, `principal_name`, `footer_note`, `website_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Junior College', 'JC', 'Higher Secondary', 'jc@example.edu', '9876543210', 'JC-R', 'Demo Education Trust - Junior College', 'Affiliated Higher Secondary Section', 'Main Road, Aurangabad, Maharashtra', 'Dr. Sunita Deshmukh', 'Quality education, discipline, and student support are our core values.', 'https://jc.demo-college.local', 'active', NOW(), NOW()),
(2, 1, 'Degree College', 'DC', 'Undergraduate', 'degree@example.edu', '9876543211', 'DC-R', 'Demo Education Trust - Degree College', 'NAAC-ready Undergraduate Programs', 'Civil Lines, Aurangabad, Maharashtra', 'Prof. Rajesh Kulkarni', 'All receipts and certificates can be verified through QR validation.', 'https://degree.demo-college.local', 'active', NOW(), NOW()),
(3, 1, 'B.Ed College', 'BED', 'Professional', 'bed@example.edu', '9876543212', 'BED-R', 'Demo Education Trust - B.Ed College', 'Professional Teacher Education Wing', 'Station Road, Aurangabad, Maharashtra', 'Dr. Nilofer Shaikh', 'Institute follows academic-year-based and IQAC-aligned operations.', 'https://bed.demo-college.local', 'active', NOW(), NOW());

INSERT IGNORE INTO `academic_years` (`id`, `institute_id`, `label`, `start_date`, `end_date`, `is_current`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-26', '2025-06-01', '2026-05-31', 1, NOW(), NOW()),
(2, 2, '2025-26', '2025-06-01', '2026-05-31', 1, NOW(), NOW()),
(3, 3, '2025-26', '2025-06-01', '2026-05-31', 1, NOW(), NOW());

INSERT IGNORE INTO `theme_profiles` (`id`, `organization_id`, `institute_id`, `name`, `theme_json`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Default Theme', '{"primaryColor":"#4f46e5","secondaryColor":"#0f172a","accentColor":"#14b8a6","backgroundColor":"#f4f7fb","surfaceColor":"#ffffff","textColor":"#0f172a","headerStart":"#1d4ed8","headerEnd":"#0f766e","fontFamily":"Inter, sans-serif","radius":18,"shadowStrength":18}', 1, NOW(), NOW());

-- Password for all seeded users below: Password@123
INSERT IGNORE INTO `users` (`id`, `institute_id`, `username`, `full_name`, `email`, `role_code`, `password_hash`, `whatsapp_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'superadmin', 'Super Admin', 'superadmin@example.edu', 'SUPER_ADMIN', '$2y$10$BYjHvOhTUUEK5IenbB.Zv.mYxq3Lx3dMLlddQX6g0lh9KnE6AEsAK', '9876543200', 'active', NOW(), NOW()),
(2, 1, 'clerk01', 'Clerk User', 'clerk01@example.edu', 'CLERK', '$2y$10$BYjHvOhTUUEK5IenbB.Zv.mYxq3Lx3dMLlddQX6g0lh9KnE6AEsAK', '9876543201', 'active', NOW(), NOW()),
(3, 1, 'accounts01', 'Account User', 'accounts01@example.edu', 'ACCOUNTANT', '$2y$10$BYjHvOhTUUEK5IenbB.Zv.mYxq3Lx3dMLlddQX6g0lh9KnE6AEsAK', '9876543202', 'active', NOW(), NOW()),
(4, 2, 'clerk02', 'Degree Clerk', 'clerk02@example.edu', 'CLERK', '$2y$10$BYjHvOhTUUEK5IenbB.Zv.mYxq3Lx3dMLlddQX6g0lh9KnE6AEsAK', '9876543203', 'active', NOW(), NOW()),
(5, 3, 'accounts02', 'B.Ed Accounts', 'accounts02@example.edu', 'ACCOUNTANT', '$2y$10$BYjHvOhTUUEK5IenbB.Zv.mYxq3Lx3dMLlddQX6g0lh9KnE6AEsAK', '9876543204', 'active', NOW(), NOW());

INSERT IGNORE INTO `students` (`id`, `institute_id`, `academic_year_id`, `gr_number`, `first_name`, `last_name`, `gender`, `category`, `current_class`, `division`, `mobile_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'JC2025001', 'Aarav', 'Patil', 'Male', 'OBC', 'FYJC', 'A', '9000000001', 'active', NOW(), NOW()),
(2, 1, 1, 'JC2025002', 'Sakshi', 'Jadhav', 'Female', 'SC', 'FYJC', 'A', '9000000002', 'active', NOW(), NOW()),
(3, 2, 2, 'DC2025001', 'Rohit', 'Kale', 'Male', 'Open', 'B.Com I', 'B', '9000000003', 'active', NOW(), NOW()),
(4, 2, 2, 'DC2025002', 'Fatima', 'Shaikh', 'Female', 'Minority', 'B.A I', 'A', '9000000004', 'active', NOW(), NOW()),
(5, 3, 3, 'BED2025001', 'Neha', 'More', 'Female', 'EWS', 'B.Ed I', 'A', '9000000005', 'active', NOW(), NOW());

INSERT IGNORE INTO `scholarship_applications` (`id`, `student_id`, `institute_id`, `academic_year_id`, `scheme_name`, `status`, `is_eligible`, `expected_amount`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Post Matric Scholarship to OBC Students', 'submitted', 1, 8000, NOW(), NOW()),
(2, 2, 1, 1, 'Government of India Post-Matric Scholarship', 'verified', 1, 12000, NOW(), NOW()),
(3, 4, 2, 2, 'Minority Scholarship', 'pending', 1, 9000, NOW(), NOW()),
(4, 5, 3, 3, 'EWS Tuition Support', 'approved', 1, 7000, NOW(), NOW());

INSERT IGNORE INTO `student_ledger_entries` (`id`, `student_id`, `institute_id`, `academic_year_id`, `entry_date`, `reference`, `mode`, `debit`, `credit`, `balance`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, '2026-04-01', 'Opening balance', 'System', 54000, 0, 54000, 'Fee structure mapped', NOW(), NOW()),
(2, 1, 1, 1, '2026-04-05', 'Admission fee receipt', 'Cash', 0, 12000, 42000, 'Receipt JC-R-0001', NOW(), NOW()),
(3, 1, 1, 1, '2026-04-10', 'Scholarship expected', 'MahaDBT', 0, 8000, 34000, 'Expected reimbursement', NOW(), NOW()),
(4, 1, 1, 1, '2026-04-17', 'Tuition fee receipt', 'UPI', 0, 15500, 18500, 'Receipt JC-R-0002', NOW(), NOW());

INSERT IGNORE INTO `fee_receipts` (`id`, `student_id`, `ledger_entry_id`, `institute_id`, `academic_year_id`, `receipt_number`, `receipt_date`, `amount`, `payment_mode`, `received_by`, `remarks`, `verification_token`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 1, 'JC-R-0001', '2026-04-05', 12000, 'Cash', 'Account Office', 'Admission fee collected at counter.', 'RCPT-JC-2026-0001', NOW(), NOW()),
(2, 1, 4, 1, 1, 'JC-R-0002', '2026-04-17', 15500, 'UPI', 'Account Office', 'Second installment received through UPI.', 'RCPT-JC-2026-0002', NOW(), NOW());

INSERT IGNORE INTO `dashboard_targets` (`id`, `institute_id`, `module`, `target`, `achieved`, `pending`, `owner`, `trend`, `created_at`, `updated_at`) VALUES
(1, 1, 'Scholarship follow-up', 120, 92, 28, 'Clerk Desk', 'Up', NOW(), NOW()),
(2, 1, 'Admission conversion', 220, 163, 57, 'Admissions Team', 'Up', NOW(), NOW()),
(3, 1, 'Fee collection drive', 500, 428, 72, 'Account Office', 'Stable', NOW(), NOW());

INSERT IGNORE INTO `enquiries` (`id`, `institute_id`, `academic_year_id`, `enquiry_number`, `student_name`, `mobile_number`, `email`, `source`, `desired_course`, `current_class`, `category`, `status`, `assigned_to`, `follow_up_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'ENQ-JC-0001', 'Pratiksha More', '9011111111', 'pratiksha@example.com', 'Website', 'FYJC Science', '10th', 'OBC', 'new', 'Clerk Desk', '2026-04-09', 'Interested in science stream and scholarship guidance.', NOW(), NOW()),
(2, 1, 1, 'ENQ-JC-0002', 'Tanish Jadhav', '9022222222', 'tanish@example.com', 'Reference', 'FYJC Commerce', '10th', 'SC', 'follow-up', 'Admissions Team', '2026-04-10', 'Waiting for document submission and caste certificate copy.', NOW(), NOW()),
(3, 1, 1, 'ENQ-JC-0003', 'Aditi Kulkarni', '9033333333', 'aditi@example.com', 'Walk-in', 'FYJC Arts', '10th', 'Open', 'converted', 'Clerk Desk', '2026-04-08', 'Converted after counselling visit.', NOW(), NOW()),
(4, 2, 2, 'ENQ-DC-0001', 'Farhan Shaikh', '9044444444', 'farhan@example.com', 'Website', 'B.Com I', '12th', 'Minority', 'new', 'Degree Admission Cell', '2026-04-11', 'Asks about minority scholarship and fee concession.', NOW(), NOW()),
(5, 3, 3, 'ENQ-BED-0001', 'Sneha Pawar', '9055555555', 'sneha@example.com', 'Campaign', 'B.Ed I', 'Graduation', 'EWS', 'contacted', 'Professional Wing Desk', '2026-04-12', 'Interested in hostel and scholarship support.', NOW(), NOW());

INSERT IGNORE INTO `admissions` (`id`, `enquiry_id`, `student_id`, `institute_id`, `academic_year_id`, `admission_number`, `status`, `admitted_on`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 3, NULL, 1, 1, 'ADM-2026-0003', 'confirmed', '2026-04-08', 'Converted from enquiry after counselling and document verification.', NOW(), NOW());

INSERT IGNORE INTO `certificate_requests` (`id`, `student_id`, `institute_id`, `academic_year_id`, `request_number`, `certificate_type`, `purpose`, `status`, `verification_token`, `issued_on`, `requested_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'CERT-JC-0001', 'bonafide', 'Bank account opening for scholarship process.', 'issued', 'CERT-JC-2026-0001', '2026-04-07', 'Clerk Desk', NOW(), NOW()),
(2, 2, 1, 1, 'CERT-JC-0002', 'transfer_certificate', 'Migration to another college after relocation.', 'requested', NULL, NULL, 'Admissions Team', NOW(), NOW()),
(3, 3, 2, 2, 'CERT-DC-0001', 'no_dues', 'Internship and library clearance requirement.', 'verified', 'CERT-DC-2026-0001', '2026-04-06', 'Account Office', NOW(), NOW());

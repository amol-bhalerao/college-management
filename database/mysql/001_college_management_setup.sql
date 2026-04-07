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
  `logo_url` VARCHAR(255) DEFAULT NULL,
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
  `guardian_name` VARCHAR(160) DEFAULT NULL,
  `mother_name` VARCHAR(160) DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `category` VARCHAR(40) DEFAULT NULL,
  `nationality` VARCHAR(80) DEFAULT NULL,
  `religion` VARCHAR(80) DEFAULT NULL,
  `caste_subcaste` VARCHAR(120) DEFAULT NULL,
  `current_class` VARCHAR(80) DEFAULT NULL,
  `division` VARCHAR(10) DEFAULT NULL,
  `mobile_number` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(160) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `date_of_birth_words` VARCHAR(180) DEFAULT NULL,
  `place_of_birth` VARCHAR(120) DEFAULT NULL,
  `birth_taluka` VARCHAR(120) DEFAULT NULL,
  `birth_district` VARCHAR(120) DEFAULT NULL,
  `birth_state` VARCHAR(120) DEFAULT NULL,
  `previous_school` VARCHAR(180) DEFAULT NULL,
  `date_of_admission` DATE DEFAULT NULL,
  `date_of_leaving` DATE DEFAULT NULL,
  `class_last_attended` VARCHAR(80) DEFAULT NULL,
  `progress_status` VARCHAR(80) DEFAULT NULL,
  `conduct` VARCHAR(80) DEFAULT NULL,
  `reason_for_leaving` VARCHAR(180) DEFAULT NULL,
  `tc_remarks` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `admission_status` VARCHAR(30) NOT NULL DEFAULT 'active',
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

CREATE TABLE IF NOT EXISTS `quality_metrics` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED DEFAULT NULL,
  `criterion_code` VARCHAR(30) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `owner` VARCHAR(120) DEFAULT NULL,
  `target_value` INT NOT NULL DEFAULT 0,
  `achieved_value` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(30) NOT NULL DEFAULT 'ongoing',
  `evidence_status` VARCHAR(30) NOT NULL DEFAULT 'in-progress',
  `next_review_date` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `website_pages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `nav_label` VARCHAR(80) DEFAULT NULL,
  `menu_group` VARCHAR(80) DEFAULT NULL,
  `parent_page_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(180) NOT NULL,
  `hero_title` VARCHAR(200) DEFAULT NULL,
  `hero_subtitle` TEXT DEFAULT NULL,
  `summary_text` TEXT DEFAULT NULL,
  `cover_image_url` VARCHAR(255) DEFAULT NULL,
  `body_html` LONGTEXT DEFAULT NULL,
  `seo_title` VARCHAR(180) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_home` TINYINT(1) NOT NULL DEFAULT 1,
  `show_in_nav` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_website_pages_institute_slug` (`institute_id`, `slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `master_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `master_type` VARCHAR(60) NOT NULL,
  `code` VARCHAR(80) DEFAULT NULL,
  `label` VARCHAR(160) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 1,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `meta_json` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_master_entries_scope` (`institute_id`, `master_type`, `label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `staff_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `employee_code` VARCHAR(40) NOT NULL,
  `full_name` VARCHAR(160) NOT NULL,
  `department` VARCHAR(120) DEFAULT NULL,
  `designation` VARCHAR(120) DEFAULT NULL,
  `mobile_number` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(160) DEFAULT NULL,
  `joining_date` DATE DEFAULT NULL,
  `employment_type` VARCHAR(40) NOT NULL DEFAULT 'full-time',
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_staff_profiles_employee_code` (`employee_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `staff_attendance` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `staff_id` INT UNSIGNED NOT NULL,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED DEFAULT NULL,
  `attendance_date` DATE NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'present',
  `check_in_time` VARCHAR(10) DEFAULT NULL,
  `check_out_time` VARCHAR(10) DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_staff_attendance_staff_date` (`staff_id`, `attendance_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exam_sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` INT UNSIGNED NOT NULL,
  `academic_year_id` INT UNSIGNED DEFAULT NULL,
  `exam_name` VARCHAR(120) NOT NULL,
  `class_name` VARCHAR(80) NOT NULL,
  `subject_name` VARCHAR(120) NOT NULL,
  `max_marks` DECIMAL(8,2) NOT NULL DEFAULT 100,
  `exam_date` DATE DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exam_marks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `obtained_marks` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `grade` VARCHAR(10) DEFAULT NULL,
  `result_status` VARCHAR(20) NOT NULL DEFAULT 'pass',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_marks_exam_student` (`exam_id`, `student_id`)
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

INSERT IGNORE INTO `institutes` (`id`, `organization_id`, `name`, `code`, `type`, `contact_email`, `contact_phone`, `receipt_prefix`, `header_title`, `header_subtitle`, `header_address`, `principal_name`, `footer_note`, `website_url`, `logo_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Junior College', 'JC', 'Higher Secondary', 'jc@example.edu', '9876543210', 'JC-R', 'Demo Education Trust - Junior College', 'Affiliated Higher Secondary Section', 'Main Road, Aurangabad, Maharashtra', 'Dr. Sunita Deshmukh', 'Quality education, discipline, and student support are our core values.', 'https://jc.demo-college.local', 'https://placehold.co/120x120/1d4ed8/ffffff?text=JC', 'active', NOW(), NOW()),
(2, 1, 'Degree College', 'DC', 'Undergraduate', 'degree@example.edu', '9876543211', 'DC-R', 'Demo Education Trust - Degree College', 'NAAC-ready Undergraduate Programs', 'Civil Lines, Aurangabad, Maharashtra', 'Prof. Rajesh Kulkarni', 'All receipts and certificates can be verified through QR validation.', 'https://degree.demo-college.local', 'https://placehold.co/120x120/0f766e/ffffff?text=DC', 'active', NOW(), NOW()),
(3, 1, 'B.Ed College', 'BED', 'Professional', 'bed@example.edu', '9876543212', 'BED-R', 'Demo Education Trust - B.Ed College', 'Professional Teacher Education Wing', 'Station Road, Aurangabad, Maharashtra', 'Dr. Nilofer Shaikh', 'Institute follows academic-year-based and IQAC-aligned operations.', 'https://bed.demo-college.local', 'https://placehold.co/120x120/7c3aed/ffffff?text=BED', 'active', NOW(), NOW());

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

INSERT IGNORE INTO `students` (`id`, `institute_id`, `academic_year_id`, `gr_number`, `first_name`, `last_name`, `guardian_name`, `gender`, `category`, `current_class`, `division`, `mobile_number`, `email`, `dob`, `address`, `status`, `admission_status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'JC2025001', 'Aarav', 'Patil', 'Mahesh Patil', 'Male', 'OBC', 'FYJC Science', 'A', '9000000001', 'aarav.patil@example.edu', '2008-01-12', 'Main Road, Aurangabad, Maharashtra', 'active', 'confirmed', NOW(), NOW()),
(2, 1, 1, 'JC2025002', 'Sakshi', 'Jadhav', 'Anita Jadhav', 'Female', 'SC', 'FYJC Commerce', 'B', '9000000002', 'sakshi.jadhav@example.edu', '2008-03-25', 'CIDCO, Aurangabad, Maharashtra', 'active', 'confirmed', NOW(), NOW()),
(3, 2, 2, 'DC2025001', 'Rohit', 'Kale', 'Sanjay Kale', 'Male', 'Open', 'B.Com I', 'B', '9000000003', 'rohit.kale@example.edu', '2006-08-17', 'Jalna Road, Aurangabad, Maharashtra', 'active', 'confirmed', NOW(), NOW()),
(4, 2, 2, 'DC2025002', 'Fatima', 'Shaikh', 'Yusuf Shaikh', 'Female', 'Minority', 'B.A I', 'A', '9000000004', 'fatima.shaikh@example.edu', '2006-10-09', 'Roshan Gate, Aurangabad, Maharashtra', 'active', 'confirmed', NOW(), NOW()),
(5, 3, 3, 'BED2025001', 'Neha', 'More', 'Shubhangi More', 'Female', 'EWS', 'B.Ed I', 'A', '9000000005', 'neha.more@example.edu', '2004-07-14', 'Paithan Road, Aurangabad, Maharashtra', 'active', 'confirmed', NOW(), NOW());

UPDATE `students` SET
  `mother_name` = 'Sunita Patil',
  `nationality` = 'Indian',
  `religion` = 'Hindu',
  `caste_subcaste` = 'Kunbi',
  `date_of_birth_words` = 'Twelfth January Two Thousand Eight',
  `place_of_birth` = 'Aurangabad',
  `birth_taluka` = 'Aurangabad',
  `birth_district` = 'Chhatrapati Sambhajinagar',
  `birth_state` = 'Maharashtra',
  `previous_school` = 'Zilla Parishad School, Aurangabad',
  `date_of_admission` = '2025-06-15',
  `class_last_attended` = 'FYJC Science',
  `progress_status` = 'Good',
  `conduct` = 'Good',
  `tc_remarks` = 'Record ready for bonafide and transfer certificate issue.'
WHERE `id` = 1;

UPDATE `students` SET
  `mother_name` = 'Anita Jadhav',
  `nationality` = 'Indian',
  `religion` = 'Hindu',
  `caste_subcaste` = 'Jadhav',
  `date_of_birth_words` = 'Twenty Fifth March Two Thousand Eight',
  `place_of_birth` = 'Aurangabad',
  `birth_taluka` = 'Aurangabad',
  `birth_district` = 'Chhatrapati Sambhajinagar',
  `birth_state` = 'Maharashtra',
  `previous_school` = 'Saraswati Vidyalaya, Aurangabad',
  `date_of_admission` = '2025-06-16',
  `date_of_leaving` = '2026-04-12',
  `class_last_attended` = 'FYJC Commerce',
  `progress_status` = 'Satisfactory',
  `conduct` = 'Good',
  `reason_for_leaving` = 'Parent relocation to Pune',
  `tc_remarks` = 'Transfer requested by parent for relocation.'
WHERE `id` = 2;

UPDATE `students` SET
  `mother_name` = 'Meena Kale',
  `nationality` = 'Indian',
  `religion` = 'Hindu',
  `caste_subcaste` = 'Maratha',
  `date_of_birth_words` = 'Seventeenth August Two Thousand Six',
  `place_of_birth` = 'Jalna',
  `birth_taluka` = 'Jalna',
  `birth_district` = 'Jalna',
  `birth_state` = 'Maharashtra',
  `previous_school` = 'Model Junior College, Jalna',
  `date_of_admission` = '2025-06-20',
  `class_last_attended` = 'B.Com I',
  `progress_status` = 'Good',
  `conduct` = 'Good'
WHERE `id` = 3;

UPDATE `students` SET
  `mother_name` = 'Rukhsana Shaikh',
  `nationality` = 'Indian',
  `religion` = 'Muslim',
  `caste_subcaste` = 'Shaikh',
  `date_of_birth_words` = 'Ninth October Two Thousand Six',
  `place_of_birth` = 'Aurangabad',
  `birth_taluka` = 'Aurangabad',
  `birth_district` = 'Chhatrapati Sambhajinagar',
  `birth_state` = 'Maharashtra',
  `previous_school` = 'City Girls Junior College',
  `date_of_admission` = '2025-06-18',
  `class_last_attended` = 'B.A I',
  `progress_status` = 'Very Good',
  `conduct` = 'Good'
WHERE `id` = 4;

UPDATE `students` SET
  `mother_name` = 'Shubhangi More',
  `nationality` = 'Indian',
  `religion` = 'Hindu',
  `caste_subcaste` = 'More',
  `date_of_birth_words` = 'Fourteenth July Two Thousand Four',
  `place_of_birth` = 'Paithan',
  `birth_taluka` = 'Paithan',
  `birth_district` = 'Chhatrapati Sambhajinagar',
  `birth_state` = 'Maharashtra',
  `previous_school` = 'Education College, Paithan',
  `date_of_admission` = '2025-06-21',
  `class_last_attended` = 'B.Ed I',
  `progress_status` = 'Good',
  `conduct` = 'Excellent'
WHERE `id` = 5;

INSERT IGNORE INTO `master_entries` (`id`, `institute_id`, `master_type`, `code`, `label`, `description`, `sort_order`, `status`, `meta_json`, `created_at`, `updated_at`) VALUES
(1, 1, 'caste_category', 'OPEN', 'Open', 'General category admissions', 1, 'active', NULL, NOW(), NOW()),
(2, 1, 'caste_category', 'OBC', 'OBC', 'Backward class category', 2, 'active', NULL, NOW(), NOW()),
(3, 1, 'caste_category', 'SC', 'SC', 'Scheduled caste category', 3, 'active', NULL, NOW(), NOW()),
(4, 1, 'caste_category', 'EWS', 'EWS', 'Economically weaker section', 4, 'active', NULL, NOW(), NOW()),
(5, 1, 'class', 'FYJC_SCI', 'FYJC Science', 'Science stream first year', 1, 'active', NULL, NOW(), NOW()),
(6, 1, 'class', 'FYJC_COM', 'FYJC Commerce', 'Commerce stream first year', 2, 'active', NULL, NOW(), NOW()),
(7, 1, 'class', 'FYJC_ARTS', 'FYJC Arts', 'Arts stream first year', 3, 'active', NULL, NOW(), NOW()),
(8, 1, 'division', 'A', 'A', 'Division A', 1, 'active', '{"parent_value":"FYJC Science","note":"Science batch division A"}', NOW(), NOW()),
(9, 1, 'division', 'B', 'B', 'Division B', 2, 'active', '{"parent_value":"FYJC Commerce","note":"Commerce batch division B"}', NOW(), NOW()),
(10, 1, 'fee_head', 'ADMISSION_FEE', 'Admission Fee', 'One-time admission collection', 1, 'active', NULL, NOW(), NOW()),
(11, 1, 'fee_head', 'TUITION_FEE', 'Tuition Fee', 'Regular tuition installment', 2, 'active', NULL, NOW(), NOW()),
(12, 1, 'form_type', 'ADMISSION_FORM', 'Admission Form', 'Primary student admission form', 1, 'active', NULL, NOW(), NOW()),
(13, 1, 'form_type', 'SCHOLARSHIP_FORM', 'Scholarship Form', 'MahaDBT / freeship form', 2, 'active', NULL, NOW(), NOW()),
(14, 1, 'enquiry_source', 'WALK_IN', 'Walk-in', 'Walk-in visitor enquiry', 1, 'active', NULL, NOW(), NOW()),
(15, 1, 'enquiry_source', 'WEBSITE', 'Website', 'Lead generated from website', 2, 'active', NULL, NOW(), NOW()),
(16, 1, 'enquiry_source', 'REFERENCE', 'Reference', 'Lead from existing student or parent reference', 3, 'active', NULL, NOW(), NOW()),
(17, 2, 'class', 'BCOM_I', 'B.Com I', 'First year B.Com class', 1, 'active', NULL, NOW(), NOW()),
(18, 2, 'class', 'BA_I', 'B.A I', 'First year B.A class', 2, 'active', NULL, NOW(), NOW()),
(19, 3, 'class', 'BED_I', 'B.Ed I', 'First year B.Ed class', 1, 'active', NULL, NOW(), NOW()),
(20, 1, 'division', 'C', 'C', 'Division C', 3, 'active', '{"parent_value":"FYJC Arts","note":"Arts batch division C"}', NOW(), NOW()),
(21, 2, 'division', 'A', 'A', 'Division A', 1, 'active', '{"parent_value":"B.A I","note":"Degree arts division A"}', NOW(), NOW()),
(22, 2, 'division', 'B', 'B', 'Division B', 2, 'active', '{"parent_value":"B.Com I","note":"Degree commerce division B"}', NOW(), NOW()),
(23, 3, 'division', 'A', 'A', 'Division A', 1, 'active', '{"parent_value":"B.Ed I","note":"B.Ed division A"}', NOW(), NOW());

INSERT IGNORE INTO `staff_profiles` (`id`, `institute_id`, `employee_code`, `full_name`, `department`, `designation`, `mobile_number`, `email`, `joining_date`, `employment_type`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'JC-STF-001', 'Priya Deshpande', 'Admissions', 'Admissions Officer', '9800000001', 'priya.deshpande@example.edu', '2024-06-15', 'full-time', 'active', NOW(), NOW()),
(2, 1, 'JC-STF-002', 'Vijay Kulkarni', 'Accounts', 'Accounts Assistant', '9800000002', 'vijay.kulkarni@example.edu', '2023-07-01', 'full-time', 'active', NOW(), NOW()),
(3, 1, 'JC-STF-003', 'Meera Patil', 'Science', 'Lecturer', '9800000003', 'meera.patil@example.edu', '2022-08-10', 'full-time', 'active', NOW(), NOW()),
(4, 2, 'DC-STF-001', 'Sameer Shaikh', 'Administration', 'Admin Executive', '9800000004', 'sameer.shaikh@example.edu', '2024-01-12', 'contract', 'active', NOW(), NOW());

INSERT IGNORE INTO `staff_attendance` (`id`, `staff_id`, `institute_id`, `academic_year_id`, `attendance_date`, `status`, `check_in_time`, `check_out_time`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, CURDATE(), 'present', '09:05', '17:15', 'Admissions desk counselling day.', NOW(), NOW()),
(2, 2, 1, 1, CURDATE(), 'on-duty', '09:00', '17:00', 'Fee collection counter duty.', NOW(), NOW()),
(3, 3, 1, 1, CURDATE(), 'leave', NULL, NULL, 'Approved casual leave.', NOW(), NOW());

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

INSERT IGNORE INTO `quality_metrics` (`id`, `institute_id`, `academic_year_id`, `criterion_code`, `title`, `owner`, `target_value`, `achieved_value`, `status`, `evidence_status`, `next_review_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'NAAC-1.4', 'Curriculum feedback cycle completion', 'IQAC Coordinator', 12, 9, 'ongoing', 'ready', '2026-04-20', 'Collect final student feedback summary and minutes.', NOW(), NOW()),
(2, 1, 1, 'NAAC-2.5', 'Student support evidence filing', 'Student Development Cell', 20, 16, 'ongoing', 'in-progress', '2026-04-18', 'Attach scholarship and mentoring evidence files.', NOW(), NOW()),
(3, 2, 2, 'NAAC-3.2', 'Research and extension documentation', 'Quality Cell', 10, 7, 'ongoing', 'in-progress', '2026-04-24', 'Update MoU and extension photographs.', NOW(), NOW());

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

INSERT IGNORE INTO `exam_sessions` (`id`, `institute_id`, `academic_year_id`, `exam_name`, `class_name`, `subject_name`, `max_marks`, `exam_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Unit Test 1', 'FYJC Science', 'Physics', 50, '2026-04-15', 'published', NOW(), NOW()),
(2, 1, 1, 'Mid Term', 'FYJC Commerce', 'Accountancy', 100, '2026-04-22', 'ongoing', NOW(), NOW()),
(3, 2, 2, 'Internal Assessment', 'B.Com I', 'Business Economics', 40, '2026-04-18', 'draft', NOW(), NOW());

INSERT IGNORE INTO `exam_marks` (`id`, `exam_id`, `student_id`, `obtained_marks`, `grade`, `result_status`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 42, 'A+', 'pass', 'Good performance in numerical problems.', NOW(), NOW()),
(2, 1, 2, 35, 'A', 'pass', 'Consistent and neat presentation.', NOW(), NOW()),
(3, 3, 3, 28, 'A', 'pass', 'Solid internal assessment score.', NOW(), NOW());

INSERT IGNORE INTO `website_pages` (`id`, `institute_id`, `slug`, `nav_label`, `menu_group`, `title`, `hero_title`, `hero_subtitle`, `summary_text`, `cover_image_url`, `body_html`, `seo_title`, `seo_description`, `is_published`, `show_on_home`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'home', 'Home', 'Home', 'Junior College Home', 'Admissions Open for 2025-26', 'Scholarship-friendly, institute-aware college management with modern student services.', 'Explore admissions, scholarship help, and student support in one dynamic website.', 'https://placehold.co/1200x500/1d4ed8/ffffff?text=Junior+College+Campus', '<section id="overview"><h2>About the College</h2><p>Junior College supports admissions, scholarships, certificates, student mentoring, and transparent academic communication.</p></section><section id="highlights"><h2>Key Highlights</h2><ul><li>Scholarship help desk</li><li>Verified fee receipts</li><li>IQAC-ready documentation</li></ul></section><section id="important-links"><h2>Important Links</h2><p>Prospectus, notices, academic calendar, and student support links can be highlighted here.</p></section>', 'Junior College Admissions, Scholarship and Student Support', 'Explore admissions, scholarships, receipts, and student support services for Junior College.', 1, 1, 1, NOW(), NOW()),
(2, 1, 'about', 'About Us', 'About', 'About Our Junior College', 'NAAC-ready teaching, guidance, and transparent student support processes.', 'Institution profile, vision, mission, and student-first educational approach.', 'https://placehold.co/1200x500/0f766e/ffffff?text=About+the+College', '<section id="institution-profile"><h2>Institution Profile</h2><p>The institute focuses on quality education, scholarship support, and digital academic administration for students and parents.</p></section><section id="vision-mission"><h2>Vision and Mission</h2><p>To provide equitable, student-focused, and quality-oriented higher secondary education.</p></section><section id="principal-message"><h2>Principal\'s Message</h2><p>We aim to build discipline, academic excellence, and employability through modern student services.</p></section>', 'About Junior College and Academic Services', 'Learn about the institute profile, academic support, and student development services.', 1, 1, 2, NOW(), NOW()),
(3, 2, 'home', 'Home', 'Home', 'Degree College Home', 'Career-focused undergraduate programs', 'Career-focused undergraduate programs with transparent student services.', 'B.A., B.Com., and BCA information for applicants, parents, and students.', 'https://placehold.co/1200x500/334155/ffffff?text=Degree+College', '<section id="programs"><h2>Programs</h2><p>B.A., B.Com., and BCA public information, student services, and admission guidance are managed in one place.</p></section>', 'Degree College Programs and Admission Support', 'Degree College public information page with programs, student services, and admission updates.', 1, 1, 1, NOW(), NOW()),
(4, 1, 'admissions', 'Admissions', 'Admissions', 'Admissions and Eligibility', 'Admission support for FYJC and scholarship-oriented applicants.', 'Admission process, documents, timelines, and office support details.', 'https://placehold.co/1200x500/7c3aed/ffffff?text=Admissions', '<section id="admission-process"><h2>Admission Process</h2><ol><li>Enquiry registration</li><li>Document verification</li><li>Merit and allotment</li><li>Fee confirmation</li></ol></section><section id="documents-required"><h2>Documents Required</h2><p>Keep school leaving certificate, marksheet, Aadhaar, caste certificate, and photographs ready.</p></section>', 'Admissions and Eligibility Details', 'Admission process, eligibility, document checklist, and counselling guidance for new students.', 1, 1, 3, NOW(), NOW()),
(5, 1, 'academics', 'Academics', 'Academics', 'Academic Programs and Student Support', 'Curriculum support, mentoring, and examination readiness.', 'Explore bridge courses, mentoring, examination support, and academic calendar updates.', 'https://placehold.co/1200x500/0f172a/ffffff?text=Academics', '<section id="courses"><h2>Courses and Streams</h2><ul><li>Arts</li><li>Commerce</li><li>Science</li></ul></section><section id="student-support"><h2>Academic Support</h2><ul><li>Bridge courses</li><li>Mentoring</li><li>Result analysis</li><li>Career guidance</li></ul></section>', 'Academic Programs and Student Support', 'Explore curriculum support, mentoring, and examination services for students.', 1, 1, 4, NOW(), NOW()),
(6, 1, 'departments', 'Departments', 'Departments', 'Departments and Faculty', 'Department profile, faculty strengths, and outcomes overview.', 'Grouped academic departments and faculty guidance pages.', 'https://placehold.co/1200x500/1e293b/ffffff?text=Departments', '<section id="arts-department"><h2>Arts Department</h2><p>Strong focus on language, social sciences, and academic progression.</p></section><section id="commerce-department"><h2>Commerce Department</h2><p>Accounts, economics, and career-oriented commerce support for students.</p></section>', 'Departments and Faculty Overview', 'Know the departments, faculty support, and academic outcomes of the institute.', 1, 1, 5, NOW(), NOW()),
(7, 1, 'facilities', 'Facilities', 'Facilities', 'Campus Facilities', 'Library, ICT support, counselling, and student service windows.', 'Campus resources including library, ICT, grievance support, and learning spaces.', 'https://placehold.co/1200x500/0891b2/ffffff?text=Campus+Facilities', '<section id="library"><h2>Library and Reading Room</h2><p>Quiet reading environment, reference support, and circulation desk.</p></section><section id="ict-labs"><h2>ICT and Digital Support</h2><p>ICT-enabled classrooms and digital assistance for students and staff.</p></section>', 'Campus Facilities and Student Services', 'College facilities including library, ICT resources, and student support services.', 1, 1, 6, NOW(), NOW()),
(8, 1, 'iqac', 'IQAC', 'Quality', 'IQAC and Quality Assurance', 'Quality initiatives, NAAC readiness, and documentation support.', 'Quality assurance initiatives, feedback, SSR preparation, and evidence management.', 'https://placehold.co/1200x500/166534/ffffff?text=IQAC', '<section id="iqac-overview"><h2>IQAC Initiatives</h2><p>Academic planning, feedback, documentation, and evidence management are coordinated through the quality cell.</p></section><section id="naac-support"><h2>NAAC Readiness</h2><p>The institute maintains records for SSR, feedback, best practices, and quality review cycles.</p></section>', 'IQAC and NAAC Quality Initiatives', 'Public overview of quality assurance, IQAC initiatives, and NAAC-aligned work.', 1, 1, 7, NOW(), NOW()),
(9, 1, 'library', 'Library', 'Facilities', 'Library and Learning Resources', 'Reading culture, reference books, and digital support resources.', 'Library timing, services, and resource availability for learners.', 'https://placehold.co/1200x500/b45309/ffffff?text=Library', '<section id="services"><h2>Library Services</h2><p>Issue-return support, reading room access, and exam-time reference help are available.</p></section>', 'Library and Learning Resources', 'Explore library services, reading support, and learning resources offered by the institute.', 1, 0, 8, NOW(), NOW()),
(10, 1, 'alumni-students', 'Students & Alumni', 'Students', 'Students, Alumni and Outreach', 'Student development, alumni connect, and social outreach highlights.', 'Student clubs, alumni engagement, and feedback-driven campus initiatives.', 'https://placehold.co/1200x500/c026d3/ffffff?text=Students+%26+Alumni', '<section id="student-support"><h2>Student Support</h2><p>Scholarship guidance, counselling, and grievance support are active throughout the year.</p></section><section id="alumni-network"><h2>Alumni Network</h2><p>Former students contribute through mentoring, career talks, and institutional support.</p></section>', 'Students, Alumni and Outreach', 'Student support services, alumni network, and development activities in the institute.', 1, 0, 9, NOW(), NOW()),
(11, 1, 'contact', 'Contact', 'Contact', 'Contact and Help Desk', 'Reach the admission desk, office, and student support team.', 'Contact details for office, admissions, certificates, and help desk support.', 'https://placehold.co/1200x500/475569/ffffff?text=Contact+Us', '<section id="office-contact"><h2>Office Contact</h2><p>Visitors may contact the office for admissions, certificates, fees, and scholarship support during working hours.</p></section><section id="visit-campus"><h2>Visit Campus</h2><p>The campus is open during office hours for admission enquiries and student support.</p></section>', 'Contact Office and Help Desk', 'Contact details for admission desk, office staff, and student help support.', 1, 1, 10, NOW(), NOW()),
(12, 1, 'notices', 'Notices', 'Notices', 'Notices and Announcements', 'Latest office circulars, admission notices, and examination alerts.', 'Keep track of current notices, exam updates, and student information from one panel.', 'https://placehold.co/1200x500/be123c/ffffff?text=Notices', '<section id="latest-notices"><h2>Latest Notices</h2><ul><li>FYJC admission help desk open from 10 AM to 4 PM.</li><li>Scholarship verification window active this week.</li><li>Exam form submission deadline has been extended.</li></ul></section><section id="exam-updates"><h2>Exam Updates</h2><p>Hall-ticket notices, internal exam schedules, and result alerts will be published here.</p></section>', 'College Notices and Announcements', 'Read the latest notices, examination alerts, and admission announcements issued by the institute.', 1, 1, 11, NOW(), NOW()),
(13, 1, 'downloads', 'Downloads', 'Downloads', 'Downloads and Forms', 'Prospectus, forms, fee circulars, and student documents in one place.', 'Easy access to downloadable resources published by the college office.', 'https://placehold.co/1200x500/7c2d12/ffffff?text=Downloads', '<section id="prospectus"><h2>Prospectus and Brochure</h2><p>Students can view and download the latest prospectus, fee guidelines, and academic calendar.</p></section><section id="forms"><h2>Important Forms</h2><ul><li>Admission enquiry form</li><li>Bonafide request form</li><li>Scholarship checklist</li></ul></section>', 'Downloads, Prospectus and Forms', 'Download prospectus, admission forms, office circulars, and student support documents.', 1, 1, 12, NOW(), NOW()),
(14, 1, 'gallery', 'Gallery', 'Gallery', 'Gallery and Campus Moments', 'Cultural, academic, and extension activity highlights.', 'Showcase campus life, events, workshops, and memorable student moments.', 'https://placehold.co/1200x500/db2777/ffffff?text=Gallery', '<section id="campus-gallery"><h2>Campus Gallery</h2><p>Upload event albums, annual gathering visuals, NSS activities, and classroom highlights through the CMS.</p></section><section id="events-highlights"><h2>Event Highlights</h2><p>Prize distribution, guest lectures, industrial visits, and celebration snapshots can be structured here.</p></section>', 'College Gallery and Campus Activities', 'Explore campus photographs, event highlights, and student activity moments from the college.', 1, 1, 13, NOW(), NOW()),
(15, 1, 'mou', 'MOU', 'Quality', 'MoU and Collaborations', 'Academic partnerships, community tie-ups, and collaborative initiatives.', 'Institutional collaborations that strengthen academics, outreach, and employability.', 'https://placehold.co/1200x500/0f766e/ffffff?text=MOU', '<section id="academic-partnerships"><h2>Academic Partnerships</h2><p>The college develops linkages with local institutions, industries, and resource persons for workshops and student exposure.</p></section><section id="community-linkages"><h2>Community Linkages</h2><p>Extension activities and MoU-based community projects are documented here for public reference.</p></section>', 'MoU and Academic Collaborations', 'Review institutional MoUs, academic collaborations, and outreach partnerships of the college.', 1, 0, 14, NOW(), NOW()),
(16, 1, 'ssr', 'SSR', 'Quality', 'SSR and NAAC Documents', 'Self-study reports, quality benchmarks, and public disclosure documents.', 'Present SSR summaries, criterion-wise highlights, and quality documentation in a transparent way.', 'https://placehold.co/1200x500/15803d/ffffff?text=SSR', '<section id="ssr-reports"><h2>SSR Reports</h2><p>Criterion-wise summaries, annual quality initiatives, and NAAC preparedness notes can be shared here.</p></section><section id="best-practices"><h2>Best Practices</h2><p>Institutional best practices, green initiatives, and student-centric innovations may be showcased here.</p></section>', 'SSR, NAAC and Quality Documents', 'Access SSR summaries, quality documents, and NAAC-related public information of the institute.', 1, 0, 15, NOW(), NOW()),
(17, 1, 'feedback', 'Feedback', 'Quality', 'Stakeholder Feedback', 'Student, parent, alumni, and faculty feedback mechanisms.', 'A dedicated space for feedback summaries and action-taken reports.', 'https://placehold.co/1200x500/2563eb/ffffff?text=Feedback', '<section id="student-feedback"><h2>Student Feedback</h2><p>Students, parents, alumni, and employers can share structured feedback for academic and service improvement.</p></section><section id="action-taken"><h2>Action Taken Report</h2><p>Key observations from feedback and the related improvements are published here for transparency.</p></section>', 'Stakeholder Feedback and Action Taken', 'View feedback practices, stakeholder participation, and action taken reports of the college.', 1, 0, 16, NOW(), NOW()),
(18, 1, 'rti', 'RTI', 'Governance', 'RTI and Citizen Charter', 'Right to Information details, office contacts, and public disclosures.', 'Transparent governance information and citizen charter details for visitors and stakeholders.', 'https://placehold.co/1200x500/334155/ffffff?text=RTI', '<section id="rti-information"><h2>RTI Information</h2><p>Public Information Officer details, office timings, and RTI submission process can be published here.</p></section><section id="public-disclosure"><h2>Public Disclosure</h2><p>Mandatory disclosures, committee details, and governance updates may be shared transparently on this page.</p></section>', 'RTI and Governance Information', 'Access RTI contacts, public disclosure details, and governance information of the college.', 1, 0, 17, NOW(), NOW());

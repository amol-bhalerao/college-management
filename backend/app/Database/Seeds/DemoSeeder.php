<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $db = $this->db;
        $now = date('Y-m-d H:i:s');
        $today = date('Y-m-d');

        $db->table('organizations')->ignore(true)->insert([
            'id' => 1,
            'name' => 'Demo Education Trust',
            'code' => 'DET',
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $db->table('institutes')->ignore(true)->insertBatch([
            [
                'id' => 1,
                'organization_id' => 1,
                'name' => 'Junior College',
                'code' => 'JC',
                'type' => 'Higher Secondary',
                'contact_email' => 'jc@example.edu',
                'contact_phone' => '9876543210',
                'receipt_prefix' => 'JC-R',
                'header_title' => 'Demo Education Trust - Junior College',
                'header_address' => 'Main Road, Aurangabad, Maharashtra',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'organization_id' => 1,
                'name' => 'Degree College',
                'code' => 'DC',
                'type' => 'Undergraduate',
                'contact_email' => 'degree@example.edu',
                'contact_phone' => '9876543211',
                'receipt_prefix' => 'DC-R',
                'header_title' => 'Demo Education Trust - Degree College',
                'header_address' => 'Civil Lines, Aurangabad, Maharashtra',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'organization_id' => 1,
                'name' => 'B.Ed College',
                'code' => 'BED',
                'type' => 'Professional',
                'contact_email' => 'bed@example.edu',
                'contact_phone' => '9876543212',
                'receipt_prefix' => 'BED-R',
                'header_title' => 'Demo Education Trust - B.Ed College',
                'header_address' => 'Station Road, Aurangabad, Maharashtra',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $db->table('institutes')->where('id', 1)->update([
            'header_subtitle' => 'Affiliated Higher Secondary Section',
            'principal_name' => 'Dr. Sunita Deshmukh',
            'footer_note' => 'Quality education, discipline, and student support are our core values.',
            'website_url' => 'https://jc.demo-college.local',
            'logo_url' => 'https://placehold.co/120x120/1d4ed8/ffffff?text=JC',
            'updated_at' => $now,
        ]);

        $db->table('institutes')->where('id', 2)->update([
            'header_subtitle' => 'NAAC-ready Undergraduate Programs',
            'principal_name' => 'Prof. Rajesh Kulkarni',
            'footer_note' => 'All receipts and certificates can be verified through QR validation.',
            'website_url' => 'https://degree.demo-college.local',
            'logo_url' => 'https://placehold.co/120x120/0f766e/ffffff?text=DC',
            'updated_at' => $now,
        ]);

        $db->table('institutes')->where('id', 3)->update([
            'header_subtitle' => 'Professional Teacher Education Wing',
            'principal_name' => 'Dr. Nilofer Shaikh',
            'footer_note' => 'Institute follows academic-year-based and IQAC-aligned operations.',
            'website_url' => 'https://bed.demo-college.local',
            'logo_url' => 'https://placehold.co/120x120/7c3aed/ffffff?text=BED',
            'updated_at' => $now,
        ]);

        $db->table('academic_years')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'label' => '2025-26', 'start_date' => '2025-06-01', 'end_date' => '2026-05-31', 'is_current' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 2, 'label' => '2025-26', 'start_date' => '2025-06-01', 'end_date' => '2026-05-31', 'is_current' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 3, 'label' => '2025-26', 'start_date' => '2025-06-01', 'end_date' => '2026-05-31', 'is_current' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('theme_profiles')->ignore(true)->insert([
            'id' => 1,
            'organization_id' => 1,
            'institute_id' => null,
            'name' => 'Default Theme',
            'theme_json' => json_encode([
                'primaryColor' => '#4f46e5',
                'secondaryColor' => '#0f172a',
                'accentColor' => '#14b8a6',
                'backgroundColor' => '#f4f7fb',
                'surfaceColor' => '#ffffff',
                'textColor' => '#0f172a',
                'headerStart' => '#1d4ed8',
                'headerEnd' => '#0f766e',
                'fontFamily' => 'Inter, sans-serif',
                'radius' => 18,
                'shadowStrength' => 18,
            ], JSON_THROW_ON_ERROR),
            'is_active' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $passwordHash = password_hash('Password@123', PASSWORD_DEFAULT);

        $db->table('users')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'username' => 'superadmin', 'full_name' => 'Super Admin', 'email' => 'superadmin@example.edu', 'role_code' => 'SUPER_ADMIN', 'password_hash' => $passwordHash, 'whatsapp_number' => '9876543200', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'username' => 'clerk01', 'full_name' => 'Clerk User', 'email' => 'clerk01@example.edu', 'role_code' => 'CLERK', 'password_hash' => $passwordHash, 'whatsapp_number' => '9876543201', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 1, 'username' => 'accounts01', 'full_name' => 'Account User', 'email' => 'accounts01@example.edu', 'role_code' => 'ACCOUNTANT', 'password_hash' => $passwordHash, 'whatsapp_number' => '9876543202', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'institute_id' => 2, 'username' => 'clerk02', 'full_name' => 'Degree Clerk', 'email' => 'clerk02@example.edu', 'role_code' => 'CLERK', 'password_hash' => $passwordHash, 'whatsapp_number' => '9876543203', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'institute_id' => 3, 'username' => 'accounts02', 'full_name' => 'B.Ed Accounts', 'email' => 'accounts02@example.edu', 'role_code' => 'ACCOUNTANT', 'password_hash' => $passwordHash, 'whatsapp_number' => '9876543204', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('students')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025001', 'first_name' => 'Aarav', 'last_name' => 'Patil', 'guardian_name' => 'Mahesh Patil', 'gender' => 'Male', 'category' => 'OBC', 'current_class' => 'FYJC', 'division' => 'A', 'mobile_number' => '9000000001', 'email' => 'aarav.patil@example.edu', 'dob' => '2008-01-12', 'address' => 'Main Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025002', 'first_name' => 'Sakshi', 'last_name' => 'Jadhav', 'guardian_name' => 'Anita Jadhav', 'gender' => 'Female', 'category' => 'SC', 'current_class' => 'FYJC', 'division' => 'A', 'mobile_number' => '9000000002', 'email' => 'sakshi.jadhav@example.edu', 'dob' => '2008-03-25', 'address' => 'CIDCO, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025001', 'first_name' => 'Rohit', 'last_name' => 'Kale', 'guardian_name' => 'Sanjay Kale', 'gender' => 'Male', 'category' => 'Open', 'current_class' => 'B.Com I', 'division' => 'B', 'mobile_number' => '9000000003', 'email' => 'rohit.kale@example.edu', 'dob' => '2006-08-17', 'address' => 'Jalna Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025002', 'first_name' => 'Fatima', 'last_name' => 'Shaikh', 'guardian_name' => 'Yusuf Shaikh', 'gender' => 'Female', 'category' => 'Minority', 'current_class' => 'B.A I', 'division' => 'A', 'mobile_number' => '9000000004', 'email' => 'fatima.shaikh@example.edu', 'dob' => '2006-10-09', 'address' => 'Roshan Gate, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'institute_id' => 3, 'academic_year_id' => 3, 'gr_number' => 'BED2025001', 'first_name' => 'Neha', 'last_name' => 'More', 'guardian_name' => 'Shubhangi More', 'gender' => 'Female', 'category' => 'EWS', 'current_class' => 'B.Ed I', 'division' => 'A', 'mobile_number' => '9000000005', 'email' => 'neha.more@example.edu', 'dob' => '2004-07-14', 'address' => 'Paithan Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
        ]);

        if ($db->tableExists('master_entries')) {
            $db->table('master_entries')->ignore(true)->insertBatch([
                ['id' => 1, 'institute_id' => 1, 'master_type' => 'caste_category', 'code' => 'OPEN', 'label' => 'Open', 'description' => 'General category admissions', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'master_type' => 'caste_category', 'code' => 'OBC', 'label' => 'OBC', 'description' => 'Backward class category', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 1, 'master_type' => 'caste_category', 'code' => 'SC', 'label' => 'SC', 'description' => 'Scheduled caste category', 'sort_order' => 3, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'institute_id' => 1, 'master_type' => 'caste_category', 'code' => 'EWS', 'label' => 'EWS', 'description' => 'Economically weaker section', 'sort_order' => 4, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'institute_id' => 1, 'master_type' => 'class', 'code' => 'FYJC_SCI', 'label' => 'FYJC Science', 'description' => 'Science stream first year', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 6, 'institute_id' => 1, 'master_type' => 'class', 'code' => 'FYJC_COM', 'label' => 'FYJC Commerce', 'description' => 'Commerce stream first year', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 7, 'institute_id' => 1, 'master_type' => 'class', 'code' => 'FYJC_ARTS', 'label' => 'FYJC Arts', 'description' => 'Arts stream first year', 'sort_order' => 3, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 8, 'institute_id' => 1, 'master_type' => 'division', 'code' => 'A', 'label' => 'A', 'description' => 'Division A', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 9, 'institute_id' => 1, 'master_type' => 'division', 'code' => 'B', 'label' => 'B', 'description' => 'Division B', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 10, 'institute_id' => 1, 'master_type' => 'fee_head', 'code' => 'ADMISSION_FEE', 'label' => 'Admission Fee', 'description' => 'One-time admission collection', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 11, 'institute_id' => 1, 'master_type' => 'fee_head', 'code' => 'TUITION_FEE', 'label' => 'Tuition Fee', 'description' => 'Regular tuition installment', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 12, 'institute_id' => 1, 'master_type' => 'form_type', 'code' => 'ADMISSION_FORM', 'label' => 'Admission Form', 'description' => 'Primary student admission form', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 13, 'institute_id' => 1, 'master_type' => 'form_type', 'code' => 'SCHOLARSHIP_FORM', 'label' => 'Scholarship Form', 'description' => 'MahaDBT / freeship form', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 14, 'institute_id' => 1, 'master_type' => 'enquiry_source', 'code' => 'WALK_IN', 'label' => 'Walk-in', 'description' => 'Walk-in visitor enquiry', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 15, 'institute_id' => 1, 'master_type' => 'enquiry_source', 'code' => 'WEBSITE', 'label' => 'Website', 'description' => 'Lead generated from website', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 16, 'institute_id' => 1, 'master_type' => 'enquiry_source', 'code' => 'REFERENCE', 'label' => 'Reference', 'description' => 'Lead from existing student or parent reference', 'sort_order' => 3, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 17, 'institute_id' => 2, 'master_type' => 'class', 'code' => 'BCOM_I', 'label' => 'B.Com I', 'description' => 'First year B.Com class', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 18, 'institute_id' => 2, 'master_type' => 'class', 'code' => 'BA_I', 'label' => 'B.A I', 'description' => 'First year B.A class', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 19, 'institute_id' => 3, 'master_type' => 'class', 'code' => 'BED_I', 'label' => 'B.Ed I', 'description' => 'First year B.Ed class', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        if ($db->tableExists('staff_profiles')) {
            $db->table('staff_profiles')->ignore(true)->insertBatch([
                ['id' => 1, 'institute_id' => 1, 'employee_code' => 'JC-STF-001', 'full_name' => 'Priya Deshpande', 'department' => 'Admissions', 'designation' => 'Admissions Officer', 'mobile_number' => '9800000001', 'email' => 'priya.deshpande@example.edu', 'joining_date' => '2024-06-15', 'employment_type' => 'full-time', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'employee_code' => 'JC-STF-002', 'full_name' => 'Vijay Kulkarni', 'department' => 'Accounts', 'designation' => 'Accounts Assistant', 'mobile_number' => '9800000002', 'email' => 'vijay.kulkarni@example.edu', 'joining_date' => '2023-07-01', 'employment_type' => 'full-time', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 1, 'employee_code' => 'JC-STF-003', 'full_name' => 'Meera Patil', 'department' => 'Science', 'designation' => 'Lecturer', 'mobile_number' => '9800000003', 'email' => 'meera.patil@example.edu', 'joining_date' => '2022-08-10', 'employment_type' => 'full-time', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'institute_id' => 2, 'employee_code' => 'DC-STF-001', 'full_name' => 'Sameer Shaikh', 'department' => 'Administration', 'designation' => 'Admin Executive', 'mobile_number' => '9800000004', 'email' => 'sameer.shaikh@example.edu', 'joining_date' => '2024-01-12', 'employment_type' => 'contract', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        if ($db->tableExists('staff_attendance')) {
            $db->table('staff_attendance')->ignore(true)->insertBatch([
                ['id' => 1, 'staff_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'attendance_date' => $today, 'status' => 'present', 'check_in_time' => '09:05', 'check_out_time' => '17:15', 'remarks' => 'Admissions desk counselling day.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'staff_id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'attendance_date' => $today, 'status' => 'on-duty', 'check_in_time' => '09:00', 'check_out_time' => '17:00', 'remarks' => 'Fee collection counter duty.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'staff_id' => 3, 'institute_id' => 1, 'academic_year_id' => 1, 'attendance_date' => $today, 'status' => 'leave', 'check_in_time' => null, 'check_out_time' => null, 'remarks' => 'Approved casual leave.', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        $db->table('scholarship_applications')->ignore(true)->insertBatch([
            ['id' => 1, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'scheme_name' => 'Post Matric Scholarship to OBC Students', 'status' => 'submitted', 'is_eligible' => 1, 'expected_amount' => 8000, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'student_id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'scheme_name' => 'Government of India Post-Matric Scholarship', 'status' => 'verified', 'is_eligible' => 1, 'expected_amount' => 12000, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'student_id' => 4, 'institute_id' => 2, 'academic_year_id' => 2, 'scheme_name' => 'Minority Scholarship', 'status' => 'pending', 'is_eligible' => 1, 'expected_amount' => 9000, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'student_id' => 5, 'institute_id' => 3, 'academic_year_id' => 3, 'scheme_name' => 'EWS Tuition Support', 'status' => 'approved', 'is_eligible' => 1, 'expected_amount' => 7000, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('student_ledger_entries')->ignore(true)->insertBatch([
            ['id' => 1, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'entry_date' => '2026-04-01', 'reference' => 'Opening balance', 'mode' => 'System', 'debit' => 54000, 'credit' => 0, 'balance' => 54000, 'note' => 'Fee structure mapped', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'entry_date' => '2026-04-05', 'reference' => 'Admission fee receipt', 'mode' => 'Cash', 'debit' => 0, 'credit' => 12000, 'balance' => 42000, 'note' => 'Receipt JC-R-0001', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'entry_date' => '2026-04-10', 'reference' => 'Scholarship expected', 'mode' => 'MahaDBT', 'debit' => 0, 'credit' => 8000, 'balance' => 34000, 'note' => 'Expected reimbursement', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'entry_date' => '2026-04-17', 'reference' => 'Tuition fee receipt', 'mode' => 'UPI', 'debit' => 0, 'credit' => 15500, 'balance' => 18500, 'note' => 'Receipt JC-R-0002', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('fee_receipts')->ignore(true)->insertBatch([
            ['id' => 1, 'student_id' => 1, 'ledger_entry_id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'receipt_number' => 'JC-R-0001', 'receipt_date' => '2026-04-05', 'amount' => 12000, 'payment_mode' => 'Cash', 'received_by' => 'Account Office', 'remarks' => 'Admission fee collected at counter.', 'verification_token' => 'RCPT-JC-2026-0001', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'student_id' => 1, 'ledger_entry_id' => 4, 'institute_id' => 1, 'academic_year_id' => 1, 'receipt_number' => 'JC-R-0002', 'receipt_date' => '2026-04-17', 'amount' => 15500, 'payment_mode' => 'UPI', 'received_by' => 'Account Office', 'remarks' => 'Second installment received through UPI.', 'verification_token' => 'RCPT-JC-2026-0002', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('dashboard_targets')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'module' => 'Scholarship follow-up', 'target' => 120, 'achieved' => 92, 'pending' => 28, 'owner' => 'Clerk Desk', 'trend' => 'Up', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'module' => 'Admission conversion', 'target' => 220, 'achieved' => 163, 'pending' => 57, 'owner' => 'Admissions Team', 'trend' => 'Up', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 1, 'module' => 'Fee collection drive', 'target' => 500, 'achieved' => 428, 'pending' => 72, 'owner' => 'Account Office', 'trend' => 'Stable', 'created_at' => $now, 'updated_at' => $now],
        ]);

        if ($db->tableExists('quality_metrics')) {
            $db->table('quality_metrics')->ignore(true)->insertBatch([
                ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'criterion_code' => 'NAAC-1.4', 'title' => 'Curriculum feedback cycle completion', 'owner' => 'IQAC Coordinator', 'target_value' => 12, 'achieved_value' => 9, 'status' => 'ongoing', 'evidence_status' => 'ready', 'next_review_date' => '2026-04-20', 'notes' => 'Collect final student feedback summary and minutes.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'criterion_code' => 'NAAC-2.5', 'title' => 'Student support evidence filing', 'owner' => 'Student Development Cell', 'target_value' => 20, 'achieved_value' => 16, 'status' => 'ongoing', 'evidence_status' => 'in-progress', 'next_review_date' => '2026-04-18', 'notes' => 'Attach scholarship and mentoring evidence files.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'criterion_code' => 'NAAC-3.2', 'title' => 'Research and extension documentation', 'owner' => 'Quality Cell', 'target_value' => 10, 'achieved_value' => 7, 'status' => 'ongoing', 'evidence_status' => 'in-progress', 'next_review_date' => '2026-04-24', 'notes' => 'Update MoU and extension photographs.', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        $db->table('enquiries')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'enquiry_number' => 'ENQ-JC-0001', 'student_name' => 'Pratiksha More', 'mobile_number' => '9011111111', 'email' => 'pratiksha@example.com', 'source' => 'Website', 'desired_course' => 'FYJC Science', 'current_class' => '10th', 'category' => 'OBC', 'status' => 'new', 'assigned_to' => 'Clerk Desk', 'follow_up_date' => '2026-04-09', 'notes' => 'Interested in science stream and scholarship guidance.', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'enquiry_number' => 'ENQ-JC-0002', 'student_name' => 'Tanish Jadhav', 'mobile_number' => '9022222222', 'email' => 'tanish@example.com', 'source' => 'Reference', 'desired_course' => 'FYJC Commerce', 'current_class' => '10th', 'category' => 'SC', 'status' => 'follow-up', 'assigned_to' => 'Admissions Team', 'follow_up_date' => '2026-04-10', 'notes' => 'Waiting for document submission and caste certificate copy.', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 1, 'academic_year_id' => 1, 'enquiry_number' => 'ENQ-JC-0003', 'student_name' => 'Aditi Kulkarni', 'mobile_number' => '9033333333', 'email' => 'aditi@example.com', 'source' => 'Walk-in', 'desired_course' => 'FYJC Arts', 'current_class' => '10th', 'category' => 'Open', 'status' => 'converted', 'assigned_to' => 'Clerk Desk', 'follow_up_date' => '2026-04-08', 'notes' => 'Converted after counselling visit.', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'institute_id' => 2, 'academic_year_id' => 2, 'enquiry_number' => 'ENQ-DC-0001', 'student_name' => 'Farhan Shaikh', 'mobile_number' => '9044444444', 'email' => 'farhan@example.com', 'source' => 'Website', 'desired_course' => 'B.Com I', 'current_class' => '12th', 'category' => 'Minority', 'status' => 'new', 'assigned_to' => 'Degree Admission Cell', 'follow_up_date' => '2026-04-11', 'notes' => 'Asks about minority scholarship and fee concession.', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'institute_id' => 3, 'academic_year_id' => 3, 'enquiry_number' => 'ENQ-BED-0001', 'student_name' => 'Sneha Pawar', 'mobile_number' => '9055555555', 'email' => 'sneha@example.com', 'source' => 'Campaign', 'desired_course' => 'B.Ed I', 'current_class' => 'Graduation', 'category' => 'EWS', 'status' => 'contacted', 'assigned_to' => 'Professional Wing Desk', 'follow_up_date' => '2026-04-12', 'notes' => 'Interested in hostel and scholarship support.', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('admissions')->ignore(true)->insert([
            'id' => 1,
            'enquiry_id' => 3,
            'student_id' => null,
            'institute_id' => 1,
            'academic_year_id' => 1,
            'admission_number' => 'ADM-2026-0003',
            'status' => 'confirmed',
            'admitted_on' => '2026-04-08',
            'remarks' => 'Converted from enquiry after counselling and document verification.',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $db->table('certificate_requests')->ignore(true)->insertBatch([
            ['id' => 1, 'student_id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'request_number' => 'CERT-JC-0001', 'certificate_type' => 'bonafide', 'purpose' => 'Bank account opening for scholarship process.', 'status' => 'issued', 'verification_token' => 'CERT-JC-2026-0001', 'issued_on' => '2026-04-07', 'requested_by' => 'Clerk Desk', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'student_id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'request_number' => 'CERT-JC-0002', 'certificate_type' => 'transfer_certificate', 'purpose' => 'Migration to another college after relocation.', 'status' => 'requested', 'verification_token' => null, 'issued_on' => null, 'requested_by' => 'Admissions Team', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'student_id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'request_number' => 'CERT-DC-0001', 'certificate_type' => 'no_dues', 'purpose' => 'Internship and library clearance requirement.', 'status' => 'verified', 'verification_token' => 'CERT-DC-2026-0001', 'issued_on' => '2026-04-06', 'requested_by' => 'Account Office', 'created_at' => $now, 'updated_at' => $now],
        ]);

        if ($db->tableExists('exam_sessions')) {
            $db->table('exam_sessions')->ignore(true)->insertBatch([
                ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'exam_name' => 'Unit Test 1', 'class_name' => 'FYJC Science', 'subject_name' => 'Physics', 'max_marks' => 50, 'exam_date' => '2026-04-15', 'status' => 'published', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'exam_name' => 'Mid Term', 'class_name' => 'FYJC Commerce', 'subject_name' => 'Accountancy', 'max_marks' => 100, 'exam_date' => '2026-04-22', 'status' => 'ongoing', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'exam_name' => 'Internal Assessment', 'class_name' => 'B.Com I', 'subject_name' => 'Business Economics', 'max_marks' => 40, 'exam_date' => '2026-04-18', 'status' => 'draft', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        if ($db->tableExists('exam_marks')) {
            $db->table('exam_marks')->ignore(true)->insertBatch([
                ['id' => 1, 'exam_id' => 1, 'student_id' => 1, 'obtained_marks' => 42, 'grade' => 'A+', 'result_status' => 'pass', 'remarks' => 'Good performance in numerical problems.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'exam_id' => 1, 'student_id' => 2, 'obtained_marks' => 35, 'grade' => 'A', 'result_status' => 'pass', 'remarks' => 'Consistent and neat presentation.', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'exam_id' => 3, 'student_id' => 3, 'obtained_marks' => 28, 'grade' => 'A', 'result_status' => 'pass', 'remarks' => 'Solid internal assessment score.', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        if ($db->tableExists('website_pages')) {
            $db->table('website_pages')->ignore(true)->insertBatch([
                ['id' => 1, 'institute_id' => 1, 'slug' => 'home', 'nav_label' => 'Home', 'title' => 'Junior College Home', 'hero_title' => 'Admissions Open for 2025-26', 'hero_subtitle' => 'Scholarship-friendly, institute-aware college management with modern student services.', 'body_html' => '<section><h2>Why choose us</h2><p>Junior College supports admissions, scholarships, fee receipts, certificates, and student mentoring in one streamlined workflow.</p></section><section><h2>Highlights</h2><ul><li>Scholarship help desk</li><li>Verified fee receipts</li><li>IQAC-ready documentation</li></ul></section>', 'seo_title' => 'Junior College Admissions, Scholarship and Student Support', 'seo_description' => 'Explore admissions, scholarships, receipts, and student support services for Junior College.', 'is_published' => 1, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'slug' => 'about', 'nav_label' => 'About', 'title' => 'About Our Junior College', 'hero_title' => 'About Our Junior College', 'hero_subtitle' => 'NAAC-ready teaching, guidance, and transparent student support processes.', 'body_html' => '<section><h2>Institution Profile</h2><p>The institute focuses on quality education, scholarship support, and digital academic administration for students and parents.</p></section>', 'seo_title' => 'About Junior College and Academic Services', 'seo_description' => 'Learn about the institute profile, academic support, and student development services.', 'is_published' => 1, 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 2, 'slug' => 'home', 'nav_label' => 'Home', 'title' => 'Degree College Home', 'hero_title' => 'Career-focused undergraduate programs', 'hero_subtitle' => 'Career-focused undergraduate programs with transparent student services.', 'body_html' => '<section><h2>Programs</h2><p>B.A., B.Com., and student service workflows are managed with institute-wise dashboards and public information pages.</p></section>', 'seo_title' => 'Degree College Programs and Admission Support', 'seo_description' => 'Degree College public information page with programs, student services, and admission updates.', 'is_published' => 1, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }
    }
}

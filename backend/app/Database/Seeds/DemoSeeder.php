<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $db = $this->db;
        $now = date('Y-m-d H:i:s');

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
            'updated_at' => $now,
        ]);

        $db->table('institutes')->where('id', 2)->update([
            'header_subtitle' => 'NAAC-ready Undergraduate Programs',
            'principal_name' => 'Prof. Rajesh Kulkarni',
            'footer_note' => 'All receipts and certificates can be verified through QR validation.',
            'website_url' => 'https://degree.demo-college.local',
            'updated_at' => $now,
        ]);

        $db->table('institutes')->where('id', 3)->update([
            'header_subtitle' => 'Professional Teacher Education Wing',
            'principal_name' => 'Dr. Nilofer Shaikh',
            'footer_note' => 'Institute follows academic-year-based and IQAC-aligned operations.',
            'website_url' => 'https://bed.demo-college.local',
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
        ]);

        $db->table('students')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025001', 'first_name' => 'Aarav', 'last_name' => 'Patil', 'gender' => 'Male', 'category' => 'OBC', 'current_class' => 'FYJC', 'division' => 'A', 'mobile_number' => '9000000001', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025002', 'first_name' => 'Sakshi', 'last_name' => 'Jadhav', 'gender' => 'Female', 'category' => 'SC', 'current_class' => 'FYJC', 'division' => 'A', 'mobile_number' => '9000000002', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025001', 'first_name' => 'Rohit', 'last_name' => 'Kale', 'gender' => 'Male', 'category' => 'Open', 'current_class' => 'B.Com I', 'division' => 'B', 'mobile_number' => '9000000003', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025002', 'first_name' => 'Fatima', 'last_name' => 'Shaikh', 'gender' => 'Female', 'category' => 'Minority', 'current_class' => 'B.A I', 'division' => 'A', 'mobile_number' => '9000000004', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'institute_id' => 3, 'academic_year_id' => 3, 'gr_number' => 'BED2025001', 'first_name' => 'Neha', 'last_name' => 'More', 'gender' => 'Female', 'category' => 'EWS', 'current_class' => 'B.Ed I', 'division' => 'A', 'mobile_number' => '9000000005', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now],
        ]);

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

        $db->table('dashboard_targets')->ignore(true)->insertBatch([
            ['id' => 1, 'institute_id' => 1, 'module' => 'Scholarship follow-up', 'target' => 120, 'achieved' => 92, 'pending' => 28, 'owner' => 'Clerk Desk', 'trend' => 'Up', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'module' => 'Admission conversion', 'target' => 220, 'achieved' => 163, 'pending' => 57, 'owner' => 'Admissions Team', 'trend' => 'Up', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 1, 'module' => 'Fee collection drive', 'target' => 500, 'achieved' => 428, 'pending' => 72, 'owner' => 'Account Office', 'trend' => 'Stable', 'created_at' => $now, 'updated_at' => $now],
        ]);

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
    }
}

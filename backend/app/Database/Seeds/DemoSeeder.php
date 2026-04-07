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
            ['id' => 1, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025001', 'first_name' => 'Aarav', 'last_name' => 'Patil', 'guardian_name' => 'Mahesh Patil', 'gender' => 'Male', 'category' => 'OBC', 'current_class' => 'FYJC Science', 'division' => 'A', 'mobile_number' => '9000000001', 'email' => 'aarav.patil@example.edu', 'dob' => '2008-01-12', 'address' => 'Main Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'institute_id' => 1, 'academic_year_id' => 1, 'gr_number' => 'JC2025002', 'first_name' => 'Sakshi', 'last_name' => 'Jadhav', 'guardian_name' => 'Anita Jadhav', 'gender' => 'Female', 'category' => 'SC', 'current_class' => 'FYJC Commerce', 'division' => 'B', 'mobile_number' => '9000000002', 'email' => 'sakshi.jadhav@example.edu', 'dob' => '2008-03-25', 'address' => 'CIDCO, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025001', 'first_name' => 'Rohit', 'last_name' => 'Kale', 'guardian_name' => 'Sanjay Kale', 'gender' => 'Male', 'category' => 'Open', 'current_class' => 'B.Com I', 'division' => 'B', 'mobile_number' => '9000000003', 'email' => 'rohit.kale@example.edu', 'dob' => '2006-08-17', 'address' => 'Jalna Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'institute_id' => 2, 'academic_year_id' => 2, 'gr_number' => 'DC2025002', 'first_name' => 'Fatima', 'last_name' => 'Shaikh', 'guardian_name' => 'Yusuf Shaikh', 'gender' => 'Female', 'category' => 'Minority', 'current_class' => 'B.A I', 'division' => 'A', 'mobile_number' => '9000000004', 'email' => 'fatima.shaikh@example.edu', 'dob' => '2006-10-09', 'address' => 'Roshan Gate, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'institute_id' => 3, 'academic_year_id' => 3, 'gr_number' => 'BED2025001', 'first_name' => 'Neha', 'last_name' => 'More', 'guardian_name' => 'Shubhangi More', 'gender' => 'Female', 'category' => 'EWS', 'current_class' => 'B.Ed I', 'division' => 'A', 'mobile_number' => '9000000005', 'email' => 'neha.more@example.edu', 'dob' => '2004-07-14', 'address' => 'Paithan Road, Aurangabad, Maharashtra', 'status' => 'active', 'admission_status' => 'confirmed', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $db->table('students')->where('id', 1)->update([
            'current_class' => 'FYJC Science',
            'division' => 'A',
            'mother_name' => 'Sunita Patil',
            'nationality' => 'Indian',
            'religion' => 'Hindu',
            'caste_subcaste' => 'Kunbi',
            'date_of_birth_words' => 'Twelfth January Two Thousand Eight',
            'place_of_birth' => 'Aurangabad',
            'birth_taluka' => 'Aurangabad',
            'birth_district' => 'Chhatrapati Sambhajinagar',
            'birth_state' => 'Maharashtra',
            'previous_school' => 'Zilla Parishad School, Aurangabad',
            'date_of_admission' => '2025-06-15',
            'class_last_attended' => 'FYJC Science',
            'progress_status' => 'Good',
            'conduct' => 'Good',
            'tc_remarks' => 'Record ready for bonafide and transfer certificate issue.',
            'updated_at' => $now,
        ]);

        $db->table('students')->where('id', 2)->update([
            'current_class' => 'FYJC Commerce',
            'division' => 'B',
            'mother_name' => 'Anita Jadhav',
            'nationality' => 'Indian',
            'religion' => 'Hindu',
            'caste_subcaste' => 'Jadhav',
            'date_of_birth_words' => 'Twenty Fifth March Two Thousand Eight',
            'place_of_birth' => 'Aurangabad',
            'birth_taluka' => 'Aurangabad',
            'birth_district' => 'Chhatrapati Sambhajinagar',
            'birth_state' => 'Maharashtra',
            'previous_school' => 'Saraswati Vidyalaya, Aurangabad',
            'date_of_admission' => '2025-06-16',
            'date_of_leaving' => '2026-04-12',
            'class_last_attended' => 'FYJC Commerce',
            'progress_status' => 'Satisfactory',
            'conduct' => 'Good',
            'reason_for_leaving' => 'Parent relocation to Pune',
            'tc_remarks' => 'Transfer requested by parent for relocation.',
            'updated_at' => $now,
        ]);

        $db->table('students')->where('id', 3)->update([
            'mother_name' => 'Meena Kale',
            'nationality' => 'Indian',
            'religion' => 'Hindu',
            'caste_subcaste' => 'Maratha',
            'date_of_birth_words' => 'Seventeenth August Two Thousand Six',
            'place_of_birth' => 'Jalna',
            'birth_taluka' => 'Jalna',
            'birth_district' => 'Jalna',
            'birth_state' => 'Maharashtra',
            'previous_school' => 'Model Junior College, Jalna',
            'date_of_admission' => '2025-06-20',
            'class_last_attended' => 'B.Com I',
            'progress_status' => 'Good',
            'conduct' => 'Good',
            'updated_at' => $now,
        ]);

        $db->table('students')->where('id', 4)->update([
            'mother_name' => 'Rukhsana Shaikh',
            'nationality' => 'Indian',
            'religion' => 'Muslim',
            'caste_subcaste' => 'Shaikh',
            'date_of_birth_words' => 'Ninth October Two Thousand Six',
            'place_of_birth' => 'Aurangabad',
            'birth_taluka' => 'Aurangabad',
            'birth_district' => 'Chhatrapati Sambhajinagar',
            'birth_state' => 'Maharashtra',
            'previous_school' => 'City Girls Junior College',
            'date_of_admission' => '2025-06-18',
            'class_last_attended' => 'B.A I',
            'progress_status' => 'Very Good',
            'conduct' => 'Good',
            'updated_at' => $now,
        ]);

        $db->table('students')->where('id', 5)->update([
            'mother_name' => 'Shubhangi More',
            'nationality' => 'Indian',
            'religion' => 'Hindu',
            'caste_subcaste' => 'More',
            'date_of_birth_words' => 'Fourteenth July Two Thousand Four',
            'place_of_birth' => 'Paithan',
            'birth_taluka' => 'Paithan',
            'birth_district' => 'Chhatrapati Sambhajinagar',
            'birth_state' => 'Maharashtra',
            'previous_school' => 'Education College, Paithan',
            'date_of_admission' => '2025-06-21',
            'class_last_attended' => 'B.Ed I',
            'progress_status' => 'Good',
            'conduct' => 'Excellent',
            'updated_at' => $now,
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
                ['id' => 8, 'institute_id' => 1, 'master_type' => 'division', 'code' => 'A', 'label' => 'A', 'description' => 'Division A', 'sort_order' => 1, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'FYJC Science', 'note' => 'Science batch division A'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 9, 'institute_id' => 1, 'master_type' => 'division', 'code' => 'B', 'label' => 'B', 'description' => 'Division B', 'sort_order' => 2, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'FYJC Commerce', 'note' => 'Commerce batch division B'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
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
                ['id' => 20, 'institute_id' => 1, 'master_type' => 'division', 'code' => 'C', 'label' => 'C', 'description' => 'Division C', 'sort_order' => 3, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'FYJC Arts', 'note' => 'Arts batch division C'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 21, 'institute_id' => 2, 'master_type' => 'division', 'code' => 'A', 'label' => 'A', 'description' => 'Division A', 'sort_order' => 1, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'B.A I', 'note' => 'Degree arts division A'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 22, 'institute_id' => 2, 'master_type' => 'division', 'code' => 'B', 'label' => 'B', 'description' => 'Division B', 'sort_order' => 2, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'B.Com I', 'note' => 'Degree commerce division B'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 23, 'institute_id' => 3, 'master_type' => 'division', 'code' => 'A', 'label' => 'A', 'description' => 'Division A', 'sort_order' => 1, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'B.Ed I', 'note' => 'B.Ed division A'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 24, 'institute_id' => 1, 'master_type' => 'religion', 'code' => 'HINDU', 'label' => 'Hindu', 'description' => 'Religion master option', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 25, 'institute_id' => 1, 'master_type' => 'religion', 'code' => 'MUSLIM', 'label' => 'Muslim', 'description' => 'Religion master option', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 26, 'institute_id' => 1, 'master_type' => 'religion', 'code' => 'BUDDHIST', 'label' => 'Buddhist', 'description' => 'Religion master option', 'sort_order' => 3, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 27, 'institute_id' => 1, 'master_type' => 'religion', 'code' => 'CHRISTIAN', 'label' => 'Christian', 'description' => 'Religion master option', 'sort_order' => 4, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 28, 'institute_id' => 2, 'master_type' => 'religion', 'code' => 'HINDU', 'label' => 'Hindu', 'description' => 'Religion master option', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 29, 'institute_id' => 2, 'master_type' => 'religion', 'code' => 'MUSLIM', 'label' => 'Muslim', 'description' => 'Religion master option', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 30, 'institute_id' => 3, 'master_type' => 'religion', 'code' => 'HINDU', 'label' => 'Hindu', 'description' => 'Religion master option', 'sort_order' => 1, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 31, 'institute_id' => 3, 'master_type' => 'religion', 'code' => 'MUSLIM', 'label' => 'Muslim', 'description' => 'Religion master option', 'sort_order' => 2, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 32, 'institute_id' => 2, 'master_type' => 'program', 'code' => 'BCA', 'label' => 'BCA', 'description' => 'Bachelor of Computer Applications', 'sort_order' => 3, 'status' => 'active', 'meta_json' => null, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 33, 'institute_id' => 2, 'master_type' => 'class', 'code' => 'FY_BCA', 'label' => 'FY BCA', 'description' => 'First year BCA class', 'sort_order' => 3, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'BCA', 'next_value' => 'SY BCA', 'year_order' => 1], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 34, 'institute_id' => 2, 'master_type' => 'class', 'code' => 'SY_BCA', 'label' => 'SY BCA', 'description' => 'Second year BCA class', 'sort_order' => 4, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'BCA', 'next_value' => 'TY BCA', 'year_order' => 2], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 35, 'institute_id' => 2, 'master_type' => 'class', 'code' => 'TY_BCA', 'label' => 'TY BCA', 'description' => 'Third year BCA class', 'sort_order' => 5, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'BCA', 'year_order' => 3], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
                ['id' => 36, 'institute_id' => 2, 'master_type' => 'division', 'code' => 'C', 'label' => 'C', 'description' => 'Division C', 'sort_order' => 3, 'status' => 'active', 'meta_json' => json_encode(['parent_value' => 'FY BCA', 'note' => 'BCA division C'], JSON_THROW_ON_ERROR), 'created_at' => $now, 'updated_at' => $now],
            ]);

            $db->table('master_entries')->where('id', 8)->update([
                'meta_json' => json_encode(['parent_value' => 'FYJC Science', 'note' => 'Science batch division A'], JSON_THROW_ON_ERROR),
                'updated_at' => $now,
            ]);
            $db->table('master_entries')->where('id', 9)->update([
                'meta_json' => json_encode(['parent_value' => 'FYJC Commerce', 'note' => 'Commerce batch division B'], JSON_THROW_ON_ERROR),
                'updated_at' => $now,
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
                ['id' => 1, 'institute_id' => 1, 'slug' => 'home', 'nav_label' => 'Home', 'menu_group' => 'Home', 'title' => 'Junior College Home', 'hero_title' => 'Admissions Open for 2025-26', 'hero_subtitle' => 'Scholarship-friendly, institute-aware college management with modern student services.', 'summary_text' => 'Explore admissions, scholarship help, and student support in one dynamic website.', 'cover_image_url' => 'https://placehold.co/1200x500/1d4ed8/ffffff?text=Junior+College+Campus', 'body_html' => '<section id="overview"><h2>About the College</h2><p>Junior College supports admissions, scholarships, certificates, student mentoring, and transparent academic communication.</p></section><section id="highlights"><h2>Key Highlights</h2><ul><li>Scholarship help desk</li><li>Verified fee receipts</li><li>IQAC-ready documentation</li></ul></section><section id="important-links"><h2>Important Links</h2><p>Prospectus, notices, academic calendar, and student support links can be highlighted here.</p></section>', 'seo_title' => 'Junior College Admissions, Scholarship and Student Support', 'seo_description' => 'Explore admissions, scholarships, receipts, and student support services for Junior College.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'institute_id' => 1, 'slug' => 'about', 'nav_label' => 'About Us', 'menu_group' => 'About', 'title' => 'About Our Junior College', 'hero_title' => 'About Our Junior College', 'hero_subtitle' => 'NAAC-ready teaching, guidance, and transparent student support processes.', 'summary_text' => 'Institution profile, vision, mission, and student-first educational approach.', 'cover_image_url' => 'https://placehold.co/1200x500/0f766e/ffffff?text=About+the+College', 'body_html' => '<section id="institution-profile"><h2>Institution Profile</h2><p>The institute focuses on quality education, scholarship support, and digital academic administration for students and parents.</p></section><section id="vision-mission"><h2>Vision and Mission</h2><p>To provide equitable, student-focused, and quality-oriented higher secondary education.</p></section><section id="principal-message"><h2>Principal\'s Message</h2><p>We aim to build discipline, academic excellence, and employability through modern student services.</p></section>', 'seo_title' => 'About Junior College and Academic Services', 'seo_description' => 'Learn about the institute profile, academic support, and student development services.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'institute_id' => 2, 'slug' => 'home', 'nav_label' => 'Home', 'menu_group' => 'Home', 'title' => 'Degree College Home', 'hero_title' => 'Career-focused undergraduate programs', 'hero_subtitle' => 'Career-focused undergraduate programs with transparent student services.', 'summary_text' => 'B.A., B.Com., and BCA information for applicants, parents, and students.', 'cover_image_url' => 'https://placehold.co/1200x500/334155/ffffff?text=Degree+College', 'body_html' => '<section id="programs"><h2>Programs</h2><p>B.A., B.Com., and BCA public information, student services, and admission guidance are managed in one place.</p></section>', 'seo_title' => 'Degree College Programs and Admission Support', 'seo_description' => 'Degree College public information page with programs, student services, and admission updates.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'institute_id' => 1, 'slug' => 'admissions', 'nav_label' => 'Admissions', 'menu_group' => 'Admissions', 'title' => 'Admissions and Eligibility', 'hero_title' => 'Admission support for FYJC and scholarship-oriented applicants.', 'hero_subtitle' => 'Admission support for FYJC and scholarship-oriented applicants.', 'summary_text' => 'Admission process, documents, timelines, and office support details.', 'cover_image_url' => 'https://placehold.co/1200x500/7c3aed/ffffff?text=Admissions', 'body_html' => '<section id="admission-process"><h2>Admission Process</h2><ol><li>Enquiry registration</li><li>Document verification</li><li>Merit and allotment</li><li>Fee confirmation</li></ol></section><section id="documents-required"><h2>Documents Required</h2><p>Keep school leaving certificate, marksheet, Aadhaar, caste certificate, and photographs ready.</p></section>', 'seo_title' => 'Admissions and Eligibility Details', 'seo_description' => 'Admission process, eligibility, document checklist, and counselling guidance for new students.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'institute_id' => 1, 'slug' => 'academics', 'nav_label' => 'Academics', 'menu_group' => 'Academics', 'title' => 'Academic Programs and Student Support', 'hero_title' => 'Curriculum support, mentoring, and examination readiness.', 'hero_subtitle' => 'Curriculum support, mentoring, and examination readiness.', 'summary_text' => 'Explore bridge courses, mentoring, examination support, and academic calendar updates.', 'cover_image_url' => 'https://placehold.co/1200x500/0f172a/ffffff?text=Academics', 'body_html' => '<section id="courses"><h2>Courses and Streams</h2><ul><li>Arts</li><li>Commerce</li><li>Science</li></ul></section><section id="student-support"><h2>Academic Support</h2><ul><li>Bridge courses</li><li>Mentoring</li><li>Result analysis</li><li>Career guidance</li></ul></section>', 'seo_title' => 'Academic Programs and Student Support', 'seo_description' => 'Explore curriculum support, mentoring, and examination services for students.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 6, 'institute_id' => 1, 'slug' => 'departments', 'nav_label' => 'Departments', 'menu_group' => 'Departments', 'title' => 'Departments and Faculty', 'hero_title' => 'Department profile, faculty strengths, and outcomes overview.', 'hero_subtitle' => 'Department profile, faculty strengths, and outcomes overview.', 'summary_text' => 'Grouped academic departments and faculty guidance pages.', 'cover_image_url' => 'https://placehold.co/1200x500/1e293b/ffffff?text=Departments', 'body_html' => '<section id="arts-department"><h2>Arts Department</h2><p>Strong focus on language, social sciences, and academic progression.</p></section><section id="commerce-department"><h2>Commerce Department</h2><p>Accounts, economics, and career-oriented commerce support for students.</p></section>', 'seo_title' => 'Departments and Faculty Overview', 'seo_description' => 'Know the departments, faculty support, and academic outcomes of the institute.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 5, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 7, 'institute_id' => 1, 'slug' => 'facilities', 'nav_label' => 'Facilities', 'menu_group' => 'Facilities', 'title' => 'Campus Facilities', 'hero_title' => 'Library, ICT support, counselling, and student service windows.', 'hero_subtitle' => 'Library, ICT support, counselling, and student service windows.', 'summary_text' => 'Campus resources including library, ICT, grievance support, and learning spaces.', 'cover_image_url' => 'https://placehold.co/1200x500/0891b2/ffffff?text=Campus+Facilities', 'body_html' => '<section id="library"><h2>Library and Reading Room</h2><p>Quiet reading environment, reference support, and circulation desk.</p></section><section id="ict-labs"><h2>ICT and Digital Support</h2><p>ICT-enabled classrooms and digital assistance for students and staff.</p></section>', 'seo_title' => 'Campus Facilities and Student Services', 'seo_description' => 'College facilities including library, ICT resources, and student support services.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 6, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 8, 'institute_id' => 1, 'slug' => 'iqac', 'nav_label' => 'IQAC', 'menu_group' => 'Quality', 'title' => 'IQAC and Quality Assurance', 'hero_title' => 'Quality initiatives, NAAC readiness, and documentation support.', 'hero_subtitle' => 'Quality initiatives, NAAC readiness, and documentation support.', 'summary_text' => 'Quality assurance initiatives, feedback, SSR preparation, and evidence management.', 'cover_image_url' => 'https://placehold.co/1200x500/166534/ffffff?text=IQAC', 'body_html' => '<section id="iqac-overview"><h2>IQAC Initiatives</h2><p>Academic planning, feedback, documentation, and evidence management are coordinated through the quality cell.</p></section><section id="naac-support"><h2>NAAC Readiness</h2><p>The institute maintains records for SSR, feedback, best practices, and quality review cycles.</p></section>', 'seo_title' => 'IQAC and NAAC Quality Initiatives', 'seo_description' => 'Public overview of quality assurance, IQAC initiatives, and NAAC-aligned work.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 7, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 9, 'institute_id' => 1, 'slug' => 'library', 'nav_label' => 'Library', 'menu_group' => 'Facilities', 'title' => 'Library and Learning Resources', 'hero_title' => 'Reading culture, reference books, and digital support resources.', 'hero_subtitle' => 'Reading culture, reference books, and digital support resources.', 'summary_text' => 'Library timing, services, and resource availability for learners.', 'cover_image_url' => 'https://placehold.co/1200x500/b45309/ffffff?text=Library', 'body_html' => '<section id="services"><h2>Library Services</h2><p>Issue-return support, reading room access, and exam-time reference help are available.</p></section>', 'seo_title' => 'Library and Learning Resources', 'seo_description' => 'Explore library services, reading support, and learning resources offered by the institute.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 8, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 10, 'institute_id' => 1, 'slug' => 'alumni-students', 'nav_label' => 'Students & Alumni', 'menu_group' => 'Students', 'title' => 'Students, Alumni and Outreach', 'hero_title' => 'Student development, alumni connect, and social outreach highlights.', 'hero_subtitle' => 'Student development, alumni connect, and social outreach highlights.', 'summary_text' => 'Student clubs, alumni engagement, and feedback-driven campus initiatives.', 'cover_image_url' => 'https://placehold.co/1200x500/c026d3/ffffff?text=Students+%26+Alumni', 'body_html' => '<section id="student-support"><h2>Student Support</h2><p>Scholarship guidance, counselling, and grievance support are active throughout the year.</p></section><section id="alumni-network"><h2>Alumni Network</h2><p>Former students contribute through mentoring, career talks, and institutional support.</p></section>', 'seo_title' => 'Students, Alumni and Outreach', 'seo_description' => 'Student support services, alumni network, and development activities in the institute.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 9, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 11, 'institute_id' => 1, 'slug' => 'contact', 'nav_label' => 'Contact', 'menu_group' => 'Contact', 'title' => 'Contact and Help Desk', 'hero_title' => 'Reach the admission desk, office, and student support team.', 'hero_subtitle' => 'Reach the admission desk, office, and student support team.', 'summary_text' => 'Contact details for office, admissions, certificates, and help desk support.', 'cover_image_url' => 'https://placehold.co/1200x500/475569/ffffff?text=Contact+Us', 'body_html' => '<section id="office-contact"><h2>Office Contact</h2><p>Visitors may contact the office for admissions, certificates, fees, and scholarship support during working hours.</p></section><section id="visit-campus"><h2>Visit Campus</h2><p>The campus is open during office hours for admission enquiries and student support.</p></section>', 'seo_title' => 'Contact Office and Help Desk', 'seo_description' => 'Contact details for admission desk, office staff, and student help support.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 10, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 12, 'institute_id' => 1, 'slug' => 'notices', 'nav_label' => 'Notices', 'menu_group' => 'Notices', 'title' => 'Notices and Announcements', 'hero_title' => 'Latest office circulars, admission notices, and examination alerts.', 'hero_subtitle' => 'Keep track of current notices, exam updates, and student information from one panel.', 'summary_text' => 'Latest circulars, admission reminders, exam schedules, and public notices from the institute.', 'cover_image_url' => 'https://placehold.co/1200x500/be123c/ffffff?text=Notices', 'body_html' => '<section id="latest-notices"><h2>Latest Notices</h2><ul><li>FYJC admission help desk open from 10 AM to 4 PM.</li><li>Scholarship verification window active this week.</li><li>Exam form submission deadline has been extended.</li></ul></section><section id="exam-updates"><h2>Exam Updates</h2><p>Hall-ticket notices, internal exam schedules, and result alerts will be published here.</p></section>', 'seo_title' => 'College Notices and Announcements', 'seo_description' => 'Read the latest notices, examination alerts, and admission announcements issued by the institute.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 11, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 13, 'institute_id' => 1, 'slug' => 'downloads', 'nav_label' => 'Downloads', 'menu_group' => 'Downloads', 'title' => 'Downloads and Forms', 'hero_title' => 'Prospectus, forms, fee circulars, and student documents in one place.', 'hero_subtitle' => 'Easy access to downloadable resources published by the college office.', 'summary_text' => 'Prospectus, admission forms, undertaking formats, and student support documents.', 'cover_image_url' => 'https://placehold.co/1200x500/7c2d12/ffffff?text=Downloads', 'body_html' => '<section id="prospectus"><h2>Prospectus and Brochure</h2><p>Students can view and download the latest prospectus, fee guidelines, and academic calendar.</p></section><section id="forms"><h2>Important Forms</h2><ul><li>Admission enquiry form</li><li>Bonafide request form</li><li>Scholarship checklist</li></ul></section>', 'seo_title' => 'Downloads, Prospectus and Forms', 'seo_description' => 'Download prospectus, admission forms, office circulars, and student support documents.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 12, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 14, 'institute_id' => 1, 'slug' => 'gallery', 'nav_label' => 'Gallery', 'menu_group' => 'Gallery', 'title' => 'Gallery and Campus Moments', 'hero_title' => 'Cultural, academic, and extension activity highlights.', 'hero_subtitle' => 'Showcase campus life, events, workshops, and memorable student moments.', 'summary_text' => 'A dynamic gallery page for events, cultural activities, outreach, and achievements.', 'cover_image_url' => 'https://placehold.co/1200x500/db2777/ffffff?text=Gallery', 'body_html' => '<section id="campus-gallery"><h2>Campus Gallery</h2><p>Upload event albums, annual gathering visuals, NSS activities, and classroom highlights through the CMS.</p></section><section id="events-highlights"><h2>Event Highlights</h2><p>Prize distribution, guest lectures, industrial visits, and celebration snapshots can be structured here.</p></section>', 'seo_title' => 'College Gallery and Campus Activities', 'seo_description' => 'Explore campus photographs, event highlights, and student activity moments from the college.', 'is_published' => 1, 'show_on_home' => 1, 'sort_order' => 13, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 15, 'institute_id' => 1, 'slug' => 'mou', 'nav_label' => 'MOU', 'menu_group' => 'Quality', 'title' => 'MoU and Collaborations', 'hero_title' => 'Academic partnerships, community tie-ups, and collaborative initiatives.', 'hero_subtitle' => 'Institutional collaborations that strengthen academics, outreach, and employability.', 'summary_text' => 'MoUs, academic linkages, and collaboration outcomes for students and faculty.', 'cover_image_url' => 'https://placehold.co/1200x500/0f766e/ffffff?text=MOU', 'body_html' => '<section id="academic-partnerships"><h2>Academic Partnerships</h2><p>The college develops linkages with local institutions, industries, and resource persons for workshops and student exposure.</p></section><section id="community-linkages"><h2>Community Linkages</h2><p>Extension activities and MoU-based community projects are documented here for public reference.</p></section>', 'seo_title' => 'MoU and Academic Collaborations', 'seo_description' => 'Review institutional MoUs, academic collaborations, and outreach partnerships of the college.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 14, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 16, 'institute_id' => 1, 'slug' => 'ssr', 'nav_label' => 'SSR', 'menu_group' => 'Quality', 'title' => 'SSR and NAAC Documents', 'hero_title' => 'Self-study reports, quality benchmarks, and public disclosure documents.', 'hero_subtitle' => 'Present SSR summaries, criterion-wise highlights, and quality documentation in a transparent way.', 'summary_text' => 'SSR summaries, best practices, and quality benchmark documents for public access.', 'cover_image_url' => 'https://placehold.co/1200x500/15803d/ffffff?text=SSR', 'body_html' => '<section id="ssr-reports"><h2>SSR Reports</h2><p>Criterion-wise summaries, annual quality initiatives, and NAAC preparedness notes can be shared here.</p></section><section id="best-practices"><h2>Best Practices</h2><p>Institutional best practices, green initiatives, and student-centric innovations may be showcased here.</p></section>', 'seo_title' => 'SSR, NAAC and Quality Documents', 'seo_description' => 'Access SSR summaries, quality documents, and NAAC-related public information of the institute.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 15, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 17, 'institute_id' => 1, 'slug' => 'feedback', 'nav_label' => 'Feedback', 'menu_group' => 'Quality', 'title' => 'Stakeholder Feedback', 'hero_title' => 'Student, parent, alumni, and faculty feedback mechanisms.', 'hero_subtitle' => 'A dedicated space for feedback summaries and action-taken reports.', 'summary_text' => 'Stakeholder feedback collection, observations, and action taken for continuous quality improvement.', 'cover_image_url' => 'https://placehold.co/1200x500/2563eb/ffffff?text=Feedback', 'body_html' => '<section id="student-feedback"><h2>Student Feedback</h2><p>Students, parents, alumni, and employers can share structured feedback for academic and service improvement.</p></section><section id="action-taken"><h2>Action Taken Report</h2><p>Key observations from feedback and the related improvements are published here for transparency.</p></section>', 'seo_title' => 'Stakeholder Feedback and Action Taken', 'seo_description' => 'View feedback practices, stakeholder participation, and action taken reports of the college.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 16, 'created_at' => $now, 'updated_at' => $now],
                ['id' => 18, 'institute_id' => 1, 'slug' => 'rti', 'nav_label' => 'RTI', 'menu_group' => 'Governance', 'title' => 'RTI and Citizen Charter', 'hero_title' => 'Right to Information details, office contacts, and public disclosures.', 'hero_subtitle' => 'Transparent governance information and citizen charter details for visitors and stakeholders.', 'summary_text' => 'RTI contact information, public disclosure details, and governance-related information.', 'cover_image_url' => 'https://placehold.co/1200x500/334155/ffffff?text=RTI', 'body_html' => '<section id="rti-information"><h2>RTI Information</h2><p>Public Information Officer details, office timings, and RTI submission process can be published here.</p></section><section id="public-disclosure"><h2>Public Disclosure</h2><p>Mandatory disclosures, committee details, and governance updates may be shared transparently on this page.</p></section>', 'seo_title' => 'RTI and Governance Information', 'seo_description' => 'Access RTI contacts, public disclosure details, and governance information of the college.', 'is_published' => 1, 'show_on_home' => 0, 'sort_order' => 17, 'created_at' => $now, 'updated_at' => $now],
            ]);

            foreach ([
                1 => ['nav_label' => 'Home', 'menu_group' => 'Home', 'show_on_home' => 1, 'sort_order' => 1],
                2 => ['nav_label' => 'About Us', 'menu_group' => 'About', 'show_on_home' => 1, 'sort_order' => 2],
                3 => ['nav_label' => 'Home', 'menu_group' => 'Home', 'show_on_home' => 1, 'sort_order' => 1],
                4 => ['nav_label' => 'Admissions', 'menu_group' => 'Admissions', 'show_on_home' => 1, 'sort_order' => 3],
                5 => ['nav_label' => 'Academics', 'menu_group' => 'Academics', 'show_on_home' => 1, 'sort_order' => 4],
                6 => ['nav_label' => 'Departments', 'menu_group' => 'Departments', 'show_on_home' => 1, 'sort_order' => 5],
                7 => ['nav_label' => 'Facilities', 'menu_group' => 'Facilities', 'show_on_home' => 1, 'sort_order' => 6],
                8 => ['nav_label' => 'IQAC', 'menu_group' => 'Quality', 'show_on_home' => 1, 'sort_order' => 7],
                9 => ['nav_label' => 'Library', 'menu_group' => 'Facilities', 'show_on_home' => 0, 'sort_order' => 8],
                10 => ['nav_label' => 'Students & Alumni', 'menu_group' => 'Students', 'show_on_home' => 0, 'sort_order' => 9],
                11 => ['nav_label' => 'Contact', 'menu_group' => 'Contact', 'show_on_home' => 1, 'sort_order' => 10],
                12 => ['nav_label' => 'Notices', 'menu_group' => 'Notices', 'show_on_home' => 1, 'sort_order' => 11],
                13 => ['nav_label' => 'Downloads', 'menu_group' => 'Downloads', 'show_on_home' => 1, 'sort_order' => 12],
                14 => ['nav_label' => 'Gallery', 'menu_group' => 'Gallery', 'show_on_home' => 1, 'sort_order' => 13],
                15 => ['nav_label' => 'MOU', 'menu_group' => 'Quality', 'show_on_home' => 0, 'sort_order' => 14],
                16 => ['nav_label' => 'SSR', 'menu_group' => 'Quality', 'show_on_home' => 0, 'sort_order' => 15],
                17 => ['nav_label' => 'Feedback', 'menu_group' => 'Quality', 'show_on_home' => 0, 'sort_order' => 16],
                18 => ['nav_label' => 'RTI', 'menu_group' => 'Governance', 'show_on_home' => 0, 'sort_order' => 17],
            ] as $id => $payload) {
                $payload['updated_at'] = $now;
                $db->table('website_pages')->where('id', $id)->update($payload);
            }

            foreach ([
                1 => ['summary_text' => 'Explore admissions, scholarship help, and student support in one dynamic website.', 'cover_image_url' => 'https://placehold.co/1200x500/1d4ed8/ffffff?text=Junior+College+Campus', 'body_html' => '<section id="overview"><h2>About the College</h2><p>Junior College supports admissions, scholarships, certificates, student mentoring, and transparent academic communication.</p></section><section id="highlights"><h2>Key Highlights</h2><ul><li>Scholarship help desk</li><li>Verified fee receipts</li><li>IQAC-ready documentation</li></ul></section><section id="important-links"><h2>Important Links</h2><p>Prospectus, notices, academic calendar, and student support links can be highlighted here.</p></section>'],
                2 => ['summary_text' => 'Institution profile, vision, mission, and student-first educational approach.', 'cover_image_url' => 'https://placehold.co/1200x500/0f766e/ffffff?text=About+the+College', 'body_html' => '<section id="institution-profile"><h2>Institution Profile</h2><p>The institute focuses on quality education, scholarship support, and digital academic administration for students and parents.</p></section><section id="vision-mission"><h2>Vision and Mission</h2><p>To provide equitable, student-focused, and quality-oriented higher secondary education.</p></section><section id="principal-message"><h2>Principal\'s Message</h2><p>We aim to build discipline, academic excellence, and employability through modern student services.</p></section>'],
                4 => ['summary_text' => 'Admission process, documents, timelines, and office support details.', 'cover_image_url' => 'https://placehold.co/1200x500/7c3aed/ffffff?text=Admissions', 'body_html' => '<section id="admission-process"><h2>Admission Process</h2><ol><li>Enquiry registration</li><li>Document verification</li><li>Merit and allotment</li><li>Fee confirmation</li></ol></section><section id="documents-required"><h2>Documents Required</h2><p>Keep school leaving certificate, marksheet, Aadhaar, caste certificate, and photographs ready.</p></section>'],
                5 => ['summary_text' => 'Explore bridge courses, mentoring, examination support, and academic calendar updates.', 'cover_image_url' => 'https://placehold.co/1200x500/0f172a/ffffff?text=Academics', 'body_html' => '<section id="courses"><h2>Courses and Streams</h2><ul><li>Arts</li><li>Commerce</li><li>Science</li></ul></section><section id="student-support"><h2>Academic Support</h2><ul><li>Bridge courses</li><li>Mentoring</li><li>Result analysis</li><li>Career guidance</li></ul></section>'],
                6 => ['summary_text' => 'Grouped academic departments and faculty guidance pages.', 'cover_image_url' => 'https://placehold.co/1200x500/1e293b/ffffff?text=Departments', 'body_html' => '<section id="arts-department"><h2>Arts Department</h2><p>Strong focus on language, social sciences, and academic progression.</p></section><section id="commerce-department"><h2>Commerce Department</h2><p>Accounts, economics, and career-oriented commerce support for students.</p></section>'],
                7 => ['summary_text' => 'Campus resources including library, ICT, grievance support, and learning spaces.', 'cover_image_url' => 'https://placehold.co/1200x500/0891b2/ffffff?text=Campus+Facilities', 'body_html' => '<section id="library"><h2>Library and Reading Room</h2><p>Quiet reading environment, reference support, and circulation desk.</p></section><section id="ict-labs"><h2>ICT and Digital Support</h2><p>ICT-enabled classrooms and digital assistance for students and staff.</p></section>'],
                8 => ['summary_text' => 'Quality assurance initiatives, feedback, SSR preparation, and evidence management.', 'cover_image_url' => 'https://placehold.co/1200x500/166534/ffffff?text=IQAC', 'body_html' => '<section id="iqac-overview"><h2>IQAC Initiatives</h2><p>Academic planning, feedback, documentation, and evidence management are coordinated through the quality cell.</p></section><section id="naac-support"><h2>NAAC Readiness</h2><p>The institute maintains records for SSR, feedback, best practices, and quality review cycles.</p></section>'],
                9 => ['summary_text' => 'Library timing, services, and resource availability for learners.', 'cover_image_url' => 'https://placehold.co/1200x500/b45309/ffffff?text=Library', 'body_html' => '<section id="services"><h2>Library Services</h2><p>Issue-return support, reading room access, and exam-time reference help are available.</p></section>'],
                10 => ['summary_text' => 'Student clubs, alumni engagement, and feedback-driven campus initiatives.', 'cover_image_url' => 'https://placehold.co/1200x500/c026d3/ffffff?text=Students+%26+Alumni', 'body_html' => '<section id="student-support"><h2>Student Support</h2><p>Scholarship guidance, counselling, and grievance support are active throughout the year.</p></section><section id="alumni-network"><h2>Alumni Network</h2><p>Former students contribute through mentoring, career talks, and institutional support.</p></section>'],
                11 => ['summary_text' => 'Contact details for office, admissions, certificates, and help desk support.', 'cover_image_url' => 'https://placehold.co/1200x500/475569/ffffff?text=Contact+Us', 'body_html' => '<section id="office-contact"><h2>Office Contact</h2><p>Visitors may contact the office for admissions, certificates, fees, and scholarship support during working hours.</p></section><section id="visit-campus"><h2>Visit Campus</h2><p>The campus is open during office hours for admission enquiries and student support.</p></section>'],
                12 => ['summary_text' => 'Latest circulars, admission reminders, exam schedules, and public notices from the institute.', 'cover_image_url' => 'https://placehold.co/1200x500/be123c/ffffff?text=Notices', 'body_html' => '<section id="latest-notices"><h2>Latest Notices</h2><ul><li>FYJC admission help desk open from 10 AM to 4 PM.</li><li>Scholarship verification window active this week.</li><li>Exam form submission deadline has been extended.</li></ul></section><section id="exam-updates"><h2>Exam Updates</h2><p>Hall-ticket notices, internal exam schedules, and result alerts will be published here.</p></section>'],
                13 => ['summary_text' => 'Prospectus, admission forms, undertaking formats, and student support documents.', 'cover_image_url' => 'https://placehold.co/1200x500/7c2d12/ffffff?text=Downloads', 'body_html' => '<section id="prospectus"><h2>Prospectus and Brochure</h2><p>Students can view and download the latest prospectus, fee guidelines, and academic calendar.</p></section><section id="forms"><h2>Important Forms</h2><ul><li>Admission enquiry form</li><li>Bonafide request form</li><li>Scholarship checklist</li></ul></section>'],
                14 => ['summary_text' => 'A dynamic gallery page for events, cultural activities, outreach, and achievements.', 'cover_image_url' => 'https://placehold.co/1200x500/db2777/ffffff?text=Gallery', 'body_html' => '<section id="campus-gallery"><h2>Campus Gallery</h2><p>Upload event albums, annual gathering visuals, NSS activities, and classroom highlights through the CMS.</p></section><section id="events-highlights"><h2>Event Highlights</h2><p>Prize distribution, guest lectures, industrial visits, and celebration snapshots can be structured here.</p></section>'],
                15 => ['summary_text' => 'MoUs, academic linkages, and collaboration outcomes for students and faculty.', 'cover_image_url' => 'https://placehold.co/1200x500/0f766e/ffffff?text=MOU', 'body_html' => '<section id="academic-partnerships"><h2>Academic Partnerships</h2><p>The college develops linkages with local institutions, industries, and resource persons for workshops and student exposure.</p></section><section id="community-linkages"><h2>Community Linkages</h2><p>Extension activities and MoU-based community projects are documented here for public reference.</p></section>'],
                16 => ['summary_text' => 'SSR summaries, best practices, and quality benchmark documents for public access.', 'cover_image_url' => 'https://placehold.co/1200x500/15803d/ffffff?text=SSR', 'body_html' => '<section id="ssr-reports"><h2>SSR Reports</h2><p>Criterion-wise summaries, annual quality initiatives, and NAAC preparedness notes can be shared here.</p></section><section id="best-practices"><h2>Best Practices</h2><p>Institutional best practices, green initiatives, and student-centric innovations may be showcased here.</p></section>'],
                17 => ['summary_text' => 'Stakeholder feedback collection, observations, and action taken for continuous quality improvement.', 'cover_image_url' => 'https://placehold.co/1200x500/2563eb/ffffff?text=Feedback', 'body_html' => '<section id="student-feedback"><h2>Student Feedback</h2><p>Students, parents, alumni, and employers can share structured feedback for academic and service improvement.</p></section><section id="action-taken"><h2>Action Taken Report</h2><p>Key observations from feedback and the related improvements are published here for transparency.</p></section>'],
                18 => ['summary_text' => 'RTI contact information, public disclosure details, and governance-related information.', 'cover_image_url' => 'https://placehold.co/1200x500/334155/ffffff?text=RTI', 'body_html' => '<section id="rti-information"><h2>RTI Information</h2><p>Public Information Officer details, office timings, and RTI submission process can be published here.</p></section><section id="public-disclosure"><h2>Public Disclosure</h2><p>Mandatory disclosures, committee details, and governance updates may be shared transparently on this page.</p></section>'],
            ] as $id => $payload) {
                $payload['updated_at'] = $now;
                $db->table('website_pages')->where('id', $id)->update($payload);
            }

            foreach ([
                6 => ['slug' => 'departments', 'title' => 'Departments and Faculty', 'hero_title' => 'Department profile, faculty strengths, and outcomes overview.', 'hero_subtitle' => 'Department profile, faculty strengths, and outcomes overview.', 'seo_title' => 'Departments and Faculty Overview', 'seo_description' => 'Know the departments, faculty support, and academic outcomes of the institute.'],
                7 => ['slug' => 'facilities', 'title' => 'Campus Facilities', 'hero_title' => 'Library, ICT support, counselling, and student service windows.', 'hero_subtitle' => 'Library, ICT support, counselling, and student service windows.', 'seo_title' => 'Campus Facilities and Student Services', 'seo_description' => 'College facilities including library, ICT resources, and student support services.'],
                8 => ['slug' => 'iqac', 'title' => 'IQAC and Quality Assurance', 'hero_title' => 'Quality initiatives, NAAC readiness, and documentation support.', 'hero_subtitle' => 'Quality initiatives, NAAC readiness, and documentation support.', 'seo_title' => 'IQAC and NAAC Quality Initiatives', 'seo_description' => 'Public overview of quality assurance, IQAC initiatives, and NAAC-aligned work.'],
                11 => ['slug' => 'contact', 'title' => 'Contact and Help Desk', 'hero_title' => 'Reach the admission desk, office, and student support team.', 'hero_subtitle' => 'Reach the admission desk, office, and student support team.', 'seo_title' => 'Contact Office and Help Desk', 'seo_description' => 'Contact details for admission desk, office staff, and student help support.'],
                12 => ['slug' => 'notices', 'title' => 'Notices and Announcements', 'hero_title' => 'Latest office circulars, admission notices, and examination alerts.', 'hero_subtitle' => 'Keep track of current notices, exam updates, and student information from one panel.', 'seo_title' => 'College Notices and Announcements', 'seo_description' => 'Read the latest notices, examination alerts, and admission announcements issued by the institute.'],
                13 => ['slug' => 'downloads', 'title' => 'Downloads and Forms', 'hero_title' => 'Prospectus, forms, fee circulars, and student documents in one place.', 'hero_subtitle' => 'Easy access to downloadable resources published by the college office.', 'seo_title' => 'Downloads, Prospectus and Forms', 'seo_description' => 'Download prospectus, admission forms, office circulars, and student support documents.'],
                14 => ['slug' => 'gallery', 'title' => 'Gallery and Campus Moments', 'hero_title' => 'Cultural, academic, and extension activity highlights.', 'hero_subtitle' => 'Showcase campus life, events, workshops, and memorable student moments.', 'seo_title' => 'College Gallery and Campus Activities', 'seo_description' => 'Explore campus photographs, event highlights, and student activity moments from the college.'],
                15 => ['slug' => 'mou', 'title' => 'MoU and Collaborations', 'hero_title' => 'Academic partnerships, community tie-ups, and collaborative initiatives.', 'hero_subtitle' => 'Institutional collaborations that strengthen academics, outreach, and employability.', 'seo_title' => 'MoU and Academic Collaborations', 'seo_description' => 'Review institutional MoUs, academic collaborations, and outreach partnerships of the college.'],
                16 => ['slug' => 'ssr', 'title' => 'SSR and NAAC Documents', 'hero_title' => 'Self-study reports, quality benchmarks, and public disclosure documents.', 'hero_subtitle' => 'Present SSR summaries, criterion-wise highlights, and quality documentation in a transparent way.', 'seo_title' => 'SSR, NAAC and Quality Documents', 'seo_description' => 'Access SSR summaries, quality documents, and NAAC-related public information of the institute.'],
                17 => ['slug' => 'feedback', 'title' => 'Stakeholder Feedback', 'hero_title' => 'Student, parent, alumni, and faculty feedback mechanisms.', 'hero_subtitle' => 'A dedicated space for feedback summaries and action-taken reports.', 'seo_title' => 'Stakeholder Feedback and Action Taken', 'seo_description' => 'View feedback practices, stakeholder participation, and action taken reports of the college.'],
                18 => ['slug' => 'rti', 'title' => 'RTI and Citizen Charter', 'hero_title' => 'Right to Information details, office contacts, and public disclosures.', 'hero_subtitle' => 'Transparent governance information and citizen charter details for visitors and stakeholders.', 'seo_title' => 'RTI and Governance Information', 'seo_description' => 'Access RTI contacts, public disclosure details, and governance information of the college.'],
            ] as $id => $payload) {
                $payload['updated_at'] = $now;
                $db->table('website_pages')->where('id', $id)->update($payload);
            }
        }
    }
}

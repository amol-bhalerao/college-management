<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddHrMasterAndExamTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('master_entries')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'master_type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 60,
                ],
                'code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                    'null' => true,
                ],
                'label' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'description' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'sort_order' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'default' => 1,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'meta_json' => [
                    'type' => 'LONGTEXT',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey(['institute_id', 'master_type', 'label']);
            $this->forge->createTable('master_entries');
        }

        if (! $this->db->tableExists('staff_profiles')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'employee_code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                ],
                'full_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'department' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                    'null' => true,
                ],
                'designation' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                    'null' => true,
                ],
                'mobile_number' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'null' => true,
                ],
                'email' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                    'null' => true,
                ],
                'joining_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'employment_type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                    'default' => 'full-time',
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('employee_code');
            $this->forge->createTable('staff_profiles');
        }

        if (! $this->db->tableExists('staff_attendance')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'staff_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'academic_year_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'null' => true,
                ],
                'attendance_date' => [
                    'type' => 'DATE',
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'present',
                ],
                'check_in_time' => [
                    'type' => 'VARCHAR',
                    'constraint' => 10,
                    'null' => true,
                ],
                'check_out_time' => [
                    'type' => 'VARCHAR',
                    'constraint' => 10,
                    'null' => true,
                ],
                'remarks' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey(['staff_id', 'attendance_date']);
            $this->forge->createTable('staff_attendance');
        }

        if (! $this->db->tableExists('exam_sessions')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'academic_year_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'null' => true,
                ],
                'exam_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                ],
                'class_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                ],
                'subject_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                ],
                'max_marks' => [
                    'type' => 'DECIMAL',
                    'constraint' => '8,2',
                    'default' => 100,
                ],
                'exam_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'draft',
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('exam_sessions');
        }

        if (! $this->db->tableExists('exam_marks')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'exam_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'student_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'obtained_marks' => [
                    'type' => 'DECIMAL',
                    'constraint' => '8,2',
                    'default' => 0,
                ],
                'grade' => [
                    'type' => 'VARCHAR',
                    'constraint' => 10,
                    'null' => true,
                ],
                'result_status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'pass',
                ],
                'remarks' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey(['exam_id', 'student_id']);
            $this->forge->createTable('exam_marks');
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('exam_marks', true);
        $this->forge->dropTable('exam_sessions', true);
        $this->forge->dropTable('staff_attendance', true);
        $this->forge->dropTable('staff_profiles', true);
        $this->forge->dropTable('master_entries', true);
    }
}

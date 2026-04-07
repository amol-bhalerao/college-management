<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFoundationTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('organizations')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('organizations', true);
        }

        if (! $this->db->tableExists('institutes')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'organization_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                ],
                'type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                    'null' => true,
                ],
                'contact_email' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                    'null' => true,
                ],
                'contact_phone' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'null' => true,
                ],
                'receipt_prefix' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'null' => true,
                ],
                'header_title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                ],
                'header_address' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('institutes', true);
        }

        if (! $this->db->tableExists('academic_years')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'label' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                ],
                'start_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'end_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'is_current' => [
                    'type' => 'BOOLEAN',
                    'default' => false,
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('academic_years', true);
        }

        if (! $this->db->tableExists('theme_profiles')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'organization_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'null' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                ],
                'theme_json' => [
                    'type' => 'LONGTEXT',
                ],
                'is_active' => [
                    'type' => 'BOOLEAN',
                    'default' => true,
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('theme_profiles', true);
        }

        if (! $this->db->tableExists('users')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'null' => true,
                ],
                'username' => [
                    'type' => 'VARCHAR',
                    'constraint' => 60,
                ],
                'full_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'email' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'role_code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                ],
                'password_hash' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                ],
                'whatsapp_number' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('username');
            $this->forge->addUniqueKey('email');
            $this->forge->createTable('users', true);
        }

        if (! $this->db->tableExists('students')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'gr_number' => ['type' => 'VARCHAR', 'constraint' => 40],
                'first_name' => ['type' => 'VARCHAR', 'constraint' => 80],
                'last_name' => ['type' => 'VARCHAR', 'constraint' => 80],
                'gender' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
                'category' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'current_class' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'division' => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => true],
                'mobile_number' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'active'],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('gr_number');
            $this->forge->createTable('students', true);
        }

        if (! $this->db->tableExists('scholarship_applications')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'student_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'scheme_name' => ['type' => 'VARCHAR', 'constraint' => 160],
                'status' => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'pending'],
                'is_eligible' => ['type' => 'BOOLEAN', 'default' => true],
                'expected_amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('scholarship_applications', true);
        }

        if (! $this->db->tableExists('student_ledger_entries')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'student_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'entry_date' => ['type' => 'DATE'],
                'reference' => ['type' => 'VARCHAR', 'constraint' => 160],
                'mode' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'debit' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
                'credit' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
                'balance' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
                'note' => ['type' => 'TEXT', 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('student_ledger_entries', true);
        }

        if (! $this->db->tableExists('dashboard_targets')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'module' => ['type' => 'VARCHAR', 'constraint' => 120],
                'target' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
                'achieved' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
                'pending' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
                'owner' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
                'trend' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('dashboard_targets', true);
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('dashboard_targets', true);
        $this->forge->dropTable('student_ledger_entries', true);
        $this->forge->dropTable('scholarship_applications', true);
        $this->forge->dropTable('students', true);
        $this->forge->dropTable('users', true);
        $this->forge->dropTable('theme_profiles', true);
        $this->forge->dropTable('academic_years', true);
        $this->forge->dropTable('institutes', true);
        $this->forge->dropTable('organizations', true);
    }
}

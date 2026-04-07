<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAdmissionWorkflowTables extends Migration
{
    public function up(): void
    {
        if ($this->db->tableExists('institutes')) {
            $newColumns = [];

            if (! $this->db->fieldExists('header_subtitle', 'institutes')) {
                $newColumns['header_subtitle'] = [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'after' => 'header_title',
                ];
            }

            if (! $this->db->fieldExists('principal_name', 'institutes')) {
                $newColumns['principal_name'] = [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                    'null' => true,
                    'after' => 'header_address',
                ];
            }

            if (! $this->db->fieldExists('footer_note', 'institutes')) {
                $newColumns['footer_note'] = [
                    'type' => 'TEXT',
                    'null' => true,
                    'after' => 'principal_name',
                ];
            }

            if (! $this->db->fieldExists('website_url', 'institutes')) {
                $newColumns['website_url'] = [
                    'type' => 'VARCHAR',
                    'constraint' => 180,
                    'null' => true,
                    'after' => 'footer_note',
                ];
            }

            if ($newColumns !== []) {
                $this->forge->addColumn('institutes', $newColumns);
            }
        }

        if (! $this->db->tableExists('enquiries')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'enquiry_number' => ['type' => 'VARCHAR', 'constraint' => 40],
                'student_name' => ['type' => 'VARCHAR', 'constraint' => 160],
                'mobile_number' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
                'email' => ['type' => 'VARCHAR', 'constraint' => 160, 'null' => true],
                'source' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'desired_course' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
                'current_class' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'category' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'new'],
                'assigned_to' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
                'follow_up_date' => ['type' => 'DATE', 'null' => true],
                'notes' => ['type' => 'TEXT', 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('enquiry_number');
            $this->forge->createTable('enquiries', true);
        }

        if (! $this->db->tableExists('admissions')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'enquiry_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'student_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'admission_number' => ['type' => 'VARCHAR', 'constraint' => 40],
                'status' => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'confirmed'],
                'admitted_on' => ['type' => 'DATE', 'null' => true],
                'remarks' => ['type' => 'TEXT', 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('admission_number');
            $this->forge->createTable('admissions', true);
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('admissions', true);
        $this->forge->dropTable('enquiries', true);
    }
}

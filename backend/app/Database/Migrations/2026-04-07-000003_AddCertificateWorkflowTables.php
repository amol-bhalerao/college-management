<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCertificateWorkflowTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('certificate_requests')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'student_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'request_number' => ['type' => 'VARCHAR', 'constraint' => 50],
                'certificate_type' => ['type' => 'VARCHAR', 'constraint' => 60],
                'purpose' => ['type' => 'TEXT', 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'requested'],
                'verification_token' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
                'issued_on' => ['type' => 'DATE', 'null' => true],
                'requested_by' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('request_number');
            $this->forge->addUniqueKey('verification_token');
            $this->forge->createTable('certificate_requests', true);
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('certificate_requests', true);
    }
}

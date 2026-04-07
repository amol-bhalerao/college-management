<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFeeReceiptTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('fee_receipts')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'student_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'ledger_entry_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
                'institute_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'academic_year_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
                'receipt_number' => ['type' => 'VARCHAR', 'constraint' => 50],
                'receipt_date' => ['type' => 'DATE'],
                'amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
                'payment_mode' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
                'received_by' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
                'remarks' => ['type' => 'TEXT', 'null' => true],
                'verification_token' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('receipt_number');
            $this->forge->addUniqueKey('verification_token');
            $this->forge->createTable('fee_receipts', true);
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('fee_receipts', true);
    }
}

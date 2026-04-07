<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddStudentMasterColumns extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('students')) {
            return;
        }

        $columns = [
            'guardian_name' => [
                'type' => 'VARCHAR',
                'constraint' => 160,
                'null' => true,
                'after' => 'last_name',
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 160,
                'null' => true,
                'after' => 'mobile_number',
            ],
            'dob' => [
                'type' => 'DATE',
                'null' => true,
                'after' => 'email',
            ],
            'address' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'dob',
            ],
            'admission_status' => [
                'type' => 'VARCHAR',
                'constraint' => 30,
                'default' => 'active',
                'after' => 'status',
            ],
        ];

        foreach ($columns as $name => $definition) {
            if (! $this->db->fieldExists($name, 'students')) {
                $this->forge->addColumn('students', [
                    $name => $definition,
                ]);
            }
        }
    }

    public function down(): void
    {
        $columns = ['guardian_name', 'email', 'dob', 'address', 'admission_status'];

        foreach ($columns as $column) {
            if ($this->db->fieldExists($column, 'students')) {
                $this->forge->dropColumn('students', $column);
            }
        }
    }
}

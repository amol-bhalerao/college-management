<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTransferCertificateFields extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('students')) {
            return;
        }

        $columns = [
            'mother_name' => [
                'type' => 'VARCHAR',
                'constraint' => 160,
                'null' => true,
                'after' => 'guardian_name',
            ],
            'nationality' => [
                'type' => 'VARCHAR',
                'constraint' => 80,
                'null' => true,
                'after' => 'category',
            ],
            'religion' => [
                'type' => 'VARCHAR',
                'constraint' => 80,
                'null' => true,
                'after' => 'nationality',
            ],
            'caste_subcaste' => [
                'type' => 'VARCHAR',
                'constraint' => 120,
                'null' => true,
                'after' => 'religion',
            ],
            'date_of_birth_words' => [
                'type' => 'VARCHAR',
                'constraint' => 180,
                'null' => true,
                'after' => 'dob',
            ],
            'place_of_birth' => [
                'type' => 'VARCHAR',
                'constraint' => 120,
                'null' => true,
                'after' => 'date_of_birth_words',
            ],
            'birth_taluka' => [
                'type' => 'VARCHAR',
                'constraint' => 120,
                'null' => true,
                'after' => 'place_of_birth',
            ],
            'birth_district' => [
                'type' => 'VARCHAR',
                'constraint' => 120,
                'null' => true,
                'after' => 'birth_taluka',
            ],
            'birth_state' => [
                'type' => 'VARCHAR',
                'constraint' => 120,
                'null' => true,
                'after' => 'birth_district',
            ],
            'previous_school' => [
                'type' => 'VARCHAR',
                'constraint' => 180,
                'null' => true,
                'after' => 'birth_state',
            ],
            'date_of_admission' => [
                'type' => 'DATE',
                'null' => true,
                'after' => 'previous_school',
            ],
            'date_of_leaving' => [
                'type' => 'DATE',
                'null' => true,
                'after' => 'date_of_admission',
            ],
            'class_last_attended' => [
                'type' => 'VARCHAR',
                'constraint' => 80,
                'null' => true,
                'after' => 'date_of_leaving',
            ],
            'progress_status' => [
                'type' => 'VARCHAR',
                'constraint' => 80,
                'null' => true,
                'after' => 'class_last_attended',
            ],
            'conduct' => [
                'type' => 'VARCHAR',
                'constraint' => 80,
                'null' => true,
                'after' => 'progress_status',
            ],
            'reason_for_leaving' => [
                'type' => 'VARCHAR',
                'constraint' => 180,
                'null' => true,
                'after' => 'conduct',
            ],
            'tc_remarks' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'reason_for_leaving',
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
        $columns = [
            'mother_name',
            'nationality',
            'religion',
            'caste_subcaste',
            'date_of_birth_words',
            'place_of_birth',
            'birth_taluka',
            'birth_district',
            'birth_state',
            'previous_school',
            'date_of_admission',
            'date_of_leaving',
            'class_last_attended',
            'progress_status',
            'conduct',
            'reason_for_leaving',
            'tc_remarks',
        ];

        foreach ($columns as $column) {
            if ($this->db->fieldExists($column, 'students')) {
                $this->forge->dropColumn('students', $column);
            }
        }
    }
}

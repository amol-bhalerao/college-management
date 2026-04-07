<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddInstituteLogoColumn extends Migration
{
    public function up(): void
    {
        if ($this->db->tableExists('institutes') && ! $this->db->fieldExists('logo_url', 'institutes')) {
            $this->forge->addColumn('institutes', [
                'logo_url' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'after' => 'website_url',
                ],
            ]);
        }
    }

    public function down(): void
    {
        if ($this->db->tableExists('institutes') && $this->db->fieldExists('logo_url', 'institutes')) {
            $this->forge->dropColumn('institutes', 'logo_url');
        }
    }
}

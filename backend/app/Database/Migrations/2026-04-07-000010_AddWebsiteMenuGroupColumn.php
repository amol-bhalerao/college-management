<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddWebsiteMenuGroupColumn extends Migration
{
    public function up(): void
    {
        if ($this->db->tableExists('website_pages') && ! $this->db->fieldExists('menu_group', 'website_pages')) {
            $this->forge->addColumn('website_pages', [
                'menu_group' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                    'null' => true,
                    'after' => 'nav_label',
                ],
            ]);
        }
    }

    public function down(): void
    {
        if ($this->db->tableExists('website_pages') && $this->db->fieldExists('menu_group', 'website_pages')) {
            $this->forge->dropColumn('website_pages', 'menu_group');
        }
    }
}

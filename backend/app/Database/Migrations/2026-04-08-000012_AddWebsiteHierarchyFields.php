<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddWebsiteHierarchyFields extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('website_pages')) {
            return;
        }

        $fields = [];

        if (! $this->db->fieldExists('parent_page_id', 'website_pages')) {
            $fields['parent_page_id'] = [
                'type' => 'INT',
                'constraint' => 10,
                'unsigned' => true,
                'null' => true,
                'after' => 'menu_group',
            ];
        }

        if (! $this->db->fieldExists('show_in_nav', 'website_pages')) {
            $fields['show_in_nav'] = [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
                'after' => 'show_on_home',
            ];
        }

        if ($fields !== []) {
            $this->forge->addColumn('website_pages', $fields);
        }
    }

    public function down(): void
    {
        if (! $this->db->tableExists('website_pages')) {
            return;
        }

        foreach (['parent_page_id', 'show_in_nav'] as $field) {
            if ($this->db->fieldExists($field, 'website_pages')) {
                $this->forge->dropColumn('website_pages', $field);
            }
        }
    }
}

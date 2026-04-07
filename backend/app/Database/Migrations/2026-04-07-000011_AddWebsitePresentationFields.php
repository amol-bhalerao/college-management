<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddWebsitePresentationFields extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('website_pages')) {
            return;
        }

        $fields = [];

        if (! $this->db->fieldExists('summary_text', 'website_pages')) {
            $fields['summary_text'] = [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'hero_subtitle',
            ];
        }

        if (! $this->db->fieldExists('cover_image_url', 'website_pages')) {
            $fields['cover_image_url'] = [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'summary_text',
            ];
        }

        if (! $this->db->fieldExists('show_on_home', 'website_pages')) {
            $fields['show_on_home'] = [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
                'after' => 'is_published',
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

        foreach (['show_on_home', 'cover_image_url', 'summary_text'] as $field) {
            if ($this->db->fieldExists($field, 'website_pages')) {
                $this->forge->dropColumn('website_pages', $field);
            }
        }
    }
}

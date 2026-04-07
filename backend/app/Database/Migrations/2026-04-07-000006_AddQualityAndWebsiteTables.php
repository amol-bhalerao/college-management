<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddQualityAndWebsiteTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('quality_metrics')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'academic_year_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'null' => true,
                ],
                'criterion_code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                ],
                'title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 180,
                ],
                'owner' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                    'null' => true,
                ],
                'target_value' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'default' => 0,
                ],
                'achieved_value' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'default' => 0,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'default' => 'ongoing',
                ],
                'evidence_status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'default' => 'in-progress',
                ],
                'next_review_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'notes' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('quality_metrics');
        }

        if (! $this->db->tableExists('website_pages')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 10,
                    'unsigned' => true,
                ],
                'slug' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                ],
                'nav_label' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                    'null' => true,
                ],
                'title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 180,
                ],
                'hero_title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 200,
                    'null' => true,
                ],
                'hero_subtitle' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'body_html' => [
                    'type' => 'LONGTEXT',
                    'null' => true,
                ],
                'seo_title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 180,
                    'null' => true,
                ],
                'seo_description' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'is_published' => [
                    'type' => 'TINYINT',
                    'constraint' => 1,
                    'default' => 1,
                ],
                'sort_order' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'default' => 1,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'updated_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey(['institute_id', 'slug']);
            $this->forge->createTable('website_pages');
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('website_pages', true);
        $this->forge->dropTable('quality_metrics', true);
    }
}

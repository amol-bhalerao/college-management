<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFoundationTables extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('organizations')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('organizations', true);
        }

        if (! $this->db->tableExists('institutes')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'organization_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                ],
                'type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 80,
                    'null' => true,
                ],
                'contact_email' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                    'null' => true,
                ],
                'contact_phone' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'null' => true,
                ],
                'receipt_prefix' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'null' => true,
                ],
                'header_title' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                ],
                'header_address' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('institutes', true);
        }

        if (! $this->db->tableExists('academic_years')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'label' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                ],
                'start_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'end_date' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'is_current' => [
                    'type' => 'BOOLEAN',
                    'default' => false,
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('academic_years', true);
        }

        if (! $this->db->tableExists('theme_profiles')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'organization_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'null' => true,
                ],
                'name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 120,
                ],
                'theme_json' => [
                    'type' => 'LONGTEXT',
                ],
                'is_active' => [
                    'type' => 'BOOLEAN',
                    'default' => true,
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('theme_profiles', true);
        }

        if (! $this->db->tableExists('users')) {
            $this->forge->addField([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'auto_increment' => true,
                ],
                'institute_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'null' => true,
                ],
                'full_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'email' => [
                    'type' => 'VARCHAR',
                    'constraint' => 160,
                ],
                'role_code' => [
                    'type' => 'VARCHAR',
                    'constraint' => 40,
                ],
                'password_hash' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                ],
                'whatsapp_number' => [
                    'type' => 'VARCHAR',
                    'constraint' => 30,
                    'null' => true,
                ],
                'status' => [
                    'type' => 'VARCHAR',
                    'constraint' => 20,
                    'default' => 'active',
                ],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('email');
            $this->forge->createTable('users', true);
        }
    }

    public function down(): void
    {
        $this->forge->dropTable('users', true);
        $this->forge->dropTable('theme_profiles', true);
        $this->forge->dropTable('academic_years', true);
        $this->forge->dropTable('institutes', true);
        $this->forge->dropTable('organizations', true);
    }
}

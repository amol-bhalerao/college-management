# Database Setup

## Option 1: Local test database (recommended for current dev setup)
This project currently uses a local SQLite database for quick testing.

Run:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-test-db.ps1
```

This will:
- recreate `backend/writable/database.sqlite`
- run all migrations
- seed demo data
- make the app ready for testing

### Demo login
- `superadmin / Password@123`
- `clerk01 / Password@123`
- `accounts01 / Password@123`

## Option 2: MySQL setup script
For Hostinger or MySQL-based testing, run:
- `database/mysql/001_college_management_setup.sql`

This script uses:
- `CREATE DATABASE IF NOT EXISTS`
- `CREATE TABLE IF NOT EXISTS`
- `INSERT IGNORE`

so it is safer for repeatable setup/testing.

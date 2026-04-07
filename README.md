# College Management Application

A multi-institute, IQAC/NAAC-aware college ERP + website platform planned for `Angular + PHP + MySQL`, designed for Hostinger shared hosting.

## Planned Architecture
- `frontend/` - Angular admin/user panel
- `backend/` - PHP API + website/CMS rendering layer
- `docs/` - architecture, scope, and development planning
- `database/` - schema and migration scripts (to be added)
- `deploy/` - hosting/deployment notes (to be added)

## Key Product Goals
- Multi-institute management under one organization
- Institute-specific branding, headers, receipts, and certificates
- Super Admin graphical theme studio (no coding needed)
- Clerk, Accountant, and Super Admin role-based workflows
- Scholarship, IQAC/NAAC, and report-heavy operations
- SEO-ready public website and QR-based public verification

## Local Development Quick Start
### Frontend
```bash
cd frontend
npm install
npm start
```
Open: `http://127.0.0.1:4200/login`

### Backend
```bash
cd backend
composer install
php spark migrate
php spark db:seed DemoSeeder
php spark serve --host 127.0.0.1 --port 8080
```
Open: `http://127.0.0.1:8080/`

## Demo Login Credentials
> Change these before production use.

- **Super Admin**
  - User ID: `superadmin`
  - Password: `Password@123`
- **Clerk**
  - User ID: `clerk01`
  - Password: `Password@123`
- **Accountant**
  - User ID: `accounts01`
  - Password: `Password@123`

## Current Foundation Status
Implemented so far:
- login flow with local mock auth
- executive dashboard
- admission CRM (enquiries and conversion flow)
- institute header manager for graphical print branding edits
- theme studio UI
- student ledger screen
- mock data seeders and institute records
- QR/public verification API base

See `docs/development-plan.md` for the detailed blueprint and development stages.

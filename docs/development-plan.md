# College Management Application — Development Blueprint

## 1. Product Vision
Build a **white-label, multi-institute College ERP + Website CMS** for institutions under a single organization/trust. The system must be **responsive, modern, SEO-ready, IQAC/NAAC-aligned, scholarship-aware, and simple for non-technical users**.

---

## 2. Final Confirmed Scope

### Organizational model
- One `organization / trust`
- Multiple `institutes / colleges`
- All records are managed by `institute_id` and `academic_year_id`
- No campus layer
- No financial year dropdown; keep **academic year only**

### Header and branding rules
- Each institute can have its own:
  - logo
  - receipt header
  - certificate header
  - address/footer
  - contact details
  - signatory block
- Printed documents must automatically use the correct institute branding based on the student record.

### Theme management for non-technical Super Admin
Super Admin should never edit code/CSS directly. Provide a **graphical Theme Studio** with controls for:
- primary/secondary colors
- sidebar/topbar colors
- background and card styles
- font family and sizes
- button styles
- border radius/shadows
- website colors and banner look
- light/dark preset
- live preview for desktop/tablet/mobile
- publish/revert/reset theme

Implementation note:
- Centralize visual design using `CSS variables / design tokens`
- Store theme values in DB
- Apply them to both the Angular panel and the website

---

## 3. Primary Roles

### Super Admin
- Manage multiple institutes
- Create multiple users per institute
- Manage roles/permissions
- Add all master data
- Define classes/divisions/strengths
- Define fee heads and fee structures
- Manage staff/teacher records
- Approve major requests and concessions
- Manage website pages/content/media/IQAC section
- Manage theme, branding, settings, and SEO
- Monitor all dashboards, KPIs, targets, and outcomes

### Clerk
- Manage enquiries and admissions
- Convert website enquiries to admissions
- Maintain Maharashtra-style TC/admission data
- Manage student profile and class allocation
- Handle promotions in bulk
- Manage staff attendance and leaves
- Assign scholarship/forms to students
- Generate certificates (TC, duplicate TC, bonafide, nirgam, no dues, etc.)
- Track targets such as form fill status, scholarship completion, document pending, etc.

### Accountant
- Collect fees using a fee cart
- Create and print A5 receipts
- Manage expenses, vouchers, salary, bank entries
- Generate **student ledger** and dues statement
- Track collections, outstanding, concessions, and daily totals

### Light teacher/staff panel (later-light)
- own profile
- leave request
- attendance view
- notices/salary slip (future extension)

---

## 4. Required Modern Product Features

### Included recommended features
- Audit log
- Approval workflow engine
- Numbering rules for receipts/certificates/vouchers
- Template manager
- Notification center
- Excel import/export
- Soft delete + restore
- Backup controls
- QR verification for receipts/certificates
- WhatsApp communication with students/parents
- Document management and checklists
- Activity timeline
- Dynamic report builder
- SEO tools
- Institute branding manager
- Theme studio

### UI/UX requirements
- Premium responsive design
- Mobile/tablet/desktop support
- Fast UI with smooth micro-animations
- Modal popup driven detail views
- Modern dashboards and drill-downs
- Accessible forms and printable layouts

### Frontend library recommendations
- `Angular`
- `Angular Material`
- `AG Grid` for advanced tables
- `ApexCharts` / `Chart.js` for dashboards
- `ngx-lottie` or subtle animation assets for polished motion
- `SweetAlert2` for confirmation dialogs
- `ngx-quill` for rich text CMS editing
- `ngx-color-picker` for theme studio
- `QRCode` generator library for document validation

---

## 5. Cross-Cutting IQAC / NAAC Compliance Rules
All modules should support evidence generation and compliance data.

### Application-wide compliance principles
- Every major activity should be reportable by academic year
- Documents should be versioned and downloadable
- Meeting, action taken, notices, circulars, and feedback should be traceable
- Student support, scholarship, certificate, grievance, and outcome data should be exportable
- Dashboards should show measurable performance indicators

### IQAC / NAAC-driven capabilities
- criteria-wise evidence repository
- policy/document library
- feedback collection and analysis
- committee records and meeting minutes
- outreach/event/workshop tracker
- student support and progression reporting
- staff profile/training and performance records
- institutional best practices and achievements section

---

## 6. Scholarship / Freeship Workflow (Maharashtra + Indian context)
Based on common `MahaDBT` and `National Scholarship Portal` style processes, the system should support:

### Categories
- SC
- ST
- OBC
- SBC
- VJNT
- EWS / SEBC
- Minority
- Girls-specific schemes
- Merit scholarships
- PwD / special category

### Data to capture
- caste/category
- income range
- bank account details
- Aadhaar/OTR/portal reference numbers
- scholarship scheme
- required document checklist
- application status
- institute verification status
- reimbursement received / pending amount
- right-to-give-up / self-financed option

### Scholarship dashboard metrics for Clerk / Super Admin
- total eligible students
- forms assigned
- forms submitted
- verified count
- approved count
- rejected count
- yet-to-fill count
- reimbursement pending count

---

## 7. Dashboard Strategy with Target / Outcome Tracking
Each user should have an **Expected Target vs Outcome Dashboard**.

### Super Admin evaluated dashboard
- enquiry count vs admission conversion
- institute-wise admissions
- student strength
- scholarship progress and pending cases
- teacher/staff progress snapshot
- certificate issuance summary
- fee collection vs pending dues
- website lead generation
- activity completion rate by department/user

### Clerk target dashboard
- target admissions
- enquiry follow-up target
- scholarship forms assign/submitted/pending
- document completion target
- certificate requests pending/completed

### Accountant dashboard
- daily/monthly collection target
- outstanding recovery
- receipts issued
- discounts used
- voucher/expense summary
- student ledger pending cases

---

## 8. Public Website + SEO Plan
The public website must support:
- institute-specific pages
- news/events/gallery
- admission enquiry form
- IQAC pages and evidence downloads
- notices/downloads
- contact and map
- clean SEO-friendly URLs

### SEO capabilities
- per-page meta title/description
- schema markup
- canonical URLs
- sitemap.xml
- robots.txt
- Open Graph tags
- image alt text
- redirect manager
- speed optimization

---

## 9. QR Validation + Public Verification API
All receipts and certificates should have a QR code.

### QR flow
- receipt/certificate generated
- unique verification token created
- QR points to public verification URL
- outsider scans QR and sees a public validation page

### Public verification API/pages
- `GET /verify/receipt/{token}`
- `GET /verify/certificate/{token}`

Public page should show only safe validation data:
- document type
- number
- issue date
- institute name
- student name (masked if required)
- validity / status

---

## 10. WhatsApp Communication Plan
Use WhatsApp for:
- fee due reminders
- receipt confirmation
- document pending reminders
- scholarship updates
- admission follow-up
- certificate ready alerts

Implementation options:
- official WhatsApp Business API provider later
- start with configurable link/message templates

---

## 11. Data Model Direction
Core tables planned:
- `organizations`
- `institutes`
- `academic_years`
- `users`
- `roles`
- `permissions`
- `user_institute_access`
- `global_settings`
- `institute_settings`
- `theme_profiles`
- `seo_settings`
- `enquiries`
- `students`
- `student_guardians`
- `admissions`
- `class_allocations`
- `promotions`
- `staff`
- `staff_attendance`
- `staff_leaves`
- `fee_heads`
- `fee_structures`
- `student_fee_assignments`
- `receipts`
- `receipt_items`
- `expenses`
- `vouchers`
- `salary_entries`
- `student_ledgers`
- `scholarship_schemes`
- `scholarship_applications`
- `certificate_issues`
- `pages`
- `news_events`
- `galleries`
- `iqac_documents`
- `approval_requests`
- `audit_logs`
- `notifications`
- `document_templates`
- `numbering_sequences`

All transactional tables should include:
- `institute_id`
- `academic_year_id`
- `created_by`
- timestamps
- status / soft-delete fields

---

## 12. Planned Development Stages

### Stage 0 — Discovery and freeze
- finalize updated scope
- finalize user journeys
- define institute hierarchy and settings
- freeze module list and MVP

### Stage 1 — Project foundation
- clone/configure repo
- finalize folder structure
- create documentation baseline
- decide coding standards and Git workflow

### Stage 2 — Core architecture
- Angular app shell
- PHP API skeleton
- DB migration base
- authentication and RBAC
- institute + academic year context switching
- global settings and theme engine base

### Stage 3 — Super Admin core
- institute setup
- user management
- master data
- class/division and strength
- fee structure setup
- certificate/form templates
- approval engine

### Stage 4 — Clerk workflow
- enquiry CRM
- admission flow
- student profile
- promotion flow
- staff attendance + leaves
- scholarship assignment and tracking
- certificate generation

### Stage 5 — Accountant workflow
- fee cart and collection
- A5 receipt print
- student ledger
- expenses and vouchers
- salary processing
- dashboard and reports

### Stage 6 — Website + IQAC + SEO
- public website pages
- CMS
- admission enquiry form
- IQAC/public evidence section
- SEO controls

### Stage 7 — Reporting and communication
- AG Grid reports
- export center
- QR verification API
- WhatsApp templates
- KPI/target dashboards

### Stage 8 — polish and deployment
- theme UI refinement
- print quality review
- responsive testing
- Hostinger deployment
- backup and handover

---

## 13. Git Workflow for This Repo
- branch: `main`
- commit after each verified milestone
- push after each meaningful change set
- keep docs and code synced
- no completion claim without verification evidence

Suggested commit style:
- `docs: add architecture and development blueprint`
- `feat: add auth and institute switcher`
- `feat: add theme studio`
- `feat: add admission workflow`

---

## 14. Immediate Next Build Order
1. folder structure + bootstrap
2. auth + RBAC
3. institute/global settings
4. theme studio UI
5. master data
6. enquiry + admission
7. fees + receipt + ledger
8. scholarship tracker
9. certificates + QR verification
10. website CMS + IQAC + SEO

---

## 15. Notes for Ongoing Development
- keep all features institute-aware
- prefer configuration over hardcoding
- keep theme changes graphical only
- ensure print layouts are stable and professional
- maintain IQAC/NAAC evidence-readiness in every module
- use migration-safe SQL (`IF NOT EXISTS`, additive changes, versioned scripts)

---

## 16. Current Development Snapshot
Completed in the working foundation phase:
- Angular app shell with institute and academic-year selectors
- login screen and auth guard flow
- seeded demo users and mock institute/student data
- super admin test credentials: `superadmin / Password@123`
- executive dashboard prototype
- admission CRM prototype with enquiry conversion flow
- super admin user management prototype
- institute header manager for institute-specific receipt/certificate branding
- theme studio prototype for non-technical super admin
- student ledger prototype for accountant
- ready-to-run database setup scripts for local and MySQL testing
- CodeIgniter API endpoints for auth, dashboard summary, ledger, user management, institute settings, admissions/enquiries, and QR verification

### Verified local URLs
- Frontend: `http://127.0.0.1:4200/login`
- Backend: `http://127.0.0.1:8080/`

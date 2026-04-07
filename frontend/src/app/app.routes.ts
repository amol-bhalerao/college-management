import { Routes } from '@angular/router';

import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InstituteHeaderComponent } from './features/institute-header/institute-header.component';
import { LoginComponent } from './features/login/login.component';
import { AdmissionCrmComponent } from './features/admission-crm/admission-crm.component';
import { CertificateCenterComponent } from './features/certificate-center/certificate-center.component';
import { PublicWebsiteComponent } from './features/public-website/public-website.component';
import { StudentLedgerComponent } from './features/student-ledger/student-ledger.component';
import { StudentMasterComponent } from './features/student-master/student-master.component';
import { ScholarshipWorkflowComponent } from './features/scholarship-workflow/scholarship-workflow.component';
import { ThemeStudioComponent } from './features/theme-studio/theme-studio.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { IqacTrackerComponent } from './features/iqac-tracker/iqac-tracker.component';
import { WebsiteCmsComponent } from './features/website-cms/website-cms.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Sign In',
  },
  {
    path: 'site/:code',
    component: PublicWebsiteComponent,
    title: 'Institute Website',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Executive Dashboard',
  },
  {
    path: 'admissions',
    component: AdmissionCrmComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'CLERK'])],
    title: 'Admission CRM',
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],
    title: 'User Management',
  },
  {
    path: 'certificates',
    component: CertificateCenterComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'CLERK', 'ACCOUNTANT'])],
    title: 'Certificate Center',
  },
  {
    path: 'students',
    component: StudentMasterComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'CLERK'])],
    title: 'Student Master',
  },
  {
    path: 'scholarships',
    component: ScholarshipWorkflowComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'CLERK'])],
    title: 'Scholarship Workflow',
  },
  {
    path: 'iqac-tracker',
    component: IqacTrackerComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],
    title: 'IQAC / NAAC Tracking',
  },
  {
    path: 'website-cms',
    component: WebsiteCmsComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],
    title: 'Website CMS',
  },
  {
    path: 'institute-header',
    component: InstituteHeaderComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],
    title: 'Institute Header Manager',
  },
  {
    path: 'theme-studio',
    component: ThemeStudioComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])],
    title: 'Theme Studio',
  },
  {
    path: 'student-ledger',
    component: StudentLedgerComponent,
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN', 'ACCOUNTANT'])],
    title: 'Student Ledger',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

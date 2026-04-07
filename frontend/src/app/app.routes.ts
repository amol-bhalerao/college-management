import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InstituteHeaderComponent } from './features/institute-header/institute-header.component';
import { LoginComponent } from './features/login/login.component';
import { AdmissionCrmComponent } from './features/admission-crm/admission-crm.component';
import { StudentLedgerComponent } from './features/student-ledger/student-ledger.component';
import { ThemeStudioComponent } from './features/theme-studio/theme-studio.component';
import { UserManagementComponent } from './features/user-management/user-management.component';

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
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Executive Dashboard',
  },
  {
    path: 'admissions',
    component: AdmissionCrmComponent,
    canActivate: [authGuard],
    title: 'Admission CRM',
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [authGuard],
    title: 'User Management',
  },
  {
    path: 'institute-header',
    component: InstituteHeaderComponent,
    canActivate: [authGuard],
    title: 'Institute Header Manager',
  },
  {
    path: 'theme-studio',
    component: ThemeStudioComponent,
    canActivate: [authGuard],
    title: 'Theme Studio',
  },
  {
    path: 'student-ledger',
    component: StudentLedgerComponent,
    canActivate: [authGuard],
    title: 'Student Ledger',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

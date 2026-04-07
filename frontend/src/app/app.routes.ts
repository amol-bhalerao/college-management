import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { StudentLedgerComponent } from './features/student-ledger/student-ledger.component';
import { ThemeStudioComponent } from './features/theme-studio/theme-studio.component';

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

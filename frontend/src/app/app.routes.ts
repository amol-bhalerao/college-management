import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentLedgerComponent } from './features/student-ledger/student-ledger.component';
import { ThemeStudioComponent } from './features/theme-studio/theme-studio.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Executive Dashboard',
  },
  {
    path: 'theme-studio',
    component: ThemeStudioComponent,
    title: 'Theme Studio',
  },
  {
    path: 'student-ledger',
    component: StudentLedgerComponent,
    title: 'Student Ledger',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AppContextService } from './core/services/context.service';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    @if (auth.isAuthenticated()) {
      <div class="shell">
        <aside class="sidebar">
          <div class="brand-block">
            <div class="brand-mark">CM</div>
            <div>
              <strong>College ERP</strong>
              <small>IQAC-ready multi-institute suite</small>
            </div>
          </div>

          <nav class="nav-list">
            @for (item of visibleNavItems(); track item.route) {
              <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <span>{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            }
          </nav>

          <div class="sidebar-note">
            <span>Logged in as</span>
            <strong>{{ auth.currentUser()?.fullName }}</strong>
            <small>{{ auth.currentUser()?.role }} · institute-aware access is active.</small>
          </div>
        </aside>

        <div class="workspace">
          <header class="topbar">
            <div class="context-bar">
              <label>
                Institute
                <select [(ngModel)]="selectedInstituteId" (ngModelChange)="onInstituteChange($event)">
                  @for (institute of context.institutes(); track institute.id) {
                    <option [value]="institute.id">{{ institute.name }}</option>
                  }
                </select>
              </label>

              <label>
                Academic Year
                <select [(ngModel)]="selectedAcademicYear" (ngModelChange)="onAcademicYearChange($event)">
                  @for (year of context.academicYears(); track year) {
                    <option [value]="year">{{ year }}</option>
                  }
                </select>
              </label>
            </div>

            <div class="topbar-meta">
              <span class="chip chip--primary">{{ context.activeInstitute().code }}</span>
              <span class="chip">{{ auth.currentUser()?.username }}</span>
              <button type="button" class="logout-btn" (click)="logout()">Logout</button>
            </div>
          </header>

          <main class="page-area">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .shell {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-height: 100vh;
      }

      .sidebar {
        display: grid;
        align-content: start;
        gap: 1rem;
        padding: 1.1rem;
        color: #fff;
        background: linear-gradient(180deg, var(--secondary-color), #111827 78%);
      }

      .brand-block {
        display: flex;
        gap: 0.8rem;
        align-items: center;
        padding: 0.6rem 0.2rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      .brand-block strong,
      .sidebar-note strong {
        display: block;
      }

      .brand-block small,
      .sidebar-note small {
        color: rgba(255, 255, 255, 0.7);
      }

      .brand-mark {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        font-weight: 800;
        background: rgba(255, 255, 255, 0.14);
      }

      .nav-list {
        display: grid;
        gap: 0.45rem;
      }

      .nav-list a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0.9rem;
        border-radius: 14px;
        color: #fff;
        text-decoration: none;
        transition: background-color 0.18s ease, transform 0.18s ease;
      }

      .nav-list a:hover,
      .nav-list a.active {
        background: rgba(255, 255, 255, 0.14);
        transform: translateX(2px);
      }

      .sidebar-note {
        padding: 0.9rem;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.09);
      }

      .sidebar-note span {
        display: block;
        margin-bottom: 0.35rem;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.75);
      }

      .workspace {
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.9rem 1.25rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(12px);
      }

      .context-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.9rem;
      }

      .context-bar label {
        display: grid;
        gap: 0.35rem;
        color: var(--muted-text);
        font-size: 0.9rem;
      }

      .context-bar select {
        min-width: 180px;
        padding: 0.7rem 0.85rem;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 12px;
        background: var(--surface-color);
      }

      .topbar-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        color: var(--secondary-color);
        font-size: 0.82rem;
        font-weight: 700;
      }

      .chip--primary {
        background: rgba(79, 70, 229, 0.12);
        color: var(--primary-color);
      }

      .logout-btn {
        padding: 0.55rem 0.85rem;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--header-start), var(--header-end));
        color: #fff;
        cursor: pointer;
      }

      .page-area {
        padding: 1.25rem;
      }

      @media (max-width: 960px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          padding-bottom: 0.8rem;
        }

        .topbar {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class App {
  protected readonly context = inject(AppContextService);
  protected readonly auth = inject(AuthService);

  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  protected readonly navItems = [
    { label: 'Executive Dashboard', route: '/dashboard', icon: '📊', roles: ['SUPER_ADMIN', 'CLERK', 'ACCOUNTANT'] },
    { label: 'Admission CRM', route: '/admissions', icon: '🧾', roles: ['SUPER_ADMIN', 'CLERK'] },
    { label: 'User Management', route: '/users', icon: '👥', roles: ['SUPER_ADMIN'] },
    { label: 'Certificate Center', route: '/certificates', icon: '📜', roles: ['SUPER_ADMIN', 'CLERK', 'ACCOUNTANT'] },
    { label: 'Student Master', route: '/students', icon: '🎓', roles: ['SUPER_ADMIN', 'CLERK'] },
    { label: 'Institute Header', route: '/institute-header', icon: '🏫', roles: ['SUPER_ADMIN'] },
    { label: 'Student Ledger', route: '/student-ledger', icon: '📒', roles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
    { label: 'Theme Studio', route: '/theme-studio', icon: '🎨', roles: ['SUPER_ADMIN'] },
  ];

  protected readonly visibleNavItems = computed(() => {
    const role = this.auth.currentUser()?.role ?? '';
    return this.navItems.filter((item) => item.roles.includes(role));
  });

  protected selectedInstituteId = String(this.context.activeInstitute().id);
  protected selectedAcademicYear = this.context.activeAcademicYear();

  constructor() {
    void this.themeService;
  }

  protected onInstituteChange(value: string): void {
    this.context.selectInstitute(value);
  }

  protected onAcademicYearChange(value: string): void {
    this.context.selectAcademicYear(value);
  }

  protected async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}

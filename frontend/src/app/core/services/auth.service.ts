import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppContextService } from './context.service';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  instituteId: number | null;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  institutes: Array<{ id: number; code: string; name: string; type: string }>;
  academicYears: Array<{ id: number; label: string; is_current: boolean | number }>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly context = inject(AppContextService);
  private readonly storageKey = 'college-management-session';
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = this.sessionState.asReadonly();
  readonly currentUser = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  constructor() {
    const session = this.sessionState();

    if (session) {
      this.context.syncFromSession(session);
    }
  }

  async login(payload: LoginPayload): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthSession>(`${environment.apiBaseUrl}/auth/login`, payload),
    );

    this.sessionState.set(response);
    this.context.syncFromSession(response);
    localStorage.setItem(this.storageKey, JSON.stringify(response));
  }

  logout(): void {
    this.sessionState.set(null);
    this.context.reset();
    localStorage.removeItem(this.storageKey);
  }

  private readStoredSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }
}

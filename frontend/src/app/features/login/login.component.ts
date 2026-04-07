import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="login-page">
      <div class="login-card">
        <div class="hero-copy">
          <p class="eyebrow">Welcome back</p>
          <h1>College Management ERP</h1>
          <p>
            Sign in to access the multi-institute, IQAC-ready dashboard and operational modules.
          </p>

          <div class="demo-box">
            <strong>Demo super user</strong>
            <span>User ID: <code>superadmin</code></span>
            <span>Password: <code>Password@123</code></span>
          </div>
        </div>

        <form class="login-form" (ngSubmit)="login()">
          <label>
            User ID
            <input type="text" name="username" [(ngModel)]="username" placeholder="Enter user ID" />
          </label>

          <label>
            Password
            <input type="password" name="password" [(ngModel)]="password" placeholder="Enter password" />
          </label>

          @if (errorMessage()) {
            <p class="error-message">{{ errorMessage() }}</p>
          }

          <button type="submit" [disabled]="isLoading()">
            {{ isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </section>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected username = 'superadmin';
  protected password = 'Password@123';
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected async login(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      await this.authService.login({
        username: this.username.trim(),
        password: this.password,
      });

      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      const message = error instanceof HttpErrorResponse
        ? error.error?.message ?? 'Login failed. Please verify your credentials.'
        : 'Unable to sign in right now.';

      this.errorMessage.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}

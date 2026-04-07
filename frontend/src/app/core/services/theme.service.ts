import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  headerStart: string;
  headerEnd: string;
  fontFamily: string;
  radius: number;
  shadowStrength: number;
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#4f46e5',
  secondaryColor: '#0f172a',
  accentColor: '#14b8a6',
  backgroundColor: '#f4f7fb',
  surfaceColor: '#ffffff',
  textColor: '#0f172a',
  headerStart: '#1d4ed8',
  headerEnd: '#0f766e',
  fontFamily: 'Inter, sans-serif',
  radius: 18,
  shadowStrength: 18,
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'college-management-theme';
  private readonly themeState = signal<ThemeConfig>(this.getInitialTheme());

  readonly theme = this.themeState.asReadonly();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.themeState());
  }

  updateTheme(patch: Partial<ThemeConfig>): void {
    const nextTheme = { ...this.themeState(), ...patch };
    this.themeState.set(nextTheme);
    this.applyTheme(nextTheme);
    this.persistTheme(nextTheme);
  }

  resetTheme(): void {
    this.themeState.set(DEFAULT_THEME);
    this.applyTheme(DEFAULT_THEME);
    this.persistTheme(DEFAULT_THEME);
  }

  private getInitialTheme(): ThemeConfig {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_THEME;
    }

    try {
      const rawTheme = localStorage.getItem(this.storageKey);
      return rawTheme ? { ...DEFAULT_THEME, ...JSON.parse(rawTheme) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }

  private persistTheme(theme: ThemeConfig): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(theme));
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = this.document.documentElement;

    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--surface-color', theme.surfaceColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--header-start', theme.headerStart);
    root.style.setProperty('--header-end', theme.headerEnd);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--radius', `${theme.radius}px`);
    root.style.setProperty('--shadow-opacity', String(theme.shadowStrength / 100));
  }
}

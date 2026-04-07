import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ThemeConfig, ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-studio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="theme-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Graphical Theme Studio</p>
          <h1>Super Admin Look & Feel Controls</h1>
          <p>
            No code editing needed — choose colors, typography, and layout feel using visual controls.
          </p>
        </div>
        <div class="page-actions">
          <button type="button" class="primary-btn" (click)="resetTheme()">Reset to default</button>
        </div>
      </div>

      <div class="studio-grid">
        <article class="panel">
          <h2>Brand colors</h2>

          <label>
            Primary color
            <input type="color" [ngModel]="theme().primaryColor" (ngModelChange)="patchTheme('primaryColor', $event)" />
          </label>

          <label>
            Secondary color
            <input type="color" [ngModel]="theme().secondaryColor" (ngModelChange)="patchTheme('secondaryColor', $event)" />
          </label>

          <label>
            Accent color
            <input type="color" [ngModel]="theme().accentColor" (ngModelChange)="patchTheme('accentColor', $event)" />
          </label>

          <label>
            Header gradient start
            <input type="color" [ngModel]="theme().headerStart" (ngModelChange)="patchTheme('headerStart', $event)" />
          </label>

          <label>
            Header gradient end
            <input type="color" [ngModel]="theme().headerEnd" (ngModelChange)="patchTheme('headerEnd', $event)" />
          </label>
        </article>

        <article class="panel">
          <h2>Surface & typography</h2>

          <label>
            Background color
            <input type="color" [ngModel]="theme().backgroundColor" (ngModelChange)="patchTheme('backgroundColor', $event)" />
          </label>

          <label>
            Surface color
            <input type="color" [ngModel]="theme().surfaceColor" (ngModelChange)="patchTheme('surfaceColor', $event)" />
          </label>

          <label>
            Text color
            <input type="color" [ngModel]="theme().textColor" (ngModelChange)="patchTheme('textColor', $event)" />
          </label>

          <label>
            Font family
            <select [ngModel]="theme().fontFamily" (ngModelChange)="patchTheme('fontFamily', $event)">
              @for (font of fonts; track font.value) {
                <option [value]="font.value">{{ font.label }}</option>
              }
            </select>
          </label>
        </article>

        <article class="panel">
          <h2>Shape & elevation</h2>

          <label>
            Card radius: <strong>{{ theme().radius }}px</strong>
            <input type="range" min="8" max="28" [ngModel]="theme().radius" (ngModelChange)="patchTheme('radius', +$event)" />
          </label>

          <label>
            Shadow strength: <strong>{{ theme().shadowStrength }}</strong>
            <input type="range" min="8" max="30" [ngModel]="theme().shadowStrength" (ngModelChange)="patchTheme('shadowStrength', +$event)" />
          </label>

          <div class="tokens">
            <span class="token">Admin Panel</span>
            <span class="token">Public Website</span>
            <span class="token">Print Theme</span>
          </div>
        </article>
      </div>

      <article class="panel preview-panel">
        <div class="panel__header">
          <div>
            <h2>Live Preview</h2>
            <p>Preview how cards, buttons, and headers will look across the application.</p>
          </div>
          <span class="preview-chip">Institute-aware branding</span>
        </div>

        <div class="preview-grid">
          <div class="preview-hero">
            <span>Sample website banner</span>
            <strong>Admissions Open 2025-26</strong>
            <small>SEO-ready, responsive, and aligned with institute-specific branding.</small>
          </div>

          <div class="preview-card">
            <h3>User panel card</h3>
            <p>Clerk and accountant users will see the same centrally managed style.</p>
            <button type="button">Preview action</button>
          </div>

          <div class="preview-card">
            <h3>Receipt / certificate note</h3>
            <p>Institute-specific headers are still controlled separately from the theme.</p>
            <button type="button" class="secondary-btn">Header manager</button>
          </div>
        </div>
      </article>
    </section>
  `,
  styleUrl: './theme-studio.component.scss',
})
export class ThemeStudioComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;

  protected readonly fonts = [
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  ];

  protected patchTheme<Key extends keyof ThemeConfig>(key: Key, value: ThemeConfig[Key]): void {
    this.themeService.updateTheme({ [key]: value } as Partial<ThemeConfig>);
  }

  protected resetTheme(): void {
    this.themeService.resetTheme();
  }
}

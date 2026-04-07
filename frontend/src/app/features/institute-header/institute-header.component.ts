import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { InstituteService, InstituteSettings } from '../../core/services/institute.service';

@Component({
  selector: 'app-institute-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Institute branding</p>
          <h1>Header & Print Manager</h1>
          <p>Super Admin can edit institute-specific header content through a simple graphical interface.</p>
        </div>
        <span class="tag">No code editing needed</span>
      </div>

      <div class="layout">
        <form class="panel form-panel" (ngSubmit)="save()">
          <h2>{{ context.activeInstitute().name }} settings</h2>

          <label>
            Header title
            <input type="text" [(ngModel)]="form.header_title" name="header_title" />
          </label>

          <label>
            Header subtitle
            <input type="text" [(ngModel)]="form.header_subtitle" name="header_subtitle" />
          </label>

          <label>
            Address
            <textarea rows="3" [(ngModel)]="form.header_address" name="header_address"></textarea>
          </label>

          <div class="grid-two">
            <label>
              Contact email
              <input type="email" [(ngModel)]="form.contact_email" name="contact_email" />
            </label>

            <label>
              Contact phone
              <input type="text" [(ngModel)]="form.contact_phone" name="contact_phone" />
            </label>
          </div>

          <div class="grid-two">
            <label>
              Receipt prefix
              <input type="text" [(ngModel)]="form.receipt_prefix" name="receipt_prefix" />
            </label>

            <label>
              Principal name
              <input type="text" [(ngModel)]="form.principal_name" name="principal_name" />
            </label>
          </div>

          <label>
            Logo URL
            <input type="text" [(ngModel)]="form.logo_url" name="logo_url" placeholder="https://example.edu/logo.png" />
          </label>

          <label>
            Website URL
            <input type="text" [(ngModel)]="form.website_url" name="website_url" />
          </label>

          <label>
            Footer note
            <textarea rows="3" [(ngModel)]="form.footer_note" name="footer_note"></textarea>
          </label>

          <button type="submit" [disabled]="isSaving()">{{ isSaving() ? 'Saving...' : 'Save header settings' }}</button>
        </form>

        <article class="panel preview-panel">
          <div class="header-preview">
            @if (form.logo_url) {
              <img class="logo-preview" [src]="form.logo_url" alt="Institute logo" />
            } @else {
              <span>{{ context.activeInstitute().code }}</span>
            }
            <h2>{{ form.header_title || context.activeInstitute().name }}</h2>
            <strong>{{ form.header_subtitle || 'Institute-specific receipt and certificate header' }}</strong>
            <p>{{ form.header_address || 'Address will appear here.' }}</p>
            <small>{{ form.contact_phone || 'Phone' }} · {{ form.contact_email || 'Email' }}</small>
          </div>

          <div class="receipt-preview">
            <div class="receipt-line">
              <span>Receipt prefix</span>
              <strong>{{ form.receipt_prefix || 'RCPT' }}-0001</strong>
            </div>
            <div class="receipt-line">
              <span>Principal</span>
              <strong>{{ form.principal_name || 'Principal name' }}</strong>
            </div>
            <div class="receipt-line">
              <span>Footer</span>
              <strong>{{ form.footer_note || 'Thank you for supporting quality education.' }}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
  styleUrl: './institute-header.component.scss',
})
export class InstituteHeaderComponent {
  protected readonly context = inject(AppContextService);
  private readonly instituteService = inject(InstituteService);

  protected readonly isSaving = signal(false);
  protected form: Partial<InstituteSettings> = {};

  constructor() {
    effect(() => {
      const instituteId = this.context.activeInstitute().id;
      void this.load(instituteId);
    });
  }

  protected async save(): Promise<void> {
    this.isSaving.set(true);

    try {
      this.form = await this.instituteService.updateSettings(this.context.activeInstitute().id, this.form);
      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Institute header settings updated successfully.' });
    } finally {
      this.isSaving.set(false);
    }
  }

  private async load(instituteId: number): Promise<void> {
    this.form = await this.instituteService.getSettings(instituteId);
  }
}

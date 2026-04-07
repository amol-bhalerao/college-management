import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { WebsiteCmsService, WebsitePage, WebsitePagePayload } from '../../core/services/website-cms.service';

@Component({
  selector: 'app-website-cms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Website CMS</p>
          <h1>Public Website + SEO Pages</h1>
          <p>Create and manage institute-wise public pages, grouped menus, homepage cards, and SEO metadata without coding.</p>
        </div>
        <div class="head-actions">
          <button type="button" class="secondary-btn" (click)="previewPublicSite()">Preview public site</button>
          <button type="button" class="primary-btn" (click)="openCreate()">+ Add page</button>
        </div>
      </div>

      <div class="layout">
        <article class="panel page-list-panel">
          <div class="panel__header">
            <div>
              <h2>Page list</h2>
              <p>Home, About, Admissions, Facilities, and other SEO-ready pages.</p>
            </div>
            <span class="tag">Published website</span>
          </div>

          <div class="page-list">
            @for (page of pages(); track page.id) {
              <button type="button" class="page-item" [class.active]="selectedPage()?.id === page.id" (click)="selectPage(page)">
                <div>
                  <strong>{{ page.nav_label || page.title }}</strong>
                  <small>{{ page.menu_group || 'General' }} · /{{ page.slug }}</small>
                </div>
                <span>{{ isPublished(page) ? 'Published' : 'Draft' }}</span>
              </button>
            }
          </div>
        </article>

        <article class="panel editor-panel">
          <div class="panel__header">
            <div>
              <h2>{{ selectedPage()?.title || 'Select a page' }}</h2>
              <p>{{ selectedPage()?.seo_title || 'SEO title will appear here.' }}</p>
            </div>
            @if (selectedPage()) {
              <div class="head-actions">
                <button type="button" class="ghost-btn" (click)="openEdit(selectedPage()!)">Edit</button>
                <button type="button" class="ghost-btn danger-btn" (click)="deletePage(selectedPage()!)">Delete</button>
              </div>
            }
          </div>

          @if (selectedPage(); as page) {
            <div class="preview-card">
              <span class="seo-chip">SEO: {{ page.seo_title || page.title }}</span>
              <div class="preview-meta">
                <div>
                  <h3>{{ page.hero_title || page.title }}</h3>
                  <p>{{ page.hero_subtitle || 'Hero subtitle will appear here.' }}</p>
                  <small>Group: {{ page.menu_group || 'General' }} · Home card: {{ isHomeCard(page) ? 'Yes' : 'No' }}</small>
                </div>
                @if (page.cover_image_url) {
                  <img class="preview-image" [src]="page.cover_image_url" [alt]="page.title" />
                }
              </div>
              <div class="seo-box">
                <strong>Page summary</strong>
                <p>{{ page.summary_text || page.seo_description || 'No summary added yet.' }}</p>
              </div>
              <div class="html-preview" [innerHTML]="page.body_html || '<p>No page body added yet.</p>'"></div>
              <div class="seo-box">
                <strong>SEO description</strong>
                <p>{{ page.seo_description || 'No SEO description added yet.' }}</p>
              </div>
            </div>
          } @else {
            <p class="empty-state">No page selected yet.</p>
          }
        </article>
      </div>

      @if (showModal()) {
        <div class="detail-modal" (click)="closeModal()">
          <form class="detail-card detail-card--wide" (click)="$event.stopPropagation()" (ngSubmit)="savePage()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update website page' : 'Add website page' }}</h2>
                <p>Configure navigation label, hero content, HTML body, and SEO settings.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Navigation label
                <input type="text" name="nav_label" [(ngModel)]="form.nav_label" />
              </label>
              <label>
                Menu group
                <select name="menu_group" [(ngModel)]="form.menu_group">
                  @for (group of menuGroupOptions; track group) {
                    <option [value]="group">{{ group }}</option>
                  }
                </select>
              </label>
              <label>
                Slug
                <input type="text" name="slug" [(ngModel)]="form.slug" />
              </label>
              <label>
                Page title
                <input type="text" name="title" [(ngModel)]="form.title" required />
              </label>
              <label>
                Sort order
                <input type="number" min="1" name="sort_order" [(ngModel)]="form.sort_order" />
              </label>
              <label class="full-span">
                Hero title
                <input type="text" name="hero_title" [(ngModel)]="form.hero_title" />
              </label>
              <label class="full-span">
                Hero subtitle
                <textarea rows="2" name="hero_subtitle" [(ngModel)]="form.hero_subtitle"></textarea>
              </label>
              <label class="full-span">
                Summary text
                <textarea rows="2" name="summary_text" [(ngModel)]="form.summary_text" placeholder="Short summary for homepage cards and section previews"></textarea>
              </label>
              <label class="full-span">
                Cover image URL
                <input type="text" name="cover_image_url" [(ngModel)]="form.cover_image_url" placeholder="https://... or banner image link" />
              </label>
              <label class="full-span">
                Page body HTML
                <textarea rows="8" name="body_html" [(ngModel)]="form.body_html"></textarea>
              </label>
              <label class="full-span">
                SEO title
                <input type="text" name="seo_title" [(ngModel)]="form.seo_title" />
              </label>
              <label class="full-span">
                SEO description
                <textarea rows="3" name="seo_description" [(ngModel)]="form.seo_description"></textarea>
              </label>
              <label>
                Publish status
                <select name="is_published" [(ngModel)]="form.is_published">
                  <option [ngValue]="1">Published</option>
                  <option [ngValue]="0">Draft</option>
                </select>
              </label>
              <label>
                Show on homepage
                <select name="show_on_home" [(ngModel)]="form.show_on_home">
                  <option [ngValue]="1">Yes</option>
                  <option [ngValue]="0">No</option>
                </select>
              </label>
              <label class="full-span route-preview">
                Shareable route preview
                <input type="text" [value]="'/?site=' + context.activeInstitute().code.toLowerCase() + '&page=' + (form.slug || 'home')" readonly />
                <small>Add section ids inside HTML like <code>&lt;section id="admission-process"&gt;</code> to share direct section links.</small>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update page' : 'Create page') }}
              </button>
            </div>
          </form>
        </div>
      }
    </section>
  `,
  styleUrl: './website-cms.component.scss',
})
export class WebsiteCmsComponent {
  protected readonly context = inject(AppContextService);
  private readonly websiteService = inject(WebsiteCmsService);

  protected readonly pages = signal<WebsitePage[]>([]);
  protected readonly selectedPage = signal<WebsitePage | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);

  protected readonly menuGroupOptions = ['Home', 'About', 'Academics', 'Departments', 'Admissions', 'Facilities', 'IQAC', 'Library', 'Alumni', 'Students', 'Contact', 'General'];

  protected form: WebsitePagePayload = this.createEmptyForm();

  constructor() {
    effect(() => {
      void this.load(this.context.activeInstitute().id);
    });
  }

  protected selectPage(page: WebsitePage): void {
    this.selectedPage.set(page);
  }

  protected isPublished(page: WebsitePage): boolean {
    return Number(page.is_published) === 1;
  }

  protected isHomeCard(page: WebsitePage): boolean {
    return Number(page.show_on_home ?? 1) === 1;
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form = this.createEmptyForm();
    this.showModal.set(true);
  }

  protected openEdit(page: WebsitePage): void {
    this.editingId.set(page.id);
    this.form = {
      slug: page.slug,
      nav_label: page.nav_label || '',
      menu_group: page.menu_group || 'General',
      title: page.title,
      hero_title: page.hero_title || '',
      hero_subtitle: page.hero_subtitle || '',
      summary_text: page.summary_text || '',
      cover_image_url: page.cover_image_url || '',
      body_html: page.body_html || '',
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      is_published: Number(page.is_published),
      show_on_home: Number(page.show_on_home ?? 1),
      sort_order: Number(page.sort_order),
    };
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.form = this.createEmptyForm();
  }

  protected async savePage(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: WebsitePagePayload = {
        ...this.form,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingId()) {
        await this.websiteService.updatePage(this.editingId()!, payload);
      } else {
        await this.websiteService.createPage(payload);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Website page updated successfully.' });
      this.closeModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the page content and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async deletePage(page: WebsitePage): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete page?',
      text: `Remove ${page.title} from the public website?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.websiteService.deletePage(page.id);
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Website page removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this page right now.',
      });
    }
  }

  protected async previewPublicSite(): Promise<void> {
    const code = this.context.activeInstitute().code.toLowerCase();
    window.open(`/?site=${code}`, '_blank', 'noopener');
  }

  private createEmptyForm(): WebsitePagePayload {
    return {
      slug: '',
      nav_label: '',
      menu_group: 'General',
      title: '',
      hero_title: '',
      hero_subtitle: '',
      summary_text: '',
      cover_image_url: '',
      body_html: '<section id="overview"><h2>New page</h2><p>Add your content here.</p></section>',
      seo_title: '',
      seo_description: '',
      is_published: 1,
      show_on_home: 1,
      sort_order: 1,
    };
  }

  private async load(instituteId: number): Promise<void> {
    const response = await this.websiteService.getPages(instituteId);
    this.pages.set(response.pages);

    const currentId = this.selectedPage()?.id;
    this.selectedPage.set(
      response.pages.find((page) => page.id === currentId) ?? response.pages[0] ?? null,
    );
  }
}

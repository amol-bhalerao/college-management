import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';

import { WebsiteCmsService, WebsitePage } from '../../core/services/website-cms.service';

@Component({
  selector: 'app-public-website',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="public-site">
      @if (siteError()) {
        <div class="state-card">
          <h1>Public site not available</h1>
          <p>{{ siteError() }}</p>
        </div>
      } @else if (siteData(); as site) {
        <header class="site-header">
          <div>
            <p class="eyebrow">Institute website</p>
            <h1>{{ site.institute.header_title || site.institute.name }}</h1>
            <p>{{ site.institute.header_subtitle || 'Academic excellence, student support, and transparent digital services.' }}</p>
          </div>

          <div class="site-actions">
            <a class="ghost-btn" href="/login">ERP Login</a>
            @if (site.institute.website_url) {
              <a class="primary-btn" [href]="site.institute.website_url" target="_blank" rel="noreferrer">Official URL</a>
            }
          </div>
        </header>

        <nav class="site-nav">
          @for (page of site.pages; track page.id) {
            <button type="button" [class.active]="selectedPage()?.id === page.id" (click)="openPage(page)">
              {{ page.nav_label || page.title }}
            </button>
          }
        </nav>

        @if (selectedPage(); as page) {
          <section class="hero-card">
            <span class="seo-chip">SEO ready</span>
            <h2>{{ page.hero_title || page.title }}</h2>
            <p>{{ page.hero_subtitle || page.seo_description || 'Welcome to our institute public information page.' }}</p>
          </section>

          <div class="content-layout">
            <article class="content-card">
              <div class="content-meta">
                <span>/{{ page.slug }}</span>
                <strong>{{ page.title }}</strong>
              </div>
              <div class="html-body" [innerHTML]="page.body_html || '<p>No content added yet.</p>'"></div>
            </article>

            <aside class="sidebar-card">
              <div>
                <h3>Contact & info</h3>
                <p>{{ site.institute.header_address || 'Address will appear here.' }}</p>
                <small>{{ site.institute.contact_phone || 'Phone pending' }} · {{ site.institute.contact_email || 'Email pending' }}</small>
              </div>

              <div>
                <h3>SEO preview</h3>
                <strong>{{ page.seo_title || page.title }}</strong>
                <p>{{ page.seo_description || 'SEO description not added yet.' }}</p>
              </div>

              <div>
                <h3>Quick highlights</h3>
                <ul>
                  <li>Admissions & scholarship guidance</li>
                  <li>Verified receipt and certificate support</li>
                  <li>IQAC / NAAC aligned records</li>
                </ul>
              </div>
            </aside>
          </div>
        }

        <footer class="site-footer">
          <strong>{{ site.institute.name }}</strong>
          <span>{{ site.institute.footer_note || 'Digital-first college services for students, parents, and administrators.' }}</span>
        </footer>
      } @else {
        <div class="state-card">
          <h1>Loading website...</h1>
          <p>Please wait while the public page content is loading.</p>
        </div>
      }
    </section>
  `,
  styleUrl: './public-website.component.scss',
})
export class PublicWebsiteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly websiteService = inject(WebsiteCmsService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly siteData = signal<Awaited<ReturnType<WebsiteCmsService['getPublicSite']>> | null>(null);
  protected readonly selectedPage = signal<WebsitePage | null>(null);
  protected readonly siteError = signal<string | null>(null);

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const code = params.get('code') ?? '';
      const slug = query.get('page') ?? '';
      void this.loadSite(code, slug);
    });
  }

  protected openPage(page: WebsitePage): void {
    this.selectedPage.set(page);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page.slug },
      queryParamsHandling: 'merge',
    });
    this.applySeo(page);
  }

  private async loadSite(code: string, slug: string): Promise<void> {
    try {
      this.siteError.set(null);
      const site = await this.websiteService.getPublicSite(code);
      this.siteData.set(site);

      const selected = site.pages.find((page) => page.slug === slug) ?? site.pages[0] ?? null;
      this.selectedPage.set(selected);

      if (selected) {
        this.applySeo(selected);
      } else {
        this.title.setTitle(site.institute.name);
      }
    } catch (error: any) {
      this.siteData.set(null);
      this.selectedPage.set(null);
      this.siteError.set(error?.error?.message || 'The institute website could not be loaded.');
      this.title.setTitle('Public site unavailable');
    }
  }

  private applySeo(page: WebsitePage): void {
    this.title.setTitle(page.seo_title || page.title);
    this.meta.updateTag({ name: 'description', content: page.seo_description || page.hero_subtitle || page.title });
  }
}

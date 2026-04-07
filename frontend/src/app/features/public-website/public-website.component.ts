import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';

import { WebsiteCmsService, WebsitePage } from '../../core/services/website-cms.service';

interface PublicMenuGroup {
  label: string;
  pages: WebsitePage[];
}

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
        <div class="top-strip">
          <div class="top-strip__left">
            <span>📍 {{ site.institute.header_address || 'Campus address will appear here.' }}</span>
            <span>☎ {{ site.institute.contact_phone || 'Office phone pending' }}</span>
            <span>✉ {{ site.institute.contact_email || 'Email pending' }}</span>
          </div>
          <div class="top-strip__right">
            <span class="status-pill">{{ site.institute.code }}</span>
            <span class="status-pill">NAAC / IQAC Ready</span>
          </div>
        </div>

        <header class="site-header hero-panel">
          <div class="hero-copy">
            <p class="eyebrow">Institute website</p>
            <h1>{{ site.institute.header_title || site.institute.name }}</h1>
            <p class="hero-text">{{ site.institute.header_subtitle || 'Transparent admissions, academic services, student support, and quality-focused public information.' }}</p>

            <div class="site-actions">
              <a class="primary-btn" href="/login">ERP Login</a>
              @if (site.institute.website_url) {
                <a class="ghost-btn" [href]="site.institute.website_url" target="_blank" rel="noreferrer">Official URL</a>
              }
            </div>
          </div>

          <div class="hero-stats">
            @for (card of highlightCards(); track card.label) {
              <article>
                <span>{{ card.label }}</span>
                <strong>{{ card.value }}</strong>
                <small>{{ card.detail }}</small>
              </article>
            }
          </div>
        </header>

        <nav class="site-nav">
          @for (group of menuGroups(); track group.label) {
            <section class="nav-group">
              <div class="nav-group__title" [class.active]="activeMenuGroup() === group.label">{{ group.label }}</div>
              <div class="nav-group__links">
                @for (page of group.pages; track page.id) {
                  <button type="button" [class.active]="selectedPage()?.id === page.id" (click)="openPage(page)">
                    {{ pageLabel(page) }}
                  </button>
                }
              </div>
            </section>
          }
        </nav>

        <section class="spotlight-grid">
          <article class="hero-card">
            @if (selectedPage(); as page) {
              <span class="seo-chip">{{ page.menu_group || 'General' }}</span>
              <h2>{{ page.hero_title || page.title }}</h2>
              <p>{{ page.hero_subtitle || page.seo_description || 'Welcome to our institute public information page.' }}</p>
            } @else {
              <span class="seo-chip">Public profile</span>
              <h2>Explore our campus</h2>
              <p>Browse admissions, academics, facilities, student support services, and institute updates.</p>
            }
          </article>

          <aside class="notice-card">
            <h3>Quick access</h3>
            <div class="quick-links">
              @for (link of relatedPages(); track link.id) {
                <button type="button" class="link-chip" (click)="openPage(link)">{{ pageLabel(link) }}</button>
              }
            </div>

            <div class="notice-box">
              <strong>Principal's Desk</strong>
              <p>{{ site.institute.principal_name || 'Principal information will appear here.' }}</p>
              <small>{{ site.institute.footer_note || 'Academic quality, discipline, and student support remain our focus.' }}</small>
            </div>
          </aside>
        </section>

        @if (selectedPage(); as page) {
          <div class="content-layout">
            <article class="content-card">
              <div class="content-meta">
                <span>/{{ page.slug }}</span>
                <strong>{{ page.title }}</strong>
                <small>{{ page.menu_group || 'General information' }}</small>
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
                <h3>Explore sections</h3>
                <ul>
                  @for (group of featuredMenus(); track group.label) {
                    <li>
                      <button type="button" class="mini-link" (click)="openPage(group.pages[0])">{{ group.label }}</button>
                    </li>
                  }
                </ul>
              </div>
            </aside>
          </div>
        }

        <section class="section-grid">
          @for (group of featuredMenus(); track group.label) {
            <article class="section-card">
              <span>{{ group.label }}</span>
              <strong>{{ group.pages.length }} page{{ group.pages.length > 1 ? 's' : '' }}</strong>
              <p>{{ pageSummary(group.pages[0]) }}</p>
              <button type="button" class="link-chip" (click)="openPage(group.pages[0])">Open {{ group.label }}</button>
            </article>
          }
        </section>

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

  protected readonly menuGroups = computed<PublicMenuGroup[]>(() => {
    const site = this.siteData();
    if (!site) {
      return [];
    }

    const grouped = new Map<string, WebsitePage[]>();

    for (const page of site.pages) {
      const label = (page.menu_group || 'General').trim() || 'General';
      grouped.set(label, [...(grouped.get(label) ?? []), page]);
    }

    return Array.from(grouped.entries()).map(([label, pages]) => ({
      label,
      pages: [...pages].sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || a.title.localeCompare(b.title)),
    }));
  });

  protected readonly activeMenuGroup = computed(() => this.selectedPage()?.menu_group?.trim() || this.menuGroups()[0]?.label || 'General');

  protected readonly highlightCards = computed(() => {
    const site = this.siteData();
    if (!site) {
      return [];
    }

    return [
      { label: 'Menu Sections', value: String(this.menuGroups().length), detail: 'About, Academics, Admissions and more' },
      { label: 'Published Pages', value: String(site.pages.length), detail: 'Public information managed from CMS' },
      { label: 'Help Desk', value: site.institute.contact_phone || 'Office', detail: site.institute.contact_email || 'Email support available' },
      { label: 'Campus Focus', value: 'Student First', detail: 'Scholarship, IQAC and transparent services' },
    ];
  });

  protected readonly featuredMenus = computed(() => this.menuGroups().filter((group) => group.pages.length > 0).slice(0, 6));

  protected readonly relatedPages = computed(() => {
    const selected = this.selectedPage();
    const groups = this.menuGroups();

    if (selected) {
      const sameGroup = groups.find((group) => group.label === (selected.menu_group || '').trim())?.pages ?? [];
      const related = sameGroup.filter((page) => page.id !== selected.id).slice(0, 6);
      if (related.length) {
        return related;
      }
    }

    return groups.flatMap((group) => group.pages).filter((page) => page.id !== selected?.id).slice(0, 6);
  });

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const code = query.get('site') ?? params.get('code') ?? '';
      const slug = query.get('page') ?? 'home';
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

  protected pageLabel(page: WebsitePage): string {
    return page.nav_label || page.title;
  }

  protected pageSummary(page?: WebsitePage | null): string {
    if (!page) {
      return 'Public section details will appear here.';
    }

    const text = this.plainText(page.hero_subtitle || page.seo_description || page.body_html || page.title);
    return text.length > 140 ? `${text.slice(0, 137)}...` : text;
  }

  private async loadSite(code: string, slug: string): Promise<void> {
    try {
      this.siteError.set(null);
      const site = await this.websiteService.getPublicSite(code);
      this.siteData.set(site);

      const selected = site.pages.find((page) => page.slug === slug)
        ?? site.pages.find((page) => page.slug === 'home')
        ?? site.pages[0]
        ?? null;
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

  private plainText(value: string): string {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

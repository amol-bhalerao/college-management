import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';

import { WebsiteCmsService, WebsitePage } from '../../core/services/website-cms.service';

interface PublicMenuGroup {
  label: string;
  pages: WebsitePage[];
}

interface PageSectionLink {
  id: string;
  label: string;
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

        <header class="site-header">
          <div class="brand-wrap">
            @if (site.institute.logo_url) {
              <img class="brand-logo" [src]="site.institute.logo_url" [alt]="site.institute.name" />
            } @else {
              <div class="brand-logo brand-logo--fallback">{{ site.institute.code }}</div>
            }

            <div class="brand-copy">
              <p class="eyebrow">Institute website</p>
              <h1>{{ site.institute.header_title || site.institute.name }}</h1>
              <p class="hero-text">{{ site.institute.header_subtitle || 'Transparent admissions, academic services, student support, and quality-focused public information.' }}</p>
            </div>
          </div>

          <div class="site-actions">
            <a class="primary-btn" href="/login">ERP Login</a>
            @if (site.institute.website_url) {
              <a class="ghost-btn" [href]="site.institute.website_url" target="_blank" rel="noreferrer">Official URL</a>
            }
          </div>
        </header>

        <nav class="main-menu-bar">
          @for (group of menuGroups(); track group.label) {
            <button type="button" [class.active]="activeMenuGroup() === group.label" (click)="openMenuGroup(group)">
              {{ group.label }}
            </button>
          }
        </nav>

        <div class="public-layout">
          <aside class="left-sidebar">
            <section class="sidebar-panel">
              <h3>{{ activeMenuGroup() }}</h3>
              <div class="sidebar-links">
                @for (page of activeGroupPages(); track page.id) {
                  <button type="button" [class.active]="selectedPage()?.id === page.id" (click)="openPage(page)">
                    {{ pageLabel(page) }}
                  </button>
                }
              </div>
            </section>

            <section class="sidebar-panel">
              <h3>Important links</h3>
              <div class="sidebar-links">
                @for (page of importantPages(); track page.id) {
                  <button type="button" class="mini-link" (click)="openPage(page)">{{ pageLabel(page) }}</button>
                }
              </div>
            </section>

            @if (pageSections().length) {
              <section class="sidebar-panel">
                <h3>On this page</h3>
                <div class="sidebar-links">
                  @for (section of pageSections(); track section.id) {
                    <button type="button" [class.active]="currentSection() === section.id" (click)="goToSection(section.id)">
                      {{ section.label }}
                    </button>
                  }
                </div>
                <small class="share-note">Shareable route: {{ sharePath(currentSection()) }}</small>
              </section>
            }
          </aside>

          <div class="content-stack">
            <section class="carousel-card">
              @if (currentSlide(); as slide) {
                <div class="carousel-visual" [style.background-image]="slideBackground(slide)">
                  <div class="carousel-copy">
                    <span class="seo-chip">{{ slide.menu_group || 'Home' }}</span>
                    <h2>{{ slide.hero_title || slide.title }}</h2>
                    <p>{{ slide.summary_text || slide.hero_subtitle || slide.seo_description || 'Dynamic public content managed by super admin.' }}</p>
                    <div class="carousel-actions">
                      <button type="button" class="primary-btn" (click)="openPage(slide)">Open section</button>
                      <button type="button" class="ghost-btn" (click)="nextSlide(1)">Next slide</button>
                    </div>
                  </div>
                </div>

                <div class="carousel-dots">
                  @for (item of featuredPages(); track item.id; let i = $index) {
                    <button type="button" [class.active]="activeSlideIndex() === i" (click)="openSlide(i)">
                      {{ pageLabel(item) }}
                    </button>
                  }
                </div>
              }
            </section>

            <section class="cards-grid">
              @for (card of homeCards(); track card.id) {
                <article class="info-card">
                  @if (card.cover_image_url) {
                    <img class="card-image" [src]="card.cover_image_url" [alt]="card.title" />
                  }
                  <span>{{ card.menu_group || 'Section' }}</span>
                  <strong>{{ card.hero_title || card.title }}</strong>
                  <p>{{ pageSummary(card) }}</p>
                  <button type="button" class="mini-link" (click)="openPage(card)">View more</button>
                </article>
              }
            </section>

            @if (selectedPage(); as page) {
              <section class="page-surface">
                <article class="content-card">
                  <div class="content-meta">
                    <span>/{{ page.slug }}</span>
                    <strong>{{ page.title }}</strong>
                    <small>{{ page.menu_group || 'General' }} · {{ sharePath() }}</small>
                  </div>
                  <div class="html-body" [innerHTML]="page.body_html || '<p>No content added yet.</p>'"></div>
                </article>

                <aside class="right-rail">
                  <div class="sidebar-panel">
                    <h3>Contact & info</h3>
                    <p>{{ site.institute.header_address || 'Address will appear here.' }}</p>
                    <small>{{ site.institute.contact_phone || 'Phone pending' }} · {{ site.institute.contact_email || 'Email pending' }}</small>
                  </div>

                  <div class="sidebar-panel">
                    <h3>Principal's Desk</h3>
                    <strong>{{ site.institute.principal_name || 'Principal' }}</strong>
                    <p>{{ site.institute.footer_note || 'Academic quality, discipline, and student support remain our focus.' }}</p>
                  </div>

                  <div class="sidebar-panel">
                    <h3>SEO preview</h3>
                    <strong>{{ page.seo_title || page.title }}</strong>
                    <p>{{ page.seo_description || 'SEO description not added yet.' }}</p>
                  </div>
                </aside>
              </section>
            }

            <section class="section-grid">
              @for (group of menuGroups().slice(0, 6); track group.label) {
                <article class="section-card">
                  <span>{{ group.label }}</span>
                  <strong>{{ group.pages.length }} page{{ group.pages.length > 1 ? 's' : '' }}</strong>
                  <p>{{ pageSummary(group.pages[0]) }}</p>
                  <button type="button" class="link-chip" (click)="openPage(group.pages[0])">Open {{ group.label }}</button>
                </article>
              }
            </section>
          </div>
        </div>

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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly siteData = signal<Awaited<ReturnType<WebsiteCmsService['getPublicSite']>> | null>(null);
  protected readonly selectedPage = signal<WebsitePage | null>(null);
  protected readonly siteError = signal<string | null>(null);
  protected readonly activeSlideIndex = signal(0);
  protected readonly currentSection = signal('');

  protected readonly menuGroups = computed<PublicMenuGroup[]>(() => {
    const site = this.siteData();
    if (!site) {
      return [];
    }

    const order = ['Home', 'About', 'Academics', 'Departments', 'Admissions', 'Facilities', 'IQAC', 'Library', 'Alumni', 'Students', 'Contact', 'General'];
    const grouped = new Map<string, WebsitePage[]>();

    for (const page of site.pages) {
      const label = (page.menu_group || 'General').trim() || 'General';
      grouped.set(label, [...(grouped.get(label) ?? []), page]);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => {
        const aIndex = order.indexOf(a[0]);
        const bIndex = order.indexOf(b[0]);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex) || a[0].localeCompare(b[0]);
      })
      .map(([label, pages]) => ({
        label,
        pages: [...pages].sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || a.title.localeCompare(b.title)),
      }));
  });

  protected readonly activeMenuGroup = computed(() => this.selectedPage()?.menu_group?.trim() || this.menuGroups()[0]?.label || 'Home');
  protected readonly activeGroupPages = computed(() => this.menuGroups().find((group) => group.label === this.activeMenuGroup())?.pages ?? []);
  protected readonly featuredPages = computed(() => {
    const site = this.siteData();
    if (!site) {
      return [];
    }

    const featured = site.pages.filter((page) => Number(page.show_on_home ?? 1) === 1);
    return (featured.length ? featured : site.pages).slice(0, 6);
  });
  protected readonly currentSlide = computed(() => {
    const slides = this.featuredPages();
    if (!slides.length) {
      return null;
    }

    return slides[this.activeSlideIndex() % slides.length] ?? null;
  });
  protected readonly homeCards = computed(() => this.featuredPages().slice(0, 4));
  protected readonly importantPages = computed(() => {
    const selectedId = this.selectedPage()?.id;
    return (this.siteData()?.pages ?? []).filter((page) => page.id !== selectedId).slice(0, 8);
  });
  protected readonly pageSections = computed<PageSectionLink[]>(() => this.extractSections(this.selectedPage()?.body_html ?? ''));

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const code = query.get('site') ?? params.get('code') ?? '';
      const slug = query.get('page') ?? 'home';
      const section = query.get('section') ?? '';
      void this.loadSite(code, slug, section);
    });

    if (typeof window !== 'undefined') {
      const timer = window.setInterval(() => {
        const slides = this.featuredPages();
        if (slides.length > 1) {
          this.activeSlideIndex.update((index) => (index + 1) % slides.length);
        }
      }, 6000);

      this.destroyRef.onDestroy(() => window.clearInterval(timer));
    }
  }

  protected openMenuGroup(group: PublicMenuGroup): void {
    const firstPage = group.pages[0];
    if (firstPage) {
      this.openPage(firstPage);
    }
  }

  protected openPage(page: WebsitePage, sectionId = ''): void {
    this.selectedPage.set(page);
    this.currentSection.set(sectionId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page.slug, section: sectionId || null },
      queryParamsHandling: 'merge',
    });
    this.applySeo(page);

    if (sectionId) {
      this.scrollToSection(sectionId);
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected openSlide(index: number): void {
    const slides = this.featuredPages();
    if (!slides.length) {
      return;
    }

    const nextIndex = ((index % slides.length) + slides.length) % slides.length;
    this.activeSlideIndex.set(nextIndex);
    this.openPage(slides[nextIndex]);
  }

  protected nextSlide(step: number): void {
    const slides = this.featuredPages();
    if (!slides.length) {
      return;
    }

    this.activeSlideIndex.update((index) => (index + step + slides.length) % slides.length);
  }

  protected goToSection(sectionId: string): void {
    this.currentSection.set(sectionId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: sectionId },
      queryParamsHandling: 'merge',
    });
    this.scrollToSection(sectionId);
  }

  protected pageLabel(page: WebsitePage): string {
    return page.nav_label || page.title;
  }

  protected pageSummary(page?: WebsitePage | null): string {
    if (!page) {
      return 'Public section details will appear here.';
    }

    const text = this.plainText(page.summary_text || page.hero_subtitle || page.seo_description || page.body_html || page.title);
    return text.length > 160 ? `${text.slice(0, 157)}...` : text;
  }

  protected slideBackground(page: WebsitePage): string {
    const image = page.cover_image_url || this.siteData()?.institute.logo_url || 'https://placehold.co/1200x500/e0e7ff/1e3a8a?text=College+Website';
    return `linear-gradient(120deg, rgba(15, 23, 42, 0.78), rgba(29, 78, 216, 0.40)), url('${image}')`;
  }

  protected sharePath(sectionId = ''): string {
    const siteCode = (this.route.snapshot.queryParamMap.get('site') || this.route.snapshot.paramMap.get('code') || this.siteData()?.institute.code || '').toLowerCase();
    const params = [`site=${encodeURIComponent(siteCode)}`, `page=${encodeURIComponent(this.selectedPage()?.slug || 'home')}`];

    if (sectionId) {
      params.push(`section=${encodeURIComponent(sectionId)}`);
    }

    return `/?${params.join('&')}`;
  }

  private async loadSite(code: string, slug: string, section: string): Promise<void> {
    try {
      this.siteError.set(null);
      const site = await this.websiteService.getPublicSite(code);
      this.siteData.set(site);

      const selected = site.pages.find((page) => page.slug === slug)
        ?? site.pages.find((page) => page.slug === 'home')
        ?? site.pages[0]
        ?? null;
      this.selectedPage.set(selected);
      this.currentSection.set(section);

      const slideIndex = this.featuredPages().findIndex((page) => page.slug === (selected?.slug ?? ''));
      this.activeSlideIndex.set(slideIndex >= 0 ? slideIndex : 0);

      if (selected) {
        this.applySeo(selected);
      } else {
        this.title.setTitle(site.institute.name);
      }

      if (section) {
        this.scrollToSection(section);
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

  private scrollToSection(sectionId: string): void {
    if (!sectionId || typeof window === 'undefined') {
      return;
    }

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  private extractSections(bodyHtml: string): PageSectionLink[] {
    if (!bodyHtml) {
      return [];
    }

    return Array.from(bodyHtml.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi)).map((match) => ({
      id: match[1],
      label: this.extractHeading(match[2]) || this.humanize(match[1]),
    }));
  }

  private extractHeading(html: string): string {
    const match = html.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
    return this.plainText(match?.[1] || '');
  }

  private humanize(value: string): string {
    return value
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (part) => part.toUpperCase())
      .trim();
  }

  private plainText(value: string): string {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

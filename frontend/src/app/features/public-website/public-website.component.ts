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

interface PublicNavLink {
  label: string;
  page: WebsitePage | null;
  sectionId?: string;
  children?: PublicNavLink[];
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
              
              <h1>{{ site.institute.header_title || site.institute.name }}</h1>
              <p class="hero-text">{{ site.institute.header_subtitle || 'Transparent admissions, academic services, student support, and quality-focused public information.' }}</p>
            </div>
          </div>

          <div class="site-actions">
            <a class="primary-btn" href="/login">Login</a>
           
          </div>
        </header>

        <nav class="main-menu-bar">
          <button type="button" class="menu-toggle" [class.open]="mobileMenuOpen()" (click)="toggleMobileMenu()">
            <span>☰</span>
            <span>{{ mobileMenuOpen() ? 'Close Menu' : 'Menu' }}</span>
          </button>

          <div class="main-menu-shell" [class.open]="mobileMenuOpen()">
            @for (item of primaryNav(); track item.page?.id || item.label) {
              <div class="nav-item" [class.active]="isNavActive(item)" [class.open]="openDropdownLabel() === item.label">
                <button
                  type="button"
                  class="nav-trigger"
                  [attr.aria-expanded]="item.children?.length ? openDropdownLabel() === item.label : null"
                  (click)="handleNavClick(item)">
                  <span>{{ item.label }}</span>
                  @if (item.children?.length) {
                    <span class="nav-caret">▾</span>
                  }
                </button>

                @if (item.children?.length && openDropdownLabel() === item.label) {
                  <div class="dropdown-panel" [class.dropdown-panel--wide]="hasNestedChildren(item)">
                    @if (item.page) {
                      <button type="button" class="dropdown-link dropdown-link--overview" (click)="openNavLink(item)">
                        {{ item.label }} Overview
                      </button>
                    }

                    @for (child of item.children ?? []; track child.page?.id || child.label) {
                      @if (child.children?.length) {
                        <div class="dropdown-group">
                          <button type="button" class="dropdown-link dropdown-link--group" (click)="openNavLink(child)">
                            {{ child.label }}
                          </button>
                          <div class="dropdown-subgrid">
                            @for (grandChild of child.children ?? []; track grandChild.page?.id || grandChild.label) {
                              <button type="button" class="dropdown-link dropdown-link--sub" (click)="openNavLink(grandChild)">
                                {{ grandChild.label }}
                              </button>
                            }
                          </div>
                        </div>
                      } @else {
                        <button type="button" class="dropdown-link" (click)="openNavLink(child)">
                          {{ child.label }}
                        </button>
                      }
                    }
                  </div>
                }
              </div>
            }
          </div>
        </nav>

        <div class="public-layout">
          <div class="content-stack">
            @if (isHomePage()) {
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

              @if (noticePages().length) {
                <section class="notice-strip">
                  <strong>Latest notices</strong>
                  <div class="notice-scroll">
                    @for (item of noticePages(); track item.id) {
                      <button type="button" class="notice-chip" (click)="openPage(item)">
                        {{ pageLabel(item) }}
                      </button>
                    }
                  </div>
                </section>
              }

              <section class="cards-grid">
                @for (card of homeCards(); track card.id) {
                  <article class="info-card animate-card">
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
                @if (pageSections().length) {
                  <section class="section-jump-bar">
                    <strong>Quick links</strong>
                    <div class="section-jump-list">
                      @for (section of pageSections(); track section.id) {
                        <button type="button" [class.active]="currentSection() === section.id" (click)="goToSection(section.id)">
                          {{ section.label }}
                        </button>
                      }
                    </div>
                  </section>
                }

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
                      <h3>Principal's Desk</h3>
                      <strong>{{ site.institute.principal_name || 'Principal' }}</strong>
                      <p>{{ site.institute.footer_note || 'Academic quality, discipline, and student support remain our focus.' }}</p>
                    </div>

                    <div class="sidebar-panel">
                      <h3>Downloads & resources</h3>
                      <div class="sidebar-links">
                        @for (item of resourcePages(); track item.id) {
                          <button type="button" class="mini-link" (click)="openPage(item)">{{ pageLabel(item) }}</button>
                        }
                      </div>
                    </div>

                    <div class="sidebar-panel">
                      <h3>Quality & governance</h3>
                      <div class="sidebar-links">
                        @for (item of governancePages(); track item.id) {
                          <button type="button" class="mini-link" (click)="openPage(item)">{{ pageLabel(item) }}</button>
                        }
                      </div>
                    </div>
                  </aside>
                </section>
              }

              <section class="section-grid">
                @for (group of menuGroups().slice(0, 8); track group.label) {
                  <article class="section-card">
                    <span>{{ group.label }}</span>
                    <strong>{{ group.pages.length }} page{{ group.pages.length > 1 ? 's' : '' }}</strong>
                    <p>{{ pageSummary(group.pages[0]) }}</p>
                    <button type="button" class="link-chip" (click)="openPage(group.pages[0])">Open {{ group.label }}</button>
                  </article>
                }
              </section>
            } @else if (selectedPage(); as page) {
              <section class="page-hero-card">
                <div class="page-hero-card__image" [style.background-image]="slideBackground(page)"></div>
                <div class="page-hero-card__content">
                  <span class="page-badge">{{ page.menu_group || 'General' }}</span>
                  <h2>{{ page.hero_title || page.title }}</h2>
                  <p>{{ page.summary_text || page.hero_subtitle || page.seo_description || 'Dynamic page managed by super admin.' }}</p>
                  <div class="carousel-actions">
                    @if (pageSections().length) {
                      <button type="button" class="primary-btn" (click)="goToSection(pageSections()[0].id)">Jump to first section</button>
                    }
                    @if (homePage(); as rootPage) {
                      <button type="button" class="ghost-btn" (click)="openPage(rootPage)">Back to home</button>
                    }
                  </div>
                </div>
              </section>

              @if (pageSections().length) {
                <section class="section-jump-bar">
                  <strong>Quick links</strong>
                  <div class="section-jump-list">
                    @for (section of pageSections(); track section.id) {
                      <button type="button" [class.active]="currentSection() === section.id" (click)="goToSection(section.id)">
                        {{ section.label }}
                      </button>
                    }
                  </div>
                </section>
              }

              <section class="page-surface">
                <article class="content-card">
                  <div class="content-meta">
                    <span>/{{ page.slug }}</span>
                    <strong>{{ page.title }}</strong>
                    <small>{{ page.menu_group || 'General' }} · {{ sharePath(currentSection()) }}</small>
                  </div>
                  <div class="html-body" [innerHTML]="page.body_html || '<p>No content added yet.</p>'"></div>
                </article>

                <aside class="right-rail">
                  <div class="sidebar-panel">
                    <h3>Share this page</h3>
                    <small class="share-note">{{ sharePath(currentSection()) }}</small>
                  </div>

                  <div class="sidebar-panel">
                    <h3>Related pages</h3>
                    <div class="sidebar-links">
                      @for (item of importantPages(); track item.id) {
                        <button type="button" class="mini-link" (click)="openPage(item)">{{ pageLabel(item) }}</button>
                      }
                    </div>
                  </div>

                  <div class="sidebar-panel">
                    <h3>Contact & info</h3>
                    <p>{{ site.institute.header_address || 'Address will appear here.' }}</p>
                    <small>{{ site.institute.contact_phone || 'Phone pending' }} · {{ site.institute.contact_email || 'Email pending' }}</small>
                  </div>
                </aside>
              </section>
            }
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
  protected readonly mobileMenuOpen = signal(false);
  protected readonly openDropdownLabel = signal('');

  protected readonly menuGroups = computed<PublicMenuGroup[]>(() => {
    const site = this.siteData();
    if (!site) {
      return [];
    }

    const order = ['Home', 'About', 'Code of Conduct', 'Academics', 'Departments', 'College Cells', 'Alumni', 'IQAC', 'Gallery', 'Other', 'Contact', 'General'];
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

  protected readonly homePage = computed(() => (this.siteData()?.pages ?? []).find((page) => page.slug === 'home') ?? this.siteData()?.pages?.[0] ?? null);
  protected readonly primaryNav = computed<PublicNavLink[]>(() => {
    const pages = (this.siteData()?.pages ?? []).filter((page) => Number(page.show_in_nav ?? 1) === 1);
    const pageMap = new Map<number, WebsitePage>(pages.map((page) => [page.id, page]));
    const childrenByParent = new Map<number, WebsitePage[]>();
    const roots: WebsitePage[] = [];

    for (const page of pages) {
      const parentId = Number(page.parent_page_id ?? 0);
      if (parentId > 0 && pageMap.has(parentId)) {
        childrenByParent.set(parentId, [...(childrenByParent.get(parentId) ?? []), page]);
      } else {
        roots.push(page);
      }
    }

    const sortPages = (items: WebsitePage[]) => [...items].sort(
      (a, b) => Number(a.sort_order) - Number(b.sort_order) || this.pageLabel(a).localeCompare(this.pageLabel(b)),
    );

    const buildNode = (page: WebsitePage): PublicNavLink => ({
      label: this.pageLabel(page),
      page,
      children: sortPages(childrenByParent.get(page.id) ?? []).map(buildNode),
    });

    return sortPages(roots).map(buildNode);
  });
  protected readonly activeMenuGroup = computed(() => this.selectedPage()?.menu_group?.trim() || this.menuGroups()[0]?.label || 'Home');
  protected readonly isHomePage = computed(() => (this.selectedPage()?.slug ?? 'home') === (this.homePage()?.slug ?? 'home'));
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
  protected readonly noticePages = computed(() => (this.siteData()?.pages ?? []).filter((page) => ['Other', 'IQAC'].includes((page.menu_group || '').trim()) && ['notices', 'feedback', 'ssr'].includes(page.slug)).slice(0, 6));
  protected readonly resourcePages = computed(() => (this.siteData()?.pages ?? []).filter((page) => ['Gallery', 'About', 'Departments', 'Other'].includes((page.menu_group || '').trim())).slice(0, 6));
  protected readonly governancePages = computed(() => (this.siteData()?.pages ?? []).filter((page) => ['IQAC', 'Code of Conduct', 'Other'].includes((page.menu_group || '').trim())).slice(0, 6));
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

  protected toggleMobileMenu(): void {
    const nextState = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(nextState);
    if (!nextState) {
      this.openDropdownLabel.set('');
    }
  }

  protected handleNavClick(item: PublicNavLink): void {
    if (item.children?.length) {
      this.openDropdownLabel.update((current) => current === item.label ? '' : item.label);
      return;
    }

    this.openNavLink(item);
  }

  protected openNavLink(item: PublicNavLink): void {
    if (!item.page) {
      return;
    }

    this.mobileMenuOpen.set(false);
    this.openDropdownLabel.set('');
    this.openPage(item.page, item.sectionId || '');
  }

  protected isNavActive(item: PublicNavLink): boolean {
    const selectedId = this.selectedPage()?.id;
    return selectedId ? this.navContainsPage(item, selectedId) : false;
  }

  protected hasNestedChildren(item: PublicNavLink): boolean {
    return !!item.children?.some((child) => child.children?.length);
  }

  protected openPage(page: WebsitePage, sectionId = ''): void {
    this.selectedPage.set(page);
    this.mobileMenuOpen.set(false);
    this.openDropdownLabel.set('');
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

  private navContainsPage(item: PublicNavLink, selectedId: number): boolean {
    if (item.page?.id === selectedId) {
      return true;
    }

    return !!item.children?.some((child) => this.navContainsPage(child, selectedId));
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

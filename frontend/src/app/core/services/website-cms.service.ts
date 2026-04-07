import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { InstituteSettings } from './institute.service';

export interface WebsitePage {
  id: number;
  institute_id: number;
  slug: string;
  nav_label: string | null;
  menu_group: string | null;
  parent_page_id: number | null;
  title: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  summary_text: string | null;
  cover_image_url: string | null;
  body_html: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: number;
  show_on_home: number;
  show_in_nav: number;
  sort_order: number;
}

export interface WebsitePagePayload {
  institute_id?: number;
  slug?: string;
  nav_label?: string;
  menu_group?: string;
  parent_page_id?: number | null;
  title: string;
  hero_title?: string;
  hero_subtitle?: string;
  summary_text?: string;
  cover_image_url?: string;
  body_html?: string;
  seo_title?: string;
  seo_description?: string;
  is_published?: number;
  show_on_home?: number;
  show_in_nav?: number;
  sort_order?: number;
}

export interface WebsiteCmsResponse {
  institute: InstituteSettings;
  pages: WebsitePage[];
}

export interface PublicSiteResponse {
  institute: InstituteSettings;
  pages: WebsitePage[];
}

@Injectable({ providedIn: 'root' })
export class WebsiteCmsService {
  private readonly http = inject(HttpClient);

  async getPages(instituteId: number): Promise<WebsiteCmsResponse> {
    return firstValueFrom(
      this.http.get<WebsiteCmsResponse>(`${environment.apiBaseUrl}/website/pages/${instituteId}`),
    );
  }

  async createPage(payload: WebsitePagePayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/website/pages`, payload));
  }

  async updatePage(id: number, payload: Partial<WebsitePagePayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/website/pages/${id}`, payload));
  }

  async deletePage(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/website/pages/${id}`));
  }

  async getPublicSite(code = ''): Promise<PublicSiteResponse> {
    const suffix = code ? `/${code}` : '';
    return firstValueFrom(this.http.get<PublicSiteResponse>(`${environment.apiBaseUrl}/public/site${suffix}`));
  }
}

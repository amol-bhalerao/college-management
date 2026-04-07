import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface InstituteSettings {
  id: number;
  name: string;
  code: string;
  type: string;
  contact_email: string | null;
  contact_phone: string | null;
  receipt_prefix: string | null;
  header_title: string | null;
  header_subtitle: string | null;
  header_address: string | null;
  principal_name: string | null;
  footer_note: string | null;
  website_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class InstituteService {
  private readonly http = inject(HttpClient);

  async getSettings(instituteId: number): Promise<InstituteSettings> {
    const response = await firstValueFrom(
      this.http.get<{ institute: InstituteSettings }>(`${environment.apiBaseUrl}/institutes/${instituteId}/settings`),
    );

    return response.institute;
  }

  async updateSettings(instituteId: number, payload: Partial<InstituteSettings>): Promise<InstituteSettings> {
    const response = await firstValueFrom(
      this.http.put<{ institute: InstituteSettings }>(`${environment.apiBaseUrl}/institutes/${instituteId}/settings`, payload),
    );

    return response.institute;
  }
}

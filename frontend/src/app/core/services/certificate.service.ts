import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface CertificateSummary {
  total: number;
  issued: number;
  requested: number;
  verified: number;
}

export interface CertificateRow {
  id: number;
  request_number: string;
  certificate_type: string;
  purpose: string | null;
  status: string;
  verification_token: string | null;
  issued_on: string | null;
  requested_by: string | null;
  gr_number: string | null;
  first_name: string | null;
  last_name: string | null;
  institute_name: string | null;
}

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<CertificateSummary> {
    return firstValueFrom(
      this.http.get<CertificateSummary>(`${environment.apiBaseUrl}/certificates/summary/${instituteId}`),
    );
  }

  async getRequests(instituteId: number): Promise<CertificateRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ requests: CertificateRow[] }>(`${environment.apiBaseUrl}/certificates/${instituteId}`),
    );

    return response.requests;
  }

  async issueRequest(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/certificates/${id}/issue`, {}));
  }
}

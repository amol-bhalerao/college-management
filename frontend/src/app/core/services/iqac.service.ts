import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface IqacSummary {
  total: number;
  completed: number;
  evidenceReady: number;
  dueSoon: number;
}

export interface IqacMetricRow {
  id: number;
  institute_id: number;
  academic_year_id: number | null;
  criterion_code: string;
  title: string;
  owner: string | null;
  target_value: number;
  achieved_value: number;
  status: string;
  evidence_status: string;
  next_review_date: string | null;
  notes: string | null;
  institute_name: string | null;
  academic_year_label: string | null;
}

export interface IqacMetricPayload {
  institute_id?: number;
  academic_year_id?: number;
  criterion_code: string;
  title: string;
  owner?: string;
  target_value?: number;
  achieved_value?: number;
  status?: string;
  evidence_status?: string;
  next_review_date?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class IqacService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<IqacSummary> {
    return firstValueFrom(this.http.get<IqacSummary>(`${environment.apiBaseUrl}/iqac/summary/${instituteId}`));
  }

  async getMetrics(instituteId: number): Promise<IqacMetricRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ metrics: IqacMetricRow[] }>(`${environment.apiBaseUrl}/iqac/${instituteId}`),
    );

    return response.metrics;
  }

  async createMetric(payload: IqacMetricPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/iqac`, payload));
  }

  async updateMetric(id: number, payload: Partial<IqacMetricPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/iqac/${id}`, payload));
  }

  async deleteMetric(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/iqac/${id}`));
  }
}

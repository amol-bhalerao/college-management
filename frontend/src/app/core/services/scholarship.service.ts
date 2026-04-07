import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ScholarshipSummary {
  total: number;
  eligible: number;
  submitted: number;
  approved: number;
  expectedAmount: number;
}

export interface ScholarshipRow {
  id: number;
  student_id: number;
  institute_id: number;
  academic_year_id: number;
  scheme_name: string;
  status: string;
  is_eligible: number;
  expected_amount: number;
  gr_number: string | null;
  first_name: string | null;
  last_name: string | null;
  current_class: string | null;
  category: string | null;
  institute_name: string | null;
}

export interface ScholarshipPayload {
  student_id: number;
  scheme_name: string;
  status?: string;
  is_eligible?: number;
  expected_amount?: number;
}

@Injectable({ providedIn: 'root' })
export class ScholarshipService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<ScholarshipSummary> {
    return firstValueFrom(this.http.get<ScholarshipSummary>(`${environment.apiBaseUrl}/scholarships/summary/${instituteId}`));
  }

  async getApplications(instituteId: number): Promise<ScholarshipRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ applications: ScholarshipRow[] }>(`${environment.apiBaseUrl}/scholarships/${instituteId}`),
    );

    return response.applications;
  }

  async createApplication(payload: ScholarshipPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/scholarships`, payload));
  }

  async updateApplication(id: number, payload: Partial<ScholarshipPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/scholarships/${id}`, payload));
  }

  async deleteApplication(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/scholarships/${id}`));
  }
}

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

export interface StudentDirectoryItem {
  id: number;
  institute_id: number;
  academic_year_id: number;
  gr_number: string | null;
  first_name: string | null;
  last_name: string | null;
  guardian_name: string | null;
  mother_name: string | null;
  current_class: string | null;
  division: string | null;
  category: string | null;
  nationality: string | null;
  religion: string | null;
  caste_subcaste: string | null;
  mobile_number: string | null;
  email: string | null;
  dob: string | null;
  date_of_birth_words: string | null;
  place_of_birth: string | null;
  birth_taluka: string | null;
  birth_district: string | null;
  birth_state: string | null;
  previous_school: string | null;
  date_of_admission: string | null;
  date_of_leaving: string | null;
  class_last_attended: string | null;
  progress_status: string | null;
  conduct: string | null;
  reason_for_leaving: string | null;
  tc_remarks: string | null;
  address: string | null;
}

export interface CertificatePayload {
  student_id: number;
  institute_id?: number;
  academic_year_id?: number;
  certificate_type: string;
  purpose?: string;
  status?: string;
  requested_by?: string;
}

export interface CertificateRow extends StudentDirectoryItem {
  student_id: number;
  request_number: string;
  certificate_type: string;
  purpose: string | null;
  status: string;
  verification_token: string | null;
  issued_on: string | null;
  requested_by: string | null;
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

  async getStudents(instituteId: number): Promise<StudentDirectoryItem[]> {
    const response = await firstValueFrom(
      this.http.get<{ students: StudentDirectoryItem[] }>(`${environment.apiBaseUrl}/certificates/students/${instituteId}`),
    );

    return response.students;
  }

  async getRequests(instituteId: number): Promise<CertificateRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ requests: CertificateRow[] }>(`${environment.apiBaseUrl}/certificates/${instituteId}`),
    );

    return response.requests;
  }

  async createRequest(payload: CertificatePayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/certificates`, payload));
  }

  async updateRequest(id: number, payload: Partial<CertificatePayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/certificates/${id}`, payload));
  }

  async deleteRequest(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/certificates/${id}`));
  }

  async issueRequest(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/certificates/${id}/issue`, {}));
  }
}

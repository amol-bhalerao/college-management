import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface EnquirySummary {
  total: number;
  converted: number;
  new: number;
  followUp: number;
  conversionRate: number;
}

export interface EnquiryRow {
  id: number;
  enquiry_number: string;
  student_name: string;
  mobile_number: string | null;
  email: string | null;
  source: string | null;
  desired_course: string | null;
  current_class: string | null;
  category: string | null;
  status: string;
  assigned_to: string | null;
  follow_up_date: string | null;
  notes: string | null;
}

export interface AdmissionRecord {
  id: number;
  admission_number: string;
  status: string;
  admitted_on: string | null;
  remarks: string | null;
  student_name: string;
  gr_number: string | null;
  desired_course: string | null;
  institute_name: string | null;
}

export interface AdmissionWizardPayload {
  enquiry_id: number;
  first_name: string;
  last_name: string;
  guardian_name?: string;
  gender?: string;
  dob?: string;
  mobile_number?: string;
  email?: string;
  address?: string;
  current_class?: string;
  division?: string;
  category?: string;
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<EnquirySummary> {
    return firstValueFrom(
      this.http.get<EnquirySummary>(`${environment.apiBaseUrl}/enquiries/summary/${instituteId}`),
    );
  }

  async getEnquiries(instituteId: number): Promise<EnquiryRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ enquiries: EnquiryRow[] }>(`${environment.apiBaseUrl}/enquiries/${instituteId}`),
    );

    return response.enquiries;
  }

  async getRecentAdmissions(instituteId: number): Promise<AdmissionRecord[]> {
    const response = await firstValueFrom(
      this.http.get<{ admissions: AdmissionRecord[] }>(`${environment.apiBaseUrl}/admissions/recent/${instituteId}`),
    );

    return response.admissions;
  }

  async createAdmission(payload: AdmissionWizardPayload): Promise<{ message: string; student: unknown; admission: AdmissionRecord }> {
    return firstValueFrom(
      this.http.post<{ message: string; student: unknown; admission: AdmissionRecord }>(`${environment.apiBaseUrl}/admissions/wizard`, payload),
    );
  }

  async convertEnquiry(enquiryId: number): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/enquiries/${enquiryId}/convert`, {}),
    );
  }
}

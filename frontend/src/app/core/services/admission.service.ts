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

  async convertEnquiry(enquiryId: number): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/enquiries/${enquiryId}/convert`, {}),
    );
  }
}

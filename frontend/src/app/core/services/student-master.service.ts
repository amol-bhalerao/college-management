import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface StudentMasterRow {
  id: number;
  institute_id: number;
  academic_year_id: number;
  gr_number: string;
  first_name: string;
  last_name: string;
  guardian_name: string | null;
  mother_name: string | null;
  gender: string | null;
  category: string | null;
  nationality: string | null;
  religion: string | null;
  caste_subcaste: string | null;
  current_class: string | null;
  division: string | null;
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
  status: string;
  admission_status: string;
  institute_name: string | null;
  academic_year_label: string | null;
  outstanding_amount: number;
}

export interface StudentMasterPayload {
  institute_id?: number;
  academic_year_id?: number;
  gr_number?: string;
  first_name: string;
  last_name: string;
  guardian_name?: string;
  mother_name?: string;
  gender?: string;
  category?: string;
  nationality?: string;
  religion?: string;
  caste_subcaste?: string;
  current_class?: string;
  division?: string;
  mobile_number?: string;
  email?: string;
  dob?: string;
  date_of_birth_words?: string;
  place_of_birth?: string;
  birth_taluka?: string;
  birth_district?: string;
  birth_state?: string;
  previous_school?: string;
  date_of_admission?: string;
  date_of_leaving?: string;
  class_last_attended?: string;
  progress_status?: string;
  conduct?: string;
  reason_for_leaving?: string;
  tc_remarks?: string;
  address?: string;
  status?: string;
  admission_status?: string;
}

export interface StudentMasterFilters {
  search?: string;
  current_class?: string;
  category?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentMasterService {
  private readonly http = inject(HttpClient);

  async getStudents(instituteId: number, filters: StudentMasterFilters = {}): Promise<StudentMasterRow[]> {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
      params.set('search', filters.search.trim());
    }

    if (filters.current_class?.trim()) {
      params.set('class', filters.current_class.trim());
    }

    if (filters.category?.trim()) {
      params.set('category', filters.category.trim());
    }

    if (filters.status?.trim()) {
      params.set('status', filters.status.trim());
    }

    const query = params.toString();
    const url = `${environment.apiBaseUrl}/students/master/${instituteId}${query ? `?${query}` : ''}`;
    const response = await firstValueFrom(this.http.get<{ students: StudentMasterRow[] }>(url));

    return response.students;
  }

  async createStudent(payload: StudentMasterPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/students/master`, payload));
  }

  async updateStudent(id: number, payload: Partial<StudentMasterPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/students/master/${id}`, payload));
  }

  async deleteStudent(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/students/master/${id}`));
  }

  async promoteStudents(studentIds: number[], targetClass: string, targetDivision = ''): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/students/master/promote`, {
      student_ids: studentIds,
      target_class: targetClass,
      target_division: targetDivision,
    }));
  }
}

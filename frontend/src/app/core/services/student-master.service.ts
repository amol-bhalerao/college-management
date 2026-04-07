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
  gender: string | null;
  category: string | null;
  current_class: string | null;
  division: string | null;
  mobile_number: string | null;
  email: string | null;
  dob: string | null;
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
  gender?: string;
  category?: string;
  current_class?: string;
  division?: string;
  mobile_number?: string;
  email?: string;
  dob?: string;
  address?: string;
  status?: string;
  admission_status?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentMasterService {
  private readonly http = inject(HttpClient);

  async getStudents(instituteId: number): Promise<StudentMasterRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ students: StudentMasterRow[] }>(`${environment.apiBaseUrl}/students/master/${instituteId}`),
    );

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
}

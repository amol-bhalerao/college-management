import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface StaffSummary {
  totalStaff: number;
  activeStaff: number;
  presentToday: number;
  onLeave: number;
  absentToday: number;
}

export interface StaffRow {
  id: number;
  institute_id: number;
  employee_code: string;
  full_name: string;
  department: string | null;
  designation: string | null;
  mobile_number: string | null;
  email: string | null;
  joining_date: string | null;
  employment_type: string;
  status: string;
  attendance_id?: number | null;
  academic_year_id?: number | null;
  attendance_date?: string | null;
  attendance_status?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  remarks?: string | null;
}

export interface StaffPayload {
  institute_id?: number;
  employee_code?: string;
  full_name: string;
  department?: string;
  designation?: string;
  mobile_number?: string;
  email?: string;
  joining_date?: string;
  employment_type?: string;
  status?: string;
}

export interface StaffAttendancePayload {
  staff_id: number;
  attendance_date?: string;
  status?: string;
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class StaffHrService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number, date: string): Promise<StaffSummary> {
    return firstValueFrom(this.http.get<StaffSummary>(`${environment.apiBaseUrl}/staff/summary/${instituteId}?date=${encodeURIComponent(date)}`));
  }

  async getStaff(instituteId: number, date: string): Promise<StaffRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ staff: StaffRow[] }>(`${environment.apiBaseUrl}/staff/${instituteId}?date=${encodeURIComponent(date)}`),
    );

    return response.staff;
  }

  async createStaff(payload: StaffPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/staff`, payload));
  }

  async updateStaff(id: number, payload: Partial<StaffPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/staff/${id}`, payload));
  }

  async deleteStaff(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/staff/${id}`));
  }

  async saveAttendance(payload: StaffAttendancePayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/staff/attendance`, payload));
  }
}

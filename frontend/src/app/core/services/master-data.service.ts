import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface MasterSummary {
  total: number;
  active: number;
  types: number;
  feeAndForms: number;
}

export interface MasterEntryRow {
  id: number;
  institute_id: number;
  master_type: string;
  code: string | null;
  label: string;
  description: string | null;
  sort_order: number;
  status: string;
  meta_json?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MasterOption {
  id: number;
  code: string | null;
  label: string;
  value: string;
  description?: string | null;
  sort_order: number;
  meta_json?: string | null;
  parent_value?: string | null;
  note?: string | null;
  next_value?: string | null;
  year_order?: number | null;
}

export type MasterOptionsMap = Record<string, MasterOption[]>;

export interface MasterEntryPayload {
  institute_id?: number;
  master_type: string;
  code?: string;
  label: string;
  description?: string;
  sort_order?: number;
  status?: string;
  meta_json?: string;
}

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<MasterSummary> {
    return firstValueFrom(this.http.get<MasterSummary>(`${environment.apiBaseUrl}/masters/summary/${instituteId}`));
  }

  async getEntries(instituteId: number, type = ''): Promise<MasterEntryRow[]> {
    const url = type
      ? `${environment.apiBaseUrl}/masters/${instituteId}?type=${encodeURIComponent(type)}`
      : `${environment.apiBaseUrl}/masters/${instituteId}`;

    const response = await firstValueFrom(this.http.get<{ entries: MasterEntryRow[] }>(url));
    return response.entries;
  }

  async getOptions(instituteId: number): Promise<MasterOptionsMap> {
    const response = await firstValueFrom(this.http.get<{ options: MasterOptionsMap }>(`${environment.apiBaseUrl}/masters/options/${instituteId}`));
    return response.options;
  }

  async createEntry(payload: MasterEntryPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/masters`, payload));
  }

  async updateEntry(id: number, payload: Partial<MasterEntryPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/masters/${id}`, payload));
  }

  async deleteEntry(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/masters/${id}`));
  }
}

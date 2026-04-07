import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AppUserRow {
  id: number;
  institute_id: number;
  institute_name?: string;
  username: string;
  full_name: string;
  email: string;
  role_code: string;
  whatsapp_number: string | null;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);

  async getUsers(): Promise<AppUserRow[]> {
    const response = await firstValueFrom(
      this.http.get<{ users: AppUserRow[] }>(`${environment.apiBaseUrl}/users`),
    );

    return response.users;
  }

  async createUser(payload: Partial<AppUserRow> & { password?: string }): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/users`, payload));
  }

  async updateUser(id: number, payload: Partial<AppUserRow> & { password?: string }): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/users/${id}`, payload));
  }

  async deleteUser(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/users/${id}`));
  }
}

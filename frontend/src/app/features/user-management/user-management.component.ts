import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { AppUserRow, UserManagementService } from '../../core/services/user-management.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Super Admin</p>
          <h1>User Management</h1>
          <p>Create institute-wise users and manage role-based access for clerks, accounts, and admins.</p>
        </div>
        <button type="button" class="primary-btn" (click)="openCreate()">+ Add user</button>
      </div>

      <div class="stats-grid">
        <article>
          <span>Total users</span>
          <strong>{{ users().length }}</strong>
        </article>
        <article>
          <span>Super Admin</span>
          <strong>{{ countByRole('SUPER_ADMIN') }}</strong>
        </article>
        <article>
          <span>Clerks</span>
          <strong>{{ countByRole('CLERK') }}</strong>
        </article>
        <article>
          <span>Accountants</span>
          <strong>{{ countByRole('ACCOUNTANT') }}</strong>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Institute users</h2>
            <p>Use row actions to view, update, or delete user records quickly.</p>
          </div>
          <span class="tag">Default password for new user: Password@123</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz user-grid"
          [rowData]="users()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="6"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (showModal()) {
        <div class="detail-modal" (click)="closeModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveUser()">
            <div class="panel__header">
              <div>
                <h2>{{ editingUserId() ? 'Edit user' : 'Create user' }}</h2>
                <p>Assign the user to the proper institute and module role.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Full name
                <input type="text" name="full_name" [(ngModel)]="form.full_name" required />
              </label>

              <label>
                User ID
                <input type="text" name="username" [(ngModel)]="form.username" [disabled]="!!editingUserId()" required />
              </label>

              <label>
                Email
                <input type="email" name="email" [(ngModel)]="form.email" required />
              </label>

              <label>
                WhatsApp number
                <input type="text" name="whatsapp_number" [(ngModel)]="form.whatsapp_number" />
              </label>

              <label>
                Institute
                <select name="institute_id" [(ngModel)]="form.institute_id" required>
                  @for (institute of context.institutes(); track institute.id) {
                    <option [ngValue]="institute.id">{{ institute.name }}</option>
                  }
                </select>
              </label>

              <label>
                Role
                <select name="role_code" [(ngModel)]="form.role_code" required>
                  @for (role of roles; track role) {
                    <option [value]="role">{{ role }}</option>
                  }
                </select>
              </label>

              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>

              <label>
                Password {{ editingUserId() ? '(optional reset)' : '' }}
                <input type="text" name="password" [(ngModel)]="form.password" placeholder="Password@123" />
              </label>
            </div>

            <button type="submit" class="primary-btn" [disabled]="isSaving()">
              {{ isSaving() ? 'Saving...' : (editingUserId() ? 'Update user' : 'Create user') }}
            </button>
          </form>
        </div>
      }
    </section>
  `,
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  protected readonly context = inject(AppContextService);
  private readonly userService = inject(UserManagementService);

  protected readonly users = signal<AppUserRow[]>([]);
  protected readonly showModal = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly editingUserId = signal<number | null>(null);

  protected readonly roles = ['SUPER_ADMIN', 'CLERK', 'ACCOUNTANT'];

  protected readonly columnDefs: ColDef<AppUserRow>[] = [
    { field: 'full_name', headerName: 'Name', minWidth: 170 },
    { field: 'username', headerName: 'User ID' },
    { field: 'role_code', headerName: 'Role' },
    { field: 'institute_name', headerName: 'Institute', minWidth: 180 },
    { field: 'email', headerName: 'Email', minWidth: 210 },
    { field: 'status', headerName: 'Status' },
    {
      headerName: 'Actions',
      minWidth: 210,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: () => `
        <div class="grid-actions">
          <button type="button" class="grid-action" data-action="view">View</button>
          <button type="button" class="grid-action" data-action="edit">Edit</button>
          <button type="button" class="grid-action grid-action--danger" data-action="delete">Delete</button>
        </div>
      `,
    },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  protected form: Partial<AppUserRow> & { password?: string } = this.createEmptyForm();

  constructor() {
    effect(() => {
      void this.loadUsers();
    });
  }

  protected countByRole(role: string): number {
    return this.users().filter((user) => user.role_code === role).length;
  }

  protected handleGridClick(event: { data?: AppUserRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action) {
      this.openEdit(event.data);
      return;
    }

    if (action === 'view') {
      void this.viewUser(event.data);
      return;
    }

    if (action === 'edit') {
      this.openEdit(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteUser(event.data);
    }
  }

  protected openCreate(): void {
    this.editingUserId.set(null);
    this.form = this.createEmptyForm();
    this.showModal.set(true);
  }

  protected openEdit(user?: AppUserRow): void {
    if (!user) {
      return;
    }

    this.editingUserId.set(user.id);
    this.form = {
      ...user,
      password: '',
    };
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.form = this.createEmptyForm();
  }

  protected async saveUser(): Promise<void> {
    this.isSaving.set(true);

    try {
      if (this.editingUserId()) {
        await this.userService.updateUser(this.editingUserId()!, this.form);
      } else {
        await this.userService.createUser(this.form);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'User details saved successfully.' });
      this.closeModal();
      await this.loadUsers();
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the user details and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  private createEmptyForm(): Partial<AppUserRow> & { password?: string } {
    return {
      institute_id: this.context.activeInstitute().id,
      role_code: 'CLERK',
      status: 'active',
      password: 'Password@123',
      full_name: '',
      username: '',
      email: '',
      whatsapp_number: '',
    };
  }

  private async viewUser(user: AppUserRow): Promise<void> {
    await Swal.fire({
      title: user.full_name,
      html: `
        <div style="text-align:left; display:grid; gap:8px;">
          <div><strong>User ID:</strong> ${user.username}</div>
          <div><strong>Role:</strong> ${user.role_code}</div>
          <div><strong>Institute:</strong> ${user.institute_name ?? '—'}</div>
          <div><strong>Email:</strong> ${user.email}</div>
          <div><strong>WhatsApp:</strong> ${user.whatsapp_number ?? '—'}</div>
          <div><strong>Status:</strong> ${user.status}</div>
        </div>
      `,
      confirmButtonText: 'Close',
    });
  }

  private async deleteUser(user: AppUserRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete user?',
      text: `Remove ${user.full_name} from the user register?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.userService.deleteUser(user.id);
      await this.loadUsers();
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'User removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this user right now.',
      });
    }
  }

  private async loadUsers(): Promise<void> {
    this.users.set(await this.userService.getUsers());
  }
}

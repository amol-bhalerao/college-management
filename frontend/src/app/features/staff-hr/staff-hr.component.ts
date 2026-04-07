import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  StaffAttendancePayload,
  StaffHrService,
  StaffPayload,
  StaffRow,
  StaffSummary,
} from '../../core/services/staff-hr.service';

@Component({
  selector: 'app-staff-hr',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Human resources</p>
          <h1>Staff HR & Attendance</h1>
          <p>Maintain the staff register and mark daily attendance for teaching and non-teaching teams.</p>
        </div>
        <div class="page-actions">
          <label class="date-filter">
            Attendance date
            <input type="date" name="attendance_date_filter" [(ngModel)]="attendanceDate" (ngModelChange)="refresh()" />
          </label>
          <button type="button" class="primary-btn" (click)="openCreate()">+ Add staff</button>
        </div>
      </div>

      <div class="stats-grid">
        <article><span>Total staff</span><strong>{{ summary().totalStaff }}</strong></article>
        <article><span>Active profiles</span><strong>{{ summary().activeStaff }}</strong></article>
        <article><span>Present / on duty</span><strong>{{ summary().presentToday }}</strong></article>
        <article><span>Leave / absent</span><strong>{{ summary().onLeave + summary().absentToday }}</strong></article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Staff register</h2>
            <p>Use row actions to edit staff profiles or mark attendance for {{ attendanceDate }}.</p>
          </div>
          <span class="tag">Attendance-ready</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz register-grid"
          [rowData]="rows()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="8"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (selected(); as staff) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ staff.full_name }}</h2>
                <p>{{ staff.employee_code }} · {{ staff.designation || 'Designation pending' }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article><span>Department</span><strong>{{ staff.department || '—' }}</strong><small>{{ staff.employment_type }}</small></article>
              <article><span>Contact</span><strong>{{ staff.mobile_number || '—' }}</strong><small>{{ staff.email || 'No email' }}</small></article>
              <article><span>Attendance</span><strong>{{ attendanceLabel(staff.attendance_status) }}</strong><small>{{ staff.attendance_date || attendanceDate }}</small></article>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="openAttendance(staff)">Mark attendance</button>
              <button type="button" class="ghost-btn" (click)="openEdit(staff)">Edit staff</button>
            </div>
          </div>
        </div>
      }

      @if (showStaffModal()) {
        <div class="detail-modal" (click)="closeStaffModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveStaff()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update staff profile' : 'Add staff profile' }}</h2>
                <p>Maintain employee code, department, designation, and employment status from one place.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeStaffModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Employee code
                <input type="text" name="employee_code" [(ngModel)]="staffForm.employee_code" placeholder="Auto-generated if blank" />
              </label>
              <label>
                Full name
                <input type="text" name="full_name" [(ngModel)]="staffForm.full_name" required />
              </label>
              <label>
                Department
                <input type="text" name="department" [(ngModel)]="staffForm.department" />
              </label>
              <label>
                Designation
                <input type="text" name="designation" [(ngModel)]="staffForm.designation" />
              </label>
              <label>
                Mobile number
                <input type="text" name="mobile_number" [(ngModel)]="staffForm.mobile_number" />
              </label>
              <label>
                Email
                <input type="email" name="email" [(ngModel)]="staffForm.email" />
              </label>
              <label>
                Joining date
                <input type="date" name="joining_date" [(ngModel)]="staffForm.joining_date" />
              </label>
              <label>
                Employment type
                <select name="employment_type" [(ngModel)]="staffForm.employment_type">
                  <option value="full-time">full-time</option>
                  <option value="part-time">part-time</option>
                  <option value="visiting">visiting</option>
                  <option value="contract">contract</option>
                </select>
              </label>
              <label>
                Status
                <select name="status" [(ngModel)]="staffForm.status">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update staff' : 'Create staff') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (showAttendanceModal()) {
        <div class="detail-modal" (click)="closeAttendanceModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveAttendance()">
            <div class="panel__header">
              <div>
                <h2>Mark attendance</h2>
                <p>{{ selected()?.full_name }} · {{ attendanceDate }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeAttendanceModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Date
                <input type="date" name="attendance_date" [(ngModel)]="attendanceForm.attendance_date" />
              </label>
              <label>
                Status
                <select name="attendance_status" [(ngModel)]="attendanceForm.status">
                  <option value="present">present</option>
                  <option value="absent">absent</option>
                  <option value="leave">leave</option>
                  <option value="half-day">half-day</option>
                  <option value="on-duty">on-duty</option>
                </select>
              </label>
              <label>
                Check in
                <input type="time" name="check_in_time" [(ngModel)]="attendanceForm.check_in_time" />
              </label>
              <label>
                Check out
                <input type="time" name="check_out_time" [(ngModel)]="attendanceForm.check_out_time" />
              </label>
              <label class="full-span">
                Remarks
                <textarea rows="3" name="remarks" [(ngModel)]="attendanceForm.remarks"></textarea>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isAttendanceSaving()">
                {{ isAttendanceSaving() ? 'Saving...' : 'Save attendance' }}
              </button>
            </div>
          </form>
        </div>
      }
    </section>
  `,
  styleUrl: './staff-hr.component.scss',
})
export class StaffHrComponent {
  protected readonly context = inject(AppContextService);
  private readonly staffService = inject(StaffHrService);

  protected readonly summary = signal<StaffSummary>({ totalStaff: 0, activeStaff: 0, presentToday: 0, onLeave: 0, absentToday: 0 });
  protected readonly rows = signal<StaffRow[]>([]);
  protected readonly selected = signal<StaffRow | null>(null);
  protected readonly showStaffModal = signal(false);
  protected readonly showAttendanceModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly isAttendanceSaving = signal(false);

  protected attendanceDate = new Date().toISOString().slice(0, 10);
  protected staffForm: StaffPayload = this.createEmptyStaffForm();
  protected attendanceForm: StaffAttendancePayload = this.createEmptyAttendanceForm();

  protected readonly columnDefs: ColDef<StaffRow>[] = [
    { field: 'employee_code', headerName: 'Emp Code', minWidth: 140 },
    { field: 'full_name', headerName: 'Staff Name', minWidth: 190 },
    { field: 'department', headerName: 'Department', minWidth: 150 },
    { field: 'designation', headerName: 'Designation', minWidth: 160 },
    { field: 'employment_type', headerName: 'Type', maxWidth: 120 },
    { field: 'status', headerName: 'Profile', maxWidth: 110 },
    {
      field: 'attendance_status',
      headerName: 'Attendance',
      minWidth: 130,
      valueFormatter: (params) => this.attendanceLabel(params.value as string | null | undefined),
    },
    {
      headerName: 'Actions',
      minWidth: 250,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: () => `
        <div class="grid-actions">
          <button type="button" class="grid-action" data-action="view">View</button>
          <button type="button" class="grid-action" data-action="edit">Edit</button>
          <button type="button" class="grid-action" data-action="attendance">Attendance</button>
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

  constructor() {
    effect(() => {
      void this.load(this.context.activeInstitute().id);
    });
  }

  protected attendanceLabel(status?: string | null): string {
    const value = status || '';

    if (!value) {
      return 'Not marked';
    }

    return value;
  }

  protected refresh(): void {
    void this.load(this.context.activeInstitute().id);
  }

  protected handleGridClick(event: { data?: StaffRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action || action === 'view') {
      this.selected.set(event.data);
      return;
    }

    if (action === 'edit') {
      this.openEdit(event.data);
      return;
    }

    if (action === 'attendance') {
      this.openAttendance(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteStaff(event.data);
    }
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.staffForm = this.createEmptyStaffForm();
    this.showStaffModal.set(true);
  }

  protected openEdit(row: StaffRow): void {
    this.editingId.set(row.id);
    this.staffForm = {
      employee_code: row.employee_code,
      full_name: row.full_name,
      department: row.department || '',
      designation: row.designation || '',
      mobile_number: row.mobile_number || '',
      email: row.email || '',
      joining_date: row.joining_date || '',
      employment_type: row.employment_type || 'full-time',
      status: row.status,
    };
    this.showStaffModal.set(true);
  }

  protected closeStaffModal(): void {
    this.showStaffModal.set(false);
    this.staffForm = this.createEmptyStaffForm();
  }

  protected closeDetails(): void {
    this.selected.set(null);
  }

  protected openAttendance(row: StaffRow): void {
    this.selected.set(row);
    this.attendanceForm = {
      staff_id: row.id,
      attendance_date: row.attendance_date || this.attendanceDate,
      status: row.attendance_status || 'present',
      check_in_time: row.check_in_time || '09:00',
      check_out_time: row.check_out_time || '17:00',
      remarks: row.remarks || '',
    };
    this.showAttendanceModal.set(true);
  }

  protected closeAttendanceModal(): void {
    this.showAttendanceModal.set(false);
    this.attendanceForm = this.createEmptyAttendanceForm();
  }

  protected async saveStaff(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: StaffPayload = {
        ...this.staffForm,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingId()) {
        await this.staffService.updateStaff(this.editingId()!, payload);
      } else {
        await this.staffService.createStaff(payload);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Staff profile saved successfully.' });
      this.closeStaffModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Unable to save this staff profile right now.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async saveAttendance(): Promise<void> {
    if (!this.attendanceForm.staff_id) {
      return;
    }

    this.isAttendanceSaving.set(true);

    try {
      await this.staffService.saveAttendance({
        ...this.attendanceForm,
        attendance_date: this.attendanceForm.attendance_date || this.attendanceDate,
      });

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Attendance updated successfully.' });
      this.closeAttendanceModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Attendance failed',
        text: error?.error?.message || 'Unable to save attendance right now.',
      });
    } finally {
      this.isAttendanceSaving.set(false);
    }
  }

  private createEmptyStaffForm(): StaffPayload {
    return {
      institute_id: this.context.activeInstitute().id,
      employee_code: '',
      full_name: '',
      department: '',
      designation: '',
      mobile_number: '',
      email: '',
      joining_date: '',
      employment_type: 'full-time',
      status: 'active',
    };
  }

  private createEmptyAttendanceForm(): StaffAttendancePayload {
    return {
      staff_id: 0,
      attendance_date: this.attendanceDate,
      status: 'present',
      check_in_time: '09:00',
      check_out_time: '17:00',
      remarks: '',
    };
  }

  private async deleteStaff(row: StaffRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete staff profile?',
      text: `Remove ${row.full_name} from the staff register?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.staffService.deleteStaff(row.id);
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Staff profile removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this staff profile right now.',
      });
    }
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, staff] = await Promise.all([
      this.staffService.getSummary(instituteId, this.attendanceDate),
      this.staffService.getStaff(instituteId, this.attendanceDate),
    ]);

    this.summary.set(summary);
    this.rows.set(staff);

    const selectedId = this.selected()?.id;
    if (selectedId) {
      this.selected.set(staff.find((row) => row.id === selectedId) ?? null);
    }
  }
}

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
import { InstituteService, InstituteSettings } from '../../core/services/institute.service';

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
              <button type="button" class="secondary-btn" (click)="openLeaveLetter(staff)">Leave letter</button>
              <button type="button" class="secondary-btn" (click)="openPayrollSlip(staff)">Salary slip</button>
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

      @if (showLeaveModal()) {
        <div class="detail-modal" (click)="closeLeaveModal()">
          <div class="detail-card detail-card--wide" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>Staff Leave Letter</h2>
                <p>{{ selected()?.full_name }} · {{ leaveForm.leave_type }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeLeaveModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Leave type
                <select name="leave_type" [(ngModel)]="leaveForm.leave_type">
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="On Duty">On Duty</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </label>
              <label>
                Approval status
                <select name="approval_status" [(ngModel)]="leaveForm.approval_status">
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>
              <label>
                From date
                <input type="date" name="leave_from_date" [(ngModel)]="leaveForm.from_date" />
              </label>
              <label>
                To date
                <input type="date" name="leave_to_date" [(ngModel)]="leaveForm.to_date" />
              </label>
              <label class="full-span">
                Reason
                <textarea rows="3" name="leave_reason" [(ngModel)]="leaveForm.reason"></textarea>
              </label>
            </div>

            <div id="leave-print-surface" class="print-sheet">
              <header class="doc-header">
                <div class="doc-logo">
                  @if (instituteSettings()?.logo_url) {
                    <img [src]="instituteSettings()?.logo_url!" alt="Institute logo" />
                  } @else {
                    <div class="doc-logo-fallback">{{ context.activeInstitute().code }}</div>
                  }
                </div>
                <div class="doc-title">
                  <h3>{{ instituteSettings()?.header_title || context.activeInstitute().name }}</h3>
                  <strong>{{ instituteSettings()?.header_subtitle || context.activeInstitute().type }}</strong>
                  <p>{{ instituteSettings()?.header_address || 'Institute address not configured yet.' }}</p>
                  <small>{{ instituteSettings()?.contact_phone || 'Phone' }} · {{ instituteSettings()?.contact_email || 'Email' }}</small>
                </div>
              </header>

              <div class="doc-ribbon">
                <div>
                  <span class="doc-label">Document</span>
                  <strong>Leave Application / Approval Letter</strong>
                </div>
                <div>
                  <span class="doc-label">Printed on</span>
                  <strong>{{ printableDate() }}</strong>
                </div>
              </div>

              <div class="meta-grid meta-grid--three">
                <article><span>Employee</span><strong>{{ selected()?.full_name || '—' }}</strong><small>{{ selected()?.employee_code || '—' }}</small></article>
                <article><span>Department</span><strong>{{ selected()?.department || '—' }}</strong><small>{{ selected()?.designation || '—' }}</small></article>
                <article><span>Leave days</span><strong>{{ leaveDays() }}</strong><small>{{ leaveForm.approval_status }}</small></article>
              </div>

              <p class="doc-copy">
                This is to certify that <strong>{{ selected()?.full_name || 'the staff member' }}</strong>,
                working as <strong>{{ selected()?.designation || 'staff member' }}</strong> in the
                <strong>{{ selected()?.department || 'concerned department' }}</strong>, has applied for
                <strong>{{ leaveForm.leave_type }}</strong> from <strong>{{ leaveForm.from_date || '—' }}</strong>
                to <strong>{{ leaveForm.to_date || '—' }}</strong> for the following reason:
                <strong>{{ leaveForm.reason || 'official / personal reason' }}</strong>.
              </p>

              <p class="doc-copy">
                Current status of this request: <strong>{{ leaveForm.approval_status }}</strong>.
                This letter is issued for office reference and staff record purposes.
              </p>

              <div class="doc-footer">
                <div>
                  <strong>Office note</strong>
                  <p>Please attach supporting documents if required as per HR policy.</p>
                </div>
                <div class="signature-block">
                  <span>HR Office / Principal</span>
                </div>
              </div>
            </div>

            <div class="actions actions--end">
              <button type="button" class="secondary-btn" (click)="printLeave('A4')">Print A4</button>
              <button type="button" class="secondary-btn" (click)="printLeave('A5')">Print A5</button>
            </div>
          </div>
        </div>
      }

      @if (showPayrollModal()) {
        <div class="detail-modal" (click)="closePayrollModal()">
          <div class="detail-card detail-card--wide" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>Salary Slip / Payroll Print</h2>
                <p>{{ selected()?.full_name }} · {{ payrollForm.month_label }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closePayrollModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Salary month
                <input type="text" name="salary_month_label" [(ngModel)]="payrollForm.month_label" />
              </label>
              <label>
                Payment mode
                <select name="payment_mode" [(ngModel)]="payrollForm.payment_mode">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </label>
              <label>
                Working days
                <input type="number" min="1" name="working_days" [(ngModel)]="payrollForm.working_days" />
              </label>
              <label>
                Paid days
                <input type="number" min="1" name="paid_days" [(ngModel)]="payrollForm.paid_days" />
              </label>
              <label>
                Basic pay
                <input type="number" min="0" step="0.01" name="basic_pay" [(ngModel)]="payrollForm.basic_pay" />
              </label>
              <label>
                HRA
                <input type="number" min="0" step="0.01" name="hra" [(ngModel)]="payrollForm.hra" />
              </label>
              <label>
                Special allowance
                <input type="number" min="0" step="0.01" name="special_allowance" [(ngModel)]="payrollForm.special_allowance" />
              </label>
              <label>
                Deductions
                <input type="number" min="0" step="0.01" name="deductions" [(ngModel)]="payrollForm.deductions" />
              </label>
              <label>
                Bonus / arrears
                <input type="number" min="0" step="0.01" name="bonus" [(ngModel)]="payrollForm.bonus" />
              </label>
            </div>

            <div id="payroll-print-surface" class="print-sheet">
              <header class="doc-header">
                <div class="doc-logo">
                  @if (instituteSettings()?.logo_url) {
                    <img [src]="instituteSettings()?.logo_url!" alt="Institute logo" />
                  } @else {
                    <div class="doc-logo-fallback">{{ context.activeInstitute().code }}</div>
                  }
                </div>
                <div class="doc-title">
                  <h3>{{ instituteSettings()?.header_title || context.activeInstitute().name }}</h3>
                  <strong>{{ instituteSettings()?.header_subtitle || context.activeInstitute().type }}</strong>
                  <p>{{ instituteSettings()?.header_address || 'Institute address not configured yet.' }}</p>
                  <small>{{ instituteSettings()?.contact_phone || 'Phone' }} · {{ instituteSettings()?.contact_email || 'Email' }}</small>
                </div>
              </header>

              <div class="doc-ribbon">
                <div>
                  <span class="doc-label">Document</span>
                  <strong>Salary Slip / Payroll Statement</strong>
                </div>
                <div>
                  <span class="doc-label">Period</span>
                  <strong>{{ payrollForm.month_label }}</strong>
                </div>
              </div>

              <div class="meta-grid meta-grid--three">
                <article><span>Employee</span><strong>{{ selected()?.full_name || '—' }}</strong><small>{{ selected()?.employee_code || '—' }}</small></article>
                <article><span>Department</span><strong>{{ selected()?.department || '—' }}</strong><small>{{ selected()?.designation || '—' }}</small></article>
                <article><span>Attendance</span><strong>{{ payrollForm.paid_days }} / {{ payrollForm.working_days }}</strong><small>{{ payrollForm.payment_mode }}</small></article>
              </div>

              <table class="salary-table">
                <thead>
                  <tr>
                    <th>Earnings</th>
                    <th>Amount</th>
                    <th>Deductions</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Pay</td>
                    <td>{{ payrollForm.basic_pay }}</td>
                    <td>Statutory / Other Deduction</td>
                    <td>{{ payrollForm.deductions }}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td>{{ payrollForm.hra }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td>
                    <td>{{ payrollForm.special_allowance }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Bonus / Arrears</td>
                    <td>{{ payrollForm.bonus }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Gross Pay</th>
                    <th>{{ grossSalary() }}</th>
                    <th>Total Deductions</th>
                    <th>{{ payrollForm.deductions }}</th>
                  </tr>
                  <tr>
                    <th colspan="2">Net Pay</th>
                    <th colspan="2">{{ netSalary() }}</th>
                  </tr>
                </tbody>
              </table>

              <div class="doc-footer">
                <div>
                  <strong>Payroll note</strong>
                  <p>This is a computer-generated salary slip prepared for staff reference and accounts records.</p>
                </div>
                <div class="signature-block">
                  <span>Accounts Office / Authorized Signatory</span>
                </div>
              </div>
            </div>

            <div class="actions actions--end">
              <button type="button" class="secondary-btn" (click)="printPayroll('A4')">Print A4</button>
              <button type="button" class="secondary-btn" (click)="printPayroll('A5')">Print A5</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './staff-hr.component.scss',
})
export class StaffHrComponent {
  protected readonly context = inject(AppContextService);
  private readonly staffService = inject(StaffHrService);
  private readonly instituteService = inject(InstituteService);

  protected readonly summary = signal<StaffSummary>({ totalStaff: 0, activeStaff: 0, presentToday: 0, onLeave: 0, absentToday: 0 });
  protected readonly rows = signal<StaffRow[]>([]);
  protected readonly selected = signal<StaffRow | null>(null);
  protected readonly instituteSettings = signal<InstituteSettings | null>(null);
  protected readonly showStaffModal = signal(false);
  protected readonly showAttendanceModal = signal(false);
  protected readonly showLeaveModal = signal(false);
  protected readonly showPayrollModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly isAttendanceSaving = signal(false);

  protected attendanceDate = new Date().toISOString().slice(0, 10);
  protected staffForm: StaffPayload = this.createEmptyStaffForm();
  protected attendanceForm: StaffAttendancePayload = this.createEmptyAttendanceForm();
  protected leaveForm = this.createEmptyLeaveForm();
  protected payrollForm = this.createEmptyPayrollForm();

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

  protected printableDate(): string {
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  protected leaveDays(): number {
    const from = new Date(this.leaveForm.from_date || this.attendanceDate);
    const to = new Date(this.leaveForm.to_date || this.leaveForm.from_date || this.attendanceDate);
    const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

    return Math.max(1, diff + 1);
  }

  protected grossSalary(): number {
    return Number(this.payrollForm.basic_pay || 0)
      + Number(this.payrollForm.hra || 0)
      + Number(this.payrollForm.special_allowance || 0)
      + Number(this.payrollForm.bonus || 0);
  }

  protected netSalary(): number {
    return this.grossSalary() - Number(this.payrollForm.deductions || 0);
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

  protected openLeaveLetter(row: StaffRow): void {
    this.selected.set(row);
    this.leaveForm = {
      leave_type: row.attendance_status === 'leave' ? 'Casual Leave' : 'On Duty',
      from_date: row.attendance_date || this.attendanceDate,
      to_date: row.attendance_date || this.attendanceDate,
      reason: row.remarks || 'Staff leave / duty note recorded by the HR office.',
      approval_status: row.attendance_status === 'leave' ? 'Approved' : 'Pending',
    };
    this.showLeaveModal.set(true);
  }

  protected closeLeaveModal(): void {
    this.showLeaveModal.set(false);
    this.leaveForm = this.createEmptyLeaveForm();
  }

  protected openPayrollSlip(row: StaffRow): void {
    const defaultBasic = row.designation?.toLowerCase().includes('lecturer') ? 32000 : 26000;
    this.selected.set(row);
    this.payrollForm = {
      month_label: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      working_days: 26,
      paid_days: row.attendance_status === 'leave' ? 25 : 26,
      basic_pay: defaultBasic,
      hra: Math.round(defaultBasic * 0.24),
      special_allowance: 2500,
      deductions: 1800,
      bonus: 0,
      payment_mode: 'Bank Transfer',
    };
    this.showPayrollModal.set(true);
  }

  protected closePayrollModal(): void {
    this.showPayrollModal.set(false);
    this.payrollForm = this.createEmptyPayrollForm();
  }

  protected printLeave(pageSize: 'A4' | 'A5'): void {
    this.printSurface('leave-print-surface', 'Staff Leave Letter', pageSize);
  }

  protected printPayroll(pageSize: 'A4' | 'A5'): void {
    this.printSurface('payroll-print-surface', 'Staff Salary Slip', pageSize);
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

  private createEmptyLeaveForm() {
    return {
      leave_type: 'Casual Leave',
      from_date: this.attendanceDate,
      to_date: this.attendanceDate,
      reason: 'Personal / official reason',
      approval_status: 'Approved',
    };
  }

  private createEmptyPayrollForm() {
    return {
      month_label: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      working_days: 26,
      paid_days: 26,
      basic_pay: 26000,
      hra: 6000,
      special_allowance: 2500,
      deductions: 1800,
      bonus: 0,
      payment_mode: 'Bank Transfer',
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
    const [summary, staff, institute] = await Promise.all([
      this.staffService.getSummary(instituteId, this.attendanceDate),
      this.staffService.getStaff(instituteId, this.attendanceDate),
      this.instituteService.getSettings(instituteId),
    ]);

    this.summary.set(summary);
    this.rows.set(staff);
    this.instituteSettings.set(institute);

    const selectedId = this.selected()?.id;
    if (selectedId) {
      this.selected.set(staff.find((row) => row.id === selectedId) ?? null);
    }
  }

  private printSurface(surfaceId: string, title: string, pageSize: 'A4' | 'A5'): void {
    const printMarkup = document.getElementById(surfaceId)?.innerHTML;

    if (!printMarkup) {
      return;
    }

    const popup = window.open('', '_blank', 'width=1100,height=850');
    if (!popup) {
      return;
    }

    const pageHeight = pageSize === 'A4' ? '297mm' : '210mm';

    popup.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: ${pageSize} portrait; margin: 8mm; }
            html, body { margin: 0; padding: 0; background: #fff; }
            body { font-family: Arial, sans-serif; color: #0f172a; }
            .print-sheet { width: 100%; min-height: calc(${pageHeight} - 16mm); box-sizing: border-box; }
            .doc-header { display: grid; grid-template-columns: 22mm 1fr; gap: 4mm; align-items: center; padding-bottom: 4mm; border-bottom: 1px solid #cbd5e1; }
            .doc-logo img, .doc-logo-fallback { width: 20mm; height: 20mm; border-radius: 4mm; object-fit: cover; }
            .doc-logo-fallback { display: flex; align-items: center; justify-content: center; background: #e0e7ff; font-weight: 700; color: #312e81; }
            .doc-title h3, .doc-title p, .doc-title small, .doc-title strong { margin: 0; display: block; }
            .doc-ribbon { display: flex; justify-content: space-between; gap: 4mm; margin: 4mm 0; padding: 3mm; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 3mm; }
            .doc-label { display: block; color: #64748b; font-size: 11px; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3mm; margin: 4mm 0; }
            .meta-grid article { padding: 3mm; border: 1px solid #e2e8f0; border-radius: 3mm; background: #fff; }
            .meta-grid span { display: block; color: #64748b; font-size: 11px; margin-bottom: 1mm; }
            .doc-copy { line-height: 1.6; margin: 4mm 0; }
            .salary-table { width: 100%; border-collapse: collapse; margin-top: 4mm; font-size: 12px; }
            .salary-table th, .salary-table td { border: 1px solid #cbd5e1; padding: 2.4mm; text-align: left; }
            .salary-table th { background: #eef2ff; }
            .doc-footer { display: flex; justify-content: space-between; gap: 6mm; margin-top: 6mm; }
            .doc-footer p { margin: 1mm 0 0; }
            .signature-block { min-width: 44mm; padding-top: 9mm; border-top: 1px solid #94a3b8; text-align: center; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="print-sheet">${printMarkup}</div>
        </body>
      </html>
    `);
    popup.document.close();
  }
}

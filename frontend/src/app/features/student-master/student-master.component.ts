import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  StudentMasterPayload,
  StudentMasterRow,
  StudentMasterService,
} from '../../core/services/student-master.service';

@Component({
  selector: 'app-student-master',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, CurrencyPipe],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Student office</p>
          <h1>Student Master</h1>
          <p>Maintain the central student register with profile, class, contact, and admission details.</p>
        </div>
        <button type="button" class="primary-btn" (click)="openCreate()">+ Add student</button>
      </div>

      <div class="stats-grid">
        <article>
          <span>Total students</span>
          <strong>{{ students().length }}</strong>
        </article>
        <article>
          <span>Active records</span>
          <strong>{{ countByStatus('active') }}</strong>
        </article>
        <article>
          <span>Confirmed admissions</span>
          <strong>{{ countByAdmission('confirmed') }}</strong>
        </article>
        <article>
          <span>Outstanding dues</span>
          <strong>{{ totalOutstanding() | currency:'INR':'symbol':'1.0-0' }}</strong>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Student register</h2>
            <p>Use row actions to view, update, or delete student master entries.</p>
          </div>
          <span class="tag">Institute-aware directory</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz student-grid"
          [rowData]="students()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="8"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (showModal()) {
        <div class="detail-modal" (click)="closeModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveStudent()">
            <div class="panel__header">
              <div>
                <h2>{{ editingStudentId() ? 'Update student' : 'Add student' }}</h2>
                <p>Leave GR number blank to auto-generate it from institute and academic year.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                GR number
                <input type="text" name="gr_number" [(ngModel)]="form.gr_number" placeholder="Auto-generated if blank" />
              </label>
              <label>
                First name
                <input type="text" name="first_name" [(ngModel)]="form.first_name" required />
              </label>
              <label>
                Last name
                <input type="text" name="last_name" [(ngModel)]="form.last_name" required />
              </label>
              <label>
                Guardian name
                <input type="text" name="guardian_name" [(ngModel)]="form.guardian_name" />
              </label>
              <label>
                Gender
                <select name="gender" [(ngModel)]="form.gender">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Category
                <input type="text" name="category" [(ngModel)]="form.category" />
              </label>
              <label>
                Course / class
                <input type="text" name="current_class" [(ngModel)]="form.current_class" />
              </label>
              <label>
                Division
                <input type="text" name="division" [(ngModel)]="form.division" />
              </label>
              <label>
                Mobile number
                <input type="text" name="mobile_number" [(ngModel)]="form.mobile_number" />
              </label>
              <label>
                Email
                <input type="email" name="email" [(ngModel)]="form.email" />
              </label>
              <label>
                Date of birth
                <input type="date" name="dob" [(ngModel)]="form.dob" />
              </label>
              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label>
                Admission status
                <select name="admission_status" [(ngModel)]="form.admission_status">
                  <option value="confirmed">confirmed</option>
                  <option value="pending">pending</option>
                  <option value="cancelled">cancelled</option>
                  <option value="active">active</option>
                </select>
              </label>
              <label class="full-span">
                Address
                <textarea rows="3" name="address" [(ngModel)]="form.address"></textarea>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingStudentId() ? 'Update student' : 'Create student') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (selectedStudent(); as student) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ student.first_name }} {{ student.last_name }}</h2>
                <p>{{ student.gr_number }} · {{ student.institute_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article>
                <span>Class</span>
                <strong>{{ student.current_class || '—' }}</strong>
                <small>{{ student.division || 'Division not set' }}</small>
              </article>
              <article>
                <span>Guardian</span>
                <strong>{{ student.guardian_name || '—' }}</strong>
                <small>{{ student.mobile_number || 'No mobile saved' }}</small>
              </article>
              <article>
                <span>Status</span>
                <strong>{{ student.status }}</strong>
                <small>Admission: {{ student.admission_status }}</small>
              </article>
              <article>
                <span>Email / DOB</span>
                <strong>{{ student.email || '—' }}</strong>
                <small>{{ student.dob || 'DOB not saved' }}</small>
              </article>
              <article>
                <span>Academic year</span>
                <strong>{{ student.academic_year_label || context.activeAcademicYear() }}</strong>
                <small>{{ student.category || 'Category not saved' }}</small>
              </article>
              <article>
                <span>Outstanding</span>
                <strong>{{ student.outstanding_amount | currency:'INR':'symbol':'1.0-0' }}</strong>
                <small>Latest ledger balance</small>
              </article>
            </div>

            <div class="info-box">
              <strong>Address</strong>
              <p>{{ student.address || 'Address not added yet.' }}</p>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="openEdit(student)">Edit student</button>
              <button type="button" class="ghost-btn" (click)="copyGrNumber(student.gr_number)">Copy GR number</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './student-master.component.scss',
})
export class StudentMasterComponent {
  protected readonly context = inject(AppContextService);
  private readonly studentService = inject(StudentMasterService);

  protected readonly students = signal<StudentMasterRow[]>([]);
  protected readonly selectedStudent = signal<StudentMasterRow | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingStudentId = signal<number | null>(null);
  protected readonly isSaving = signal(false);

  protected form: StudentMasterPayload = this.createEmptyForm();

  protected readonly columnDefs: ColDef<StudentMasterRow>[] = [
    { field: 'gr_number', headerName: 'GR No', minWidth: 140 },
    {
      headerName: 'Student',
      valueGetter: (params) => `${params.data?.first_name ?? ''} ${params.data?.last_name ?? ''}`.trim(),
      minWidth: 180,
    },
    { field: 'current_class', headerName: 'Class', minWidth: 140 },
    { field: 'guardian_name', headerName: 'Guardian', minWidth: 170 },
    { field: 'mobile_number', headerName: 'Mobile' },
    { field: 'admission_status', headerName: 'Admission' },
    { field: 'status', headerName: 'Status' },
    { field: 'outstanding_amount', headerName: 'Outstanding' },
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

  constructor() {
    effect(() => {
      void this.loadStudents(this.context.activeInstitute().id);
    });
  }

  protected countByStatus(status: string): number {
    return this.students().filter((student) => student.status === status).length;
  }

  protected countByAdmission(status: string): number {
    return this.students().filter((student) => student.admission_status === status).length;
  }

  protected totalOutstanding(): number {
    return this.students().reduce((sum, student) => sum + Number(student.outstanding_amount || 0), 0);
  }

  protected handleGridClick(event: { data?: StudentMasterRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action || action === 'view') {
      this.openDetails(event.data);
      return;
    }

    if (action === 'edit') {
      this.openEdit(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteStudent(event.data);
    }
  }

  protected openCreate(): void {
    this.editingStudentId.set(null);
    this.form = this.createEmptyForm();
    this.showModal.set(true);
  }

  protected openEdit(student?: StudentMasterRow): void {
    if (!student) {
      return;
    }

    this.editingStudentId.set(student.id);
    this.form = {
      institute_id: student.institute_id,
      academic_year_id: student.academic_year_id,
      gr_number: student.gr_number,
      first_name: student.first_name,
      last_name: student.last_name,
      guardian_name: student.guardian_name || '',
      gender: student.gender || '',
      category: student.category || '',
      current_class: student.current_class || '',
      division: student.division || '',
      mobile_number: student.mobile_number || '',
      email: student.email || '',
      dob: student.dob || '',
      address: student.address || '',
      status: student.status,
      admission_status: student.admission_status,
    };
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.form = this.createEmptyForm();
  }

  protected openDetails(student?: StudentMasterRow): void {
    if (student) {
      this.selectedStudent.set(student);
    }
  }

  protected closeDetails(): void {
    this.selectedStudent.set(null);
  }

  protected async saveStudent(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: StudentMasterPayload = {
        ...this.form,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingStudentId()) {
        await this.studentService.updateStudent(this.editingStudentId()!, payload);
      } else {
        await this.studentService.createStudent(payload);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: this.editingStudentId() ? 'Student updated successfully.' : 'Student master created successfully.',
      });
      this.closeModal();
      await this.loadStudents(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the student details and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async copyGrNumber(grNumber: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(grNumber);
      await Swal.fire({ icon: 'success', title: 'Copied', text: `${grNumber} copied to clipboard.` });
    } catch {
      await Swal.fire({ icon: 'info', title: 'Copy manually', text: grNumber });
    }
  }

  private createEmptyForm(): StudentMasterPayload {
    return {
      institute_id: this.context.activeInstitute().id,
      gr_number: '',
      first_name: '',
      last_name: '',
      guardian_name: '',
      gender: '',
      category: '',
      current_class: '',
      division: 'A',
      mobile_number: '',
      email: '',
      dob: '',
      address: '',
      status: 'active',
      admission_status: 'confirmed',
    };
  }

  private async deleteStudent(student: StudentMasterRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete student?',
      text: `Remove ${student.first_name} ${student.last_name} from the student master?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.studentService.deleteStudent(student.id);
      this.closeDetails();
      await this.loadStudents(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Student removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this student right now.',
      });
    }
  }

  private async loadStudents(instituteId: number): Promise<void> {
    const students = await this.studentService.getStudents(instituteId);
    this.students.set(students);

    const selectedId = this.selectedStudent()?.id;
    if (selectedId) {
      this.selectedStudent.set(students.find((row) => row.id === selectedId) ?? null);
    }
  }
}

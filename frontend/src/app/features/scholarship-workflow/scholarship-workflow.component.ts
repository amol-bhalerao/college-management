import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  ScholarshipPayload,
  ScholarshipRow,
  ScholarshipService,
  ScholarshipSummary,
} from '../../core/services/scholarship.service';
import { StudentMasterRow, StudentMasterService } from '../../core/services/student-master.service';

@Component({
  selector: 'app-scholarship-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, CurrencyPipe],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Student support</p>
          <h1>Scholarship & Freeship Workflow</h1>
          <p>Track eligibility, submission, verification, and approved support amounts from one desk.</p>
        </div>
        <button type="button" class="primary-btn" (click)="openCreate()">+ Add application</button>
      </div>

      <div class="stats-grid">
        <article><span>Total applications</span><strong>{{ summary().total }}</strong></article>
        <article><span>Eligible</span><strong>{{ summary().eligible }}</strong></article>
        <article><span>Submitted / verified</span><strong>{{ summary().submitted }}</strong></article>
        <article><span>Expected support</span><strong>{{ summary().expectedAmount | currency:'INR':'symbol':'1.0-0' }}</strong></article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Scholarship register</h2>
            <p>Manage MahaDBT / freeship-style tracking against student master records.</p>
          </div>
          <span class="tag">Eligibility desk</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz register-grid"
          [rowData]="applications()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="7"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (showModal()) {
        <div class="detail-modal" (click)="closeModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveApplication()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update scholarship application' : 'Add scholarship application' }}</h2>
                <p>Link the workflow directly to a student master profile.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label class="full-span">
                Student
                <select name="student_id" [(ngModel)]="form.student_id" required>
                  <option [ngValue]="0">Select student</option>
                  @for (student of students(); track student.id) {
                    <option [ngValue]="student.id">{{ student.gr_number }} · {{ student.first_name }} {{ student.last_name }}</option>
                  }
                </select>
              </label>

              <label>
                Scheme name
                <input type="text" name="scheme_name" [(ngModel)]="form.scheme_name" required />
              </label>

              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  <option value="pending">pending</option>
                  <option value="submitted">submitted</option>
                  <option value="verified">verified</option>
                  <option value="approved">approved</option>
                </select>
              </label>

              <label>
                Eligible
                <select name="is_eligible" [(ngModel)]="form.is_eligible">
                  <option [ngValue]="1">Yes</option>
                  <option [ngValue]="0">No</option>
                </select>
              </label>

              <label>
                Expected amount
                <input type="number" min="0" step="0.01" name="expected_amount" [(ngModel)]="form.expected_amount" />
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update application' : 'Create application') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (selected(); as row) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ row.scheme_name }}</h2>
                <p>{{ row.gr_number }} · {{ row.first_name }} {{ row.last_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article><span>Status</span><strong>{{ row.status }}</strong><small>{{ row.is_eligible ? 'Eligible' : 'Not eligible' }}</small></article>
              <article><span>Expected amount</span><strong>{{ row.expected_amount | currency:'INR':'symbol':'1.0-0' }}</strong><small>{{ row.institute_name }}</small></article>
              <article><span>Class / Category</span><strong>{{ row.current_class || '—' }}</strong><small>{{ row.category || '—' }}</small></article>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="openEdit(row)">Edit</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './scholarship-workflow.component.scss',
})
export class ScholarshipWorkflowComponent {
  protected readonly context = inject(AppContextService);
  private readonly scholarshipService = inject(ScholarshipService);
  private readonly studentService = inject(StudentMasterService);

  protected readonly summary = signal<ScholarshipSummary>({ total: 0, eligible: 0, submitted: 0, approved: 0, expectedAmount: 0 });
  protected readonly applications = signal<ScholarshipRow[]>([]);
  protected readonly students = signal<StudentMasterRow[]>([]);
  protected readonly selected = signal<ScholarshipRow | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);

  protected form: ScholarshipPayload = this.createEmptyForm();

  protected readonly columnDefs: ColDef<ScholarshipRow>[] = [
    { field: 'scheme_name', headerName: 'Scheme', minWidth: 220 },
    {
      headerName: 'Student',
      valueGetter: (params) => `${params.data?.first_name ?? ''} ${params.data?.last_name ?? ''}`.trim(),
      minWidth: 180,
    },
    { field: 'gr_number', headerName: 'GR No' },
    { field: 'current_class', headerName: 'Class' },
    { field: 'status', headerName: 'Status' },
    { field: 'expected_amount', headerName: 'Expected Amount' },
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
      void this.load(this.context.activeInstitute().id);
    });
  }

  protected handleGridClick(event: { data?: ScholarshipRow; event?: Event | null }): void {
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

    if (action === 'delete') {
      void this.deleteApplication(event.data);
    }
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form = {
      ...this.createEmptyForm(),
      student_id: this.students()[0]?.id ?? 0,
    };
    this.showModal.set(true);
  }

  protected openEdit(row: ScholarshipRow): void {
    this.editingId.set(row.id);
    this.form = {
      student_id: row.student_id,
      scheme_name: row.scheme_name,
      status: row.status,
      is_eligible: Number(row.is_eligible),
      expected_amount: Number(row.expected_amount),
    };
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.form = this.createEmptyForm();
  }

  protected closeDetails(): void {
    this.selected.set(null);
  }

  protected async saveApplication(): Promise<void> {
    if (!this.form.student_id) {
      await Swal.fire({ icon: 'warning', title: 'Student required', text: 'Please select a student first.' });
      return;
    }

    this.isSaving.set(true);

    try {
      if (this.editingId()) {
        await this.scholarshipService.updateApplication(this.editingId()!, this.form);
      } else {
        await this.scholarshipService.createApplication(this.form);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Scholarship workflow updated successfully.' });
      this.closeModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the scholarship details and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  private createEmptyForm(): ScholarshipPayload {
    return {
      student_id: 0,
      scheme_name: '',
      status: 'pending',
      is_eligible: 1,
      expected_amount: 0,
    };
  }

  private async deleteApplication(row: ScholarshipRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete application?',
      text: `Remove ${row.scheme_name} for ${row.first_name} ${row.last_name}?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.scholarshipService.deleteApplication(row.id);
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Scholarship application removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this scholarship application right now.',
      });
    }
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, applications, students] = await Promise.all([
      this.scholarshipService.getSummary(instituteId),
      this.scholarshipService.getApplications(instituteId),
      this.studentService.getStudents(instituteId),
    ]);

    this.summary.set(summary);
    this.applications.set(applications);
    this.students.set(students);

    const selectedId = this.selected()?.id;
    if (selectedId) {
      this.selected.set(applications.find((row) => row.id === selectedId) ?? null);
    }
  }
}

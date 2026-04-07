import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { IqacMetricPayload, IqacMetricRow, IqacService, IqacSummary } from '../../core/services/iqac.service';

@Component({
  selector: 'app-iqac-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Quality cell</p>
          <h1>IQAC / NAAC Tracking</h1>
          <p>Track evidence readiness, criterion-wise progress, and next review dates for accreditation work.</p>
        </div>
        <button type="button" class="primary-btn" (click)="openCreate()">+ Add metric</button>
      </div>

      <div class="stats-grid">
        <article><span>Total metrics</span><strong>{{ summary().total }}</strong></article>
        <article><span>Completed</span><strong>{{ summary().completed }}</strong></article>
        <article><span>Evidence ready</span><strong>{{ summary().evidenceReady }}</strong></article>
        <article><span>Due soon</span><strong>{{ summary().dueSoon }}</strong></article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Criterion workboard</h2>
            <p>Keep accreditation tasks, owners, and evidence status visible to the team.</p>
          </div>
          <span class="tag">NAAC-ready tracker</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz register-grid"
          [rowData]="metrics()"
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
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveMetric()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update metric' : 'Add metric' }}</h2>
                <p>Capture criterion number, ownership, and evidence readiness.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Criterion code
                <input type="text" name="criterion_code" [(ngModel)]="form.criterion_code" required />
              </label>
              <label>
                Title
                <input type="text" name="title" [(ngModel)]="form.title" required />
              </label>
              <label>
                Owner
                <input type="text" name="owner" [(ngModel)]="form.owner" />
              </label>
              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  <option value="ongoing">ongoing</option>
                  <option value="completed">completed</option>
                  <option value="pending">pending</option>
                </select>
              </label>
              <label>
                Evidence status
                <select name="evidence_status" [(ngModel)]="form.evidence_status">
                  <option value="in-progress">in-progress</option>
                  <option value="ready">ready</option>
                  <option value="pending">pending</option>
                </select>
              </label>
              <label>
                Next review date
                <input type="date" name="next_review_date" [(ngModel)]="form.next_review_date" />
              </label>
              <label>
                Target value
                <input type="number" min="0" name="target_value" [(ngModel)]="form.target_value" />
              </label>
              <label>
                Achieved value
                <input type="number" min="0" name="achieved_value" [(ngModel)]="form.achieved_value" />
              </label>
              <label class="full-span">
                Notes
                <textarea rows="3" name="notes" [(ngModel)]="form.notes"></textarea>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update metric' : 'Create metric') }}
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
                <h2>{{ row.criterion_code }} · {{ row.title }}</h2>
                <p>{{ row.owner || 'IQAC Cell' }} · {{ row.academic_year_label || context.activeAcademicYear() }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article><span>Status</span><strong>{{ row.status }}</strong><small>Evidence: {{ row.evidence_status }}</small></article>
              <article><span>Target</span><strong>{{ row.target_value }}</strong><small>Achieved: {{ row.achieved_value }}</small></article>
              <article><span>Next review</span><strong>{{ row.next_review_date || 'Not set' }}</strong><small>{{ row.institute_name }}</small></article>
            </div>

            <div class="info-box">
              <strong>Notes</strong>
              <p>{{ row.notes || 'No notes added yet.' }}</p>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="openEdit(row)">Edit metric</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './iqac-tracker.component.scss',
})
export class IqacTrackerComponent {
  protected readonly context = inject(AppContextService);
  private readonly iqacService = inject(IqacService);

  protected readonly summary = signal<IqacSummary>({ total: 0, completed: 0, evidenceReady: 0, dueSoon: 0 });
  protected readonly metrics = signal<IqacMetricRow[]>([]);
  protected readonly selected = signal<IqacMetricRow | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);

  protected form: IqacMetricPayload = this.createEmptyForm();

  protected readonly columnDefs: ColDef<IqacMetricRow>[] = [
    { field: 'criterion_code', headerName: 'Criterion', minWidth: 120 },
    { field: 'title', headerName: 'Title', minWidth: 220 },
    { field: 'owner', headerName: 'Owner', minWidth: 160 },
    { field: 'status', headerName: 'Status' },
    { field: 'evidence_status', headerName: 'Evidence' },
    { field: 'next_review_date', headerName: 'Next Review' },
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

  protected handleGridClick(event: { data?: IqacMetricRow; event?: Event | null }): void {
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
      void this.deleteMetric(event.data);
    }
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form = this.createEmptyForm();
    this.showModal.set(true);
  }

  protected openEdit(row: IqacMetricRow): void {
    this.editingId.set(row.id);
    this.form = {
      criterion_code: row.criterion_code,
      title: row.title,
      owner: row.owner || '',
      target_value: row.target_value,
      achieved_value: row.achieved_value,
      status: row.status,
      evidence_status: row.evidence_status,
      next_review_date: row.next_review_date || '',
      notes: row.notes || '',
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

  protected async saveMetric(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: IqacMetricPayload = {
        ...this.form,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingId()) {
        await this.iqacService.updateMetric(this.editingId()!, payload);
      } else {
        await this.iqacService.createMetric(payload);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'IQAC / NAAC tracker updated successfully.' });
      this.closeModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the tracker details and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  private createEmptyForm(): IqacMetricPayload {
    return {
      criterion_code: '',
      title: '',
      owner: 'IQAC Cell',
      target_value: 0,
      achieved_value: 0,
      status: 'ongoing',
      evidence_status: 'in-progress',
      next_review_date: '',
      notes: '',
    };
  }

  private async deleteMetric(row: IqacMetricRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete metric?',
      text: `Remove ${row.criterion_code} - ${row.title}?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.iqacService.deleteMetric(row.id);
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'IQAC metric removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this metric right now.',
      });
    }
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, metrics] = await Promise.all([
      this.iqacService.getSummary(instituteId),
      this.iqacService.getMetrics(instituteId),
    ]);

    this.summary.set(summary);
    this.metrics.set(metrics);

    const selectedId = this.selected()?.id;
    if (selectedId) {
      this.selected.set(metrics.find((row) => row.id === selectedId) ?? null);
    }
  }
}

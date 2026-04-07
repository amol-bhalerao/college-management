import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  MasterDataService,
  MasterEntryPayload,
  MasterEntryRow,
  MasterSummary,
} from '../../core/services/master-data.service';

@Component({
  selector: 'app-master-entries',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Institute setup</p>
          <h1>Master Entries</h1>
          <p>Manage reusable dropdown values for caste category, class, division, fees, forms, and enquiry sources.</p>
        </div>
        <button type="button" class="primary-btn" (click)="openCreate()">+ Add master entry</button>
      </div>

      <div class="stats-grid">
        <article><span>Total entries</span><strong>{{ summary().total }}</strong></article>
        <article><span>Active</span><strong>{{ summary().active }}</strong></article>
        <article><span>Types in use</span><strong>{{ summary().types }}</strong></article>
        <article><span>Fees + forms</span><strong>{{ summary().feeAndForms }}</strong></article>
      </div>

      <div class="quick-groups">
        @for (type of masterTypes; track type.value) {
          <article class="quick-group">
            <div class="quick-group__head">
              <strong>{{ type.label }}</strong>
              <button type="button" class="mini-btn" (click)="openCreate(type.value)">+ add</button>
            </div>
            <div class="quick-tags">
              @if (quickItems(type.value).length) {
                @for (entry of quickItems(type.value); track entry.id) {
                  <span class="tag">{{ entry.label }}</span>
                }
              } @else {
                <small>No entries yet.</small>
              }
            </div>
          </article>
        }
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Master register</h2>
            <p>These values are shown in forms and dropdowns across the ERP.</p>
          </div>
          <div class="grid-toolbar">
            <input
              class="search-field"
              type="search"
              [ngModel]="searchText()"
              (ngModelChange)="searchText.set($event)"
              placeholder="Search type, label, code..."
            />
            <span class="tag">Dropdown-ready</span>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz register-grid"
          [rowData]="entries()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [quickFilterText]="searchText()"
          [pagination]="true"
          [paginationPageSize]="8"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (showModal()) {
        <div class="detail-modal" (click)="closeModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveEntry()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update master entry' : 'Add master entry' }}</h2>
                <p>Keep these entries institute-specific so each campus can manage its own dropdown values.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Type
                <select name="master_type" [(ngModel)]="form.master_type" required>
                  @for (type of masterTypes; track type.value) {
                    <option [value]="type.value">{{ type.label }}</option>
                  }
                </select>
              </label>

              <label>
                Code
                <input type="text" name="code" [(ngModel)]="form.code" placeholder="Auto-generated if blank" />
              </label>

              <label>
                Label
                <input type="text" name="label" [(ngModel)]="form.label" required />
              </label>

              <label>
                Sort order
                <input type="number" min="1" name="sort_order" [(ngModel)]="form.sort_order" />
              </label>

              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>

              <label>
                Depends on value
                <input
                  type="text"
                  name="dependency_value"
                  [(ngModel)]="dependencyValue"
                  [placeholder]="dependencyHint()"
                />
              </label>

              <label>
                Dependency note
                <input type="text" name="dependency_note" [(ngModel)]="dependencyNote" placeholder="Optional helper note" />
              </label>

              <label class="full-span">
                Description
                <textarea rows="3" name="description" [(ngModel)]="form.description"></textarea>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update entry' : 'Create entry') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (selected(); as entry) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ entry.label }}</h2>
                <p>{{ typeLabel(entry.master_type) }} · {{ entry.code || 'No code' }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article><span>Type</span><strong>{{ typeLabel(entry.master_type) }}</strong><small>{{ entry.master_type }}</small></article>
              <article><span>Status</span><strong>{{ entry.status }}</strong><small>Sort: {{ entry.sort_order }}</small></article>
              <article><span>Dependency</span><strong>{{ dependencySummary(entry) }}</strong><small>{{ context.activeInstitute().name }}</small></article>
            </div>

            <div class="info-box">
              <strong>Description</strong>
              <p>{{ entry.description || 'No description added yet.' }}</p>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="openEdit(entry)">Edit entry</button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './master-entries.component.scss',
})
export class MasterEntriesComponent {
  protected readonly context = inject(AppContextService);
  private readonly masterService = inject(MasterDataService);

  protected readonly summary = signal<MasterSummary>({ total: 0, active: 0, types: 0, feeAndForms: 0 });
  protected readonly entries = signal<MasterEntryRow[]>([]);
  protected readonly selected = signal<MasterEntryRow | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly searchText = signal('');

  protected dependencyValue = '';
  protected dependencyNote = '';

  protected readonly masterTypes = [
    { value: 'caste_category', label: 'Caste / Category' },
    { value: 'class', label: 'Class' },
    { value: 'division', label: 'Division' },
    { value: 'fee_head', label: 'Fee Head' },
    { value: 'form_type', label: 'Form Type' },
    { value: 'enquiry_source', label: 'Enquiry Source' },
  ];

  protected form: MasterEntryPayload = this.createEmptyForm();

  protected readonly columnDefs: ColDef<MasterEntryRow>[] = [
    {
      field: 'master_type',
      headerName: 'Type',
      minWidth: 170,
      valueFormatter: (params) => this.typeLabel(String(params.value ?? '')),
    },
    { field: 'label', headerName: 'Label', minWidth: 180 },
    { field: 'code', headerName: 'Code', minWidth: 140 },
    { field: 'sort_order', headerName: 'Sort', maxWidth: 110 },
    { field: 'status', headerName: 'Status', maxWidth: 120 },
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

  protected quickItems(type: string): MasterEntryRow[] {
    return this.entries()
      .filter((entry) => entry.master_type === type && entry.status === 'active')
      .slice(0, 6);
  }

  protected typeLabel(type: string): string {
    return this.masterTypes.find((item) => item.value === type)?.label ?? type;
  }

  protected dependencyHint(): string {
    return this.form.master_type === 'division'
      ? 'Example: FYJC Science'
      : 'Optional parent value';
  }

  protected dependencySummary(entry: MasterEntryRow): string {
    const meta = this.parseMeta(entry.meta_json);
    return meta.parent_value || 'Independent value';
  }

  protected handleGridClick(event: { data?: MasterEntryRow; event?: Event | null }): void {
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
      void this.deleteEntry(event.data);
    }
  }

  protected openCreate(masterType = 'caste_category'): void {
    this.editingId.set(null);
    this.form = {
      ...this.createEmptyForm(),
      master_type: masterType,
    };
    this.dependencyValue = '';
    this.dependencyNote = '';
    this.showModal.set(true);
  }

  protected openEdit(entry: MasterEntryRow): void {
    this.editingId.set(entry.id);
    this.form = {
      master_type: entry.master_type,
      code: entry.code || '',
      label: entry.label,
      description: entry.description || '',
      sort_order: Number(entry.sort_order || 1),
      status: entry.status,
      meta_json: entry.meta_json || '',
    };

    const meta = this.parseMeta(entry.meta_json);
    this.dependencyValue = meta.parent_value || '';
    this.dependencyNote = meta.note || '';
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.form = this.createEmptyForm();
    this.dependencyValue = '';
    this.dependencyNote = '';
  }

  protected closeDetails(): void {
    this.selected.set(null);
  }

  protected async saveEntry(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: MasterEntryPayload = {
        ...this.form,
        institute_id: this.context.activeInstitute().id,
        meta_json: this.buildMetaJson(),
      };

      if (this.editingId()) {
        await this.masterService.updateEntry(this.editingId()!, payload);
      } else {
        await this.masterService.createEntry(payload);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Master entry saved successfully.' });
      this.closeModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Unable to save this master entry right now.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  private createEmptyForm(): MasterEntryPayload {
    return {
      institute_id: this.context.activeInstitute().id,
      master_type: 'caste_category',
      code: '',
      label: '',
      description: '',
      sort_order: 1,
      status: 'active',
      meta_json: '',
    };
  }

  private parseMeta(metaJson?: string | null): { parent_value?: string; note?: string } {
    if (!metaJson) {
      return {};
    }

    try {
      const parsed = JSON.parse(metaJson);
      return typeof parsed === 'object' && parsed ? parsed : {};
    } catch {
      return {};
    }
  }

  private buildMetaJson(): string {
    const payload: Record<string, string> = {};

    if (this.dependencyValue.trim()) {
      payload['parent_value'] = this.dependencyValue.trim();
    }

    if (this.dependencyNote.trim()) {
      payload['note'] = this.dependencyNote.trim();
    }

    return Object.keys(payload).length ? JSON.stringify(payload) : '';
  }

  private async deleteEntry(entry: MasterEntryRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete master entry?',
      text: `Remove ${entry.label} from ${this.typeLabel(entry.master_type)}?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.masterService.deleteEntry(entry.id);
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Master entry removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this entry right now.',
      });
    }
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, entries] = await Promise.all([
      this.masterService.getSummary(instituteId),
      this.masterService.getEntries(instituteId),
    ]);

    this.summary.set(summary);
    this.entries.set(entries);

    const selectedId = this.selected()?.id;
    if (selectedId) {
      this.selected.set(entries.find((entry) => entry.id === selectedId) ?? null);
    }
  }
}

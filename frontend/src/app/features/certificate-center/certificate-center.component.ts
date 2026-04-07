import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  CertificatePayload,
  CertificateRow,
  CertificateService,
  CertificateSummary,
  StudentDirectoryItem,
} from '../../core/services/certificate.service';

@Component({
  selector: 'app-certificate-center',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page certificate-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Clerk Desk</p>
          <h1>Certificate Center</h1>
          <p>Issue bonafide, transfer, ID card, and no-dues documents with institute-wise verification tokens.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="primary-btn" (click)="openFormModal()">+ New request</button>
          <span class="tag">QR / token verification ready</span>
        </div>
      </div>

      <div class="stats-grid">
        <article>
          <span>Total requests</span>
          <strong>{{ summary().total }}</strong>
        </article>
        <article>
          <span>Issued</span>
          <strong>{{ summary().issued }}</strong>
        </article>
        <article>
          <span>Requested</span>
          <strong>{{ summary().requested }}</strong>
        </article>
        <article>
          <span>Verified</span>
          <strong>{{ summary().verified }}</strong>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Certificate requests</h2>
            <p>Use row actions to view, update, delete, and print student-linked certificates.</p>
          </div>
          <div class="grid-toolbar">
            <input
              class="search-field"
              type="search"
              [ngModel]="searchText()"
              (ngModelChange)="searchText.set($event)"
              placeholder="Search request no, student, certificate..."
            />
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz certificate-grid"
          [rowData]="requests()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [quickFilterText]="searchText()"
          [pagination]="true"
          [paginationPageSize]="6"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (showFormModal()) {
        <div class="detail-modal" (click)="closeFormModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveRequest()">
            <div class="panel__header">
              <div>
                <h2>{{ editingRequestId() ? 'Update certificate request' : 'New certificate request' }}</h2>
                <p>Link each document to the student master and issue it when ready.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeFormModal()">Close</button>
            </div>

            <div class="form-grid">
              <label class="full-span">
                Student master
                <select name="student_id" [(ngModel)]="form.student_id" required>
                  <option [ngValue]="0">Select student</option>
                  @for (student of students(); track student.id) {
                    <option [ngValue]="student.id">{{ studentLabel(student) }}</option>
                  }
                </select>
              </label>

              <label>
                Certificate type
                <select name="certificate_type" [(ngModel)]="form.certificate_type" required>
                  @for (type of certificateTypes; track type) {
                    <option [value]="type">{{ formatType(type) }}</option>
                  }
                </select>
              </label>

              <label>
                Status
                <select name="status" [(ngModel)]="form.status">
                  @for (status of statusOptions; track status) {
                    <option [value]="status">{{ status }}</option>
                  }
                </select>
              </label>

              <label>
                Requested by
                <input type="text" name="requested_by" [(ngModel)]="form.requested_by" />
              </label>

              <label class="full-span">
                Purpose / remarks
                <textarea rows="3" name="purpose" [(ngModel)]="form.purpose"></textarea>
              </label>
            </div>

            <div class="action-row">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingRequestId() ? 'Update request' : 'Create request') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (selectedRequest(); as request) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card detail-card--wide" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ formatType(request.certificate_type) }}</h2>
                <p>{{ request.request_number }} · {{ request.institute_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article>
                <span>Student</span>
                <strong>{{ request.first_name }} {{ request.last_name }}</strong>
                <small>{{ request.gr_number || 'GR pending' }}</small>
              </article>
              <article>
                <span>Class</span>
                <strong>{{ request.current_class || '—' }}</strong>
                <small>{{ request.division || 'Division not set' }}</small>
              </article>
              <article>
                <span>Status</span>
                <strong>{{ request.status }}</strong>
                <small>{{ request.issued_on || 'Not issued yet' }}</small>
              </article>
              <article>
                <span>Guardian</span>
                <strong>{{ request.guardian_name || '—' }}</strong>
                <small>{{ request.mobile_number || 'No mobile saved' }}</small>
              </article>
              <article>
                <span>Requested by</span>
                <strong>{{ request.requested_by || 'Office desk' }}</strong>
                <small>Token: {{ request.verification_token || 'Pending' }}</small>
              </article>
              <article>
                <span>Email / DOB</span>
                <strong>{{ request.email || '—' }}</strong>
                <small>{{ request.dob || 'DOB not saved' }}</small>
              </article>
            </div>

            <div class="info-box">
              <strong>Purpose</strong>
              <p>{{ request.purpose || 'General student request.' }}</p>
            </div>

            <div id="certificate-print-surface" class="template-preview">
              @switch (request.certificate_type) {
                @case ('id_card') {
                  <section class="print-template id-card-template">
                    <div class="template-head">
                      <div>
                        <p>{{ request.institute_name }}</p>
                        <h3>Student Identity Card</h3>
                      </div>
                      <span>{{ context.activeAcademicYear() }}</span>
                    </div>
                    <div class="id-card-body">
                      <div class="avatar-badge">{{ studentInitials(request) }}</div>
                      <div class="student-meta">
                        <strong>{{ request.first_name }} {{ request.last_name }}</strong>
                        <span>GR No: {{ request.gr_number || 'Pending' }}</span>
                        <span>Class: {{ request.current_class || '—' }} {{ request.division || '' }}</span>
                        <span>Guardian: {{ request.guardian_name || '—' }}</span>
                        <span>Mobile: {{ request.mobile_number || '—' }}</span>
                      </div>
                    </div>
                  </section>
                }
                @case ('transfer_certificate') {
                  <section class="print-template tc-template official-document">
                    <div class="watermark">TC</div>

                    <header class="document-head">
                      <div class="letterhead">
                        <p class="template-label">{{ request.institute_header_title || request.institute_name }}</p>
                        <h3>School Leaving / Transfer Certificate</h3>
                        <p>{{ request.institute_header_subtitle || 'Academic office record' }}</p>
                        <small>{{ request.institute_header_address || 'Address not configured' }}</small>
                      </div>

                      <div class="document-meta">
                        <span><strong>Certificate No:</strong> {{ request.request_number }}</span>
                        <span><strong>Issue Date:</strong> {{ displayDate(request.issued_on) }}</span>
                        <span><strong>Academic Year:</strong> {{ context.activeAcademicYear() }}</span>
                      </div>
                    </header>

                    <div class="tc-sheet">
                      <div class="tc-line">
                        <span class="tc-index">1</span>
                        <div>
                          <label>Name of student</label>
                          <strong>{{ studentFullName(request) }}</strong>
                          <small>GR No: {{ request.gr_number || '—' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">2</span>
                        <div>
                          <label>Mother's / Guardian's name</label>
                          <strong>{{ request.mother_name || request.guardian_name || '—' }}</strong>
                          <small>Nationality: {{ request.nationality || 'Indian' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">3</span>
                        <div>
                          <label>Religion / Category / Caste</label>
                          <strong>{{ request.religion || '—' }} · {{ request.category || '—' }}</strong>
                          <small>{{ request.caste_subcaste || 'Sub-caste not recorded' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">4</span>
                        <div>
                          <label>Date of birth & place of birth</label>
                          <strong>{{ displayDate(request.dob) }} · {{ request.place_of_birth || '—' }}</strong>
                          <small>{{ request.date_of_birth_words || 'DOB in words pending' }} · {{ request.birth_taluka || '—' }}, {{ request.birth_district || '—' }}, {{ request.birth_state || '—' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">5</span>
                        <div>
                          <label>Date of admission & previous school</label>
                          <strong>{{ displayDate(request.date_of_admission) }}</strong>
                          <small>{{ request.previous_school || 'Previous school not recorded' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">6</span>
                        <div>
                          <label>Class last attended</label>
                          <strong>{{ request.class_last_attended || request.current_class || '—' }}</strong>
                          <small>Division: {{ request.division || '—' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">7</span>
                        <div>
                          <label>Date of leaving school / college</label>
                          <strong>{{ displayDate(request.date_of_leaving) }}</strong>
                          <small>{{ request.reason_for_leaving || request.purpose || 'Further academic transition.' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">8</span>
                        <div>
                          <label>Progress and conduct</label>
                          <strong>{{ request.progress_status || 'Good' }}</strong>
                          <small>Conduct: {{ request.conduct || 'Good' }}</small>
                        </div>
                      </div>

                      <div class="tc-line">
                        <span class="tc-index">9</span>
                        <div>
                          <label>Remarks</label>
                          <strong>{{ request.tc_remarks || 'No adverse remarks.' }}</strong>
                          <small>Requested by {{ request.requested_by || 'Office desk' }}</small>
                        </div>
                      </div>
                    </div>

                    <p class="tc-note">
                      Certified that the above particulars are taken from the General Register and are true to the best of the institution's knowledge.
                    </p>

                    <div class="signature-band">
                      <div>
                        <span>Date</span>
                        <strong>{{ displayDate(request.issued_on) }}</strong>
                      </div>
                      <div class="seal-box">Office Seal</div>
                      <div>
                        <span>Principal / Head of Institution</span>
                        <strong>{{ request.institute_principal_name || 'Principal' }}</strong>
                      </div>
                    </div>

                    <footer class="document-footer">
                      <small>{{ request.institute_footer_note || 'Document can be verified using the token below.' }}</small>
                      <small>Verification Token: {{ request.verification_token || 'Pending issue' }}</small>
                    </footer>
                  </section>
                }
                @case ('no_dues') {
                  <section class="print-template letter-template">
                    <p class="template-label">No Dues Certificate</p>
                    <h3>Office Clearance</h3>
                    <p>
                      This is to certify that <strong>{{ request.first_name }} {{ request.last_name }}</strong>
                      from <strong>{{ request.current_class || '—' }}</strong> has no pending dues with the institute
                      as per the latest office verification.
                    </p>
                    <p><strong>Purpose:</strong> {{ request.purpose || 'General institutional use.' }}</p>
                    <p class="signature-row">Accounts Office / Seal</p>
                  </section>
                }
                @default {
                  <section class="print-template letter-template">
                    <p class="template-label">Bonafide Certificate</p>
                    <h3>Student Bonafide</h3>
                    <p>
                      This is to certify that <strong>{{ request.first_name }} {{ request.last_name }}</strong>,
                      child of <strong>{{ request.guardian_name || '—' }}</strong>, is a bona fide student of
                      <strong>{{ request.institute_name }}</strong> in <strong>{{ request.current_class || '—' }}</strong>
                      for the academic year <strong>{{ context.activeAcademicYear() }}</strong>.
                    </p>
                    <p><strong>Purpose:</strong> {{ request.purpose || 'Official student verification.' }}</p>
                    <p class="signature-row">Principal / Office Seal</p>
                  </section>
                }
              }
            </div>

            <div class="action-row">
              @if (request.status !== 'issued') {
                <button type="button" class="primary-btn" (click)="issueSelected()" [disabled]="isBusy()">
                  {{ isBusy() ? 'Issuing...' : 'Issue certificate' }}
                </button>
              }

              <button type="button" class="ghost-btn" (click)="printSelected()">Print template</button>
              <button type="button" class="ghost-btn" (click)="openFormModal(request)">Edit request</button>

              @if (request.verification_token) {
                <a class="ghost-btn link-btn" [href]="verifyUrl(request.verification_token)" target="_blank" rel="noreferrer">
                  Open verification
                </a>
              }
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './certificate-center.component.scss',
})
export class CertificateCenterComponent {
  protected readonly context = inject(AppContextService);
  private readonly certificateService = inject(CertificateService);

  protected readonly summary = signal<CertificateSummary>({ total: 0, issued: 0, requested: 0, verified: 0 });
  protected readonly requests = signal<CertificateRow[]>([]);
  protected readonly students = signal<StudentDirectoryItem[]>([]);
  protected readonly selectedRequest = signal<CertificateRow | null>(null);
  protected readonly showFormModal = signal(false);
  protected readonly editingRequestId = signal<number | null>(null);
  protected readonly isBusy = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly searchText = signal('');

  protected readonly certificateTypes = ['bonafide', 'transfer_certificate', 'id_card', 'no_dues'];
  protected readonly statusOptions = ['requested', 'verified', 'issued'];

  protected form: CertificatePayload = this.createEmptyForm();

  protected readonly columnDefs: ColDef<CertificateRow>[] = [
    { field: 'request_number', headerName: 'Request No', minWidth: 150 },
    {
      field: 'certificate_type',
      headerName: 'Certificate',
      valueFormatter: (params) => this.formatType(String(params.value ?? '')),
      minWidth: 160,
    },
    {
      headerName: 'Student',
      valueGetter: (params) => `${params.data?.first_name ?? ''} ${params.data?.last_name ?? ''}`.trim(),
      minWidth: 180,
    },
    { field: 'gr_number', headerName: 'GR No' },
    { field: 'status', headerName: 'Status' },
    { field: 'issued_on', headerName: 'Issued On' },
    {
      headerName: 'Actions',
      minWidth: 220,
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
      const instituteId = this.context.activeInstitute().id;
      void this.loadData(instituteId);
    });
  }

  protected handleGridClick(event: { data?: CertificateRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action || action === 'view') {
      this.openDetails(event.data);
      return;
    }

    if (action === 'edit') {
      this.openFormModal(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteRequest(event.data);
    }
  }

  protected openFormModal(request?: CertificateRow): void {
    if (request) {
      this.editingRequestId.set(request.id);
      this.form = {
        student_id: request.student_id,
        institute_id: request.institute_id,
        academic_year_id: request.academic_year_id,
        certificate_type: request.certificate_type,
        purpose: request.purpose || '',
        status: request.status,
        requested_by: request.requested_by || 'Clerk Desk',
      };
    } else {
      this.editingRequestId.set(null);
      this.form = {
        ...this.createEmptyForm(),
        student_id: this.students()[0]?.id ?? 0,
      };
    }

    this.showFormModal.set(true);
  }

  protected closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingRequestId.set(null);
    this.form = this.createEmptyForm();
  }

  protected openDetails(row?: CertificateRow): void {
    if (!row) {
      return;
    }

    this.selectedRequest.set(row);
  }

  protected closeDetails(): void {
    this.selectedRequest.set(null);
  }

  protected formatType(value: string): string {
    const map: Record<string, string> = {
      id_card: 'ID Card',
      transfer_certificate: 'Transfer Certificate',
      no_dues: 'No Dues',
      bonafide: 'Bonafide',
    };

    return map[value] ?? value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  protected studentLabel(student: StudentDirectoryItem): string {
    return `${student.gr_number || 'GR pending'} · ${student.first_name || ''} ${student.last_name || ''} · ${student.current_class || 'Class pending'}`.trim();
  }

  protected studentInitials(request: CertificateRow): string {
    const first = request.first_name?.charAt(0) ?? '';
    const last = request.last_name?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || 'ST';
  }

  protected studentFullName(request: CertificateRow): string {
    return `${request.first_name || ''} ${request.last_name || ''}`.trim() || '—';
  }

  protected displayDate(value?: string | null): string {
    if (!value) {
      return '—';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsed);
  }

  protected verifyUrl(token: string): string {
    return `http://127.0.0.1:8080/api/verify/certificate/${token}`;
  }

  protected async saveRequest(): Promise<void> {
    if (!this.form.student_id) {
      await Swal.fire({ icon: 'warning', title: 'Student required', text: 'Please select a student master record first.' });
      return;
    }

    this.isSaving.set(true);

    try {
      if (this.editingRequestId()) {
        await this.certificateService.updateRequest(this.editingRequestId()!, this.form);
      } else {
        await this.certificateService.createRequest(this.form);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: this.editingRequestId() ? 'Certificate request updated successfully.' : 'Certificate request created successfully.',
      });
      this.closeFormModal();
      await this.loadData(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the request details and try again.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async issueSelected(): Promise<void> {
    const request = this.selectedRequest();
    if (!request) {
      return;
    }

    this.isBusy.set(true);

    try {
      await this.certificateService.issueRequest(request.id);
      await this.loadData(this.context.activeInstitute().id);
      const updated = this.requests().find((row) => row.id === request.id) ?? null;
      this.selectedRequest.set(updated);
      await Swal.fire({ icon: 'success', title: 'Issued', text: 'Certificate marked as issued successfully.' });
    } finally {
      this.isBusy.set(false);
    }
  }

  protected printSelected(): void {
    const printMarkup = document.getElementById('certificate-print-surface')?.innerHTML;

    if (!printMarkup) {
      return;
    }

    const popup = window.open('', '_blank', 'width=960,height=720');
    if (!popup) {
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>Certificate Print</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; padding: 0; margin: 0; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-template { position: relative; border: 1px solid #cbd5e1; border-radius: 16px; padding: 18px 20px; background: #fff; }
            .template-head, .id-card-body, .document-head, .signature-band { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
            .template-label { color: #312e81; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
            .avatar-badge { width: 80px; height: 80px; border-radius: 50%; background: #e0e7ff; display:flex; align-items:center; justify-content:center; font-size: 28px; font-weight: 700; }
            .student-meta { display:grid; gap: 6px; }
            .letterhead h3, .letter-template h3 { margin: 6px 0; }
            .letterhead p, .letterhead small, .document-meta span, .document-footer small, .tc-note, .student-meta span { display:block; }
            .document-head { align-items: flex-start; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; }
            .document-meta { min-width: 220px; display: grid; gap: 6px; font-size: 12px; text-align: right; }
            .official-document { overflow: hidden; }
            .watermark { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); font-size: 100px; font-weight: 700; color: rgba(30, 64, 175, 0.06); pointer-events: none; }
            .tc-sheet { display: grid; gap: 8px; margin-top: 10px; }
            .tc-line { display: grid; grid-template-columns: 32px 1fr; gap: 10px; padding: 9px 10px; border: 1px solid #dbe4ff; border-radius: 10px; background: #f8fbff; }
            .tc-index { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 999px; background: #1d4ed8; color: #fff; font-size: 12px; font-weight: 700; }
            .tc-line label { display: block; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 3px; }
            .tc-line strong { display: block; font-size: 15px; }
            .tc-line small { display: block; margin-top: 2px; color: #475569; }
            .tc-note { margin: 14px 0 10px; font-style: italic; }
            .signature-band { margin-top: 18px; align-items: end; }
            .seal-box { min-width: 110px; min-height: 58px; border: 1px dashed #64748b; border-radius: 10px; display: grid; place-items: center; font-size: 12px; color: #475569; }
            .document-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid #cbd5e1; display: grid; gap: 4px; }
            .detail-grid { display: grid; gap: 10px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .detail-grid article { padding: 10px; border: 1px solid #dbe4ff; border-radius: 10px; background: #f8fbff; }
            .detail-grid span { display:block; margin-bottom: 4px; font-size: 12px; color: #475569; text-transform: uppercase; }
            .detail-grid strong { display:block; }
            .detail-grid small { color: #475569; }
            .signature-row { margin-top: 30px; font-weight: 700; }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printMarkup}</body>
      </html>
    `);
    popup.document.close();
  }

  private createEmptyForm(): CertificatePayload {
    return {
      student_id: 0,
      institute_id: this.context.activeInstitute().id,
      certificate_type: 'bonafide',
      purpose: '',
      status: 'requested',
      requested_by: 'Clerk Desk',
    };
  }

  private async deleteRequest(request: CertificateRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete request?',
      text: `Remove ${request.request_number} from the certificate register?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.certificateService.deleteRequest(request.id);
      this.closeDetails();
      await this.loadData(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Certificate request removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this certificate request right now.',
      });
    }
  }

  private async loadData(instituteId: number): Promise<void> {
    const [summary, requests, students] = await Promise.all([
      this.certificateService.getSummary(instituteId),
      this.certificateService.getRequests(instituteId),
      this.certificateService.getStudents(instituteId),
    ]);

    this.summary.set(summary);
    this.requests.set(requests);
    this.students.set(students);

    const selectedId = this.selectedRequest()?.id;
    if (selectedId) {
      this.selectedRequest.set(requests.find((row) => row.id === selectedId) ?? null);
    }
  }
}

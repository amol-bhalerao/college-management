import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { CertificateRow, CertificateService, CertificateSummary } from '../../core/services/certificate.service';

@Component({
  selector: 'app-certificate-center',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
    <section class="page certificate-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Clerk Desk</p>
          <h1>Certificate Center</h1>
          <p>Issue bonafide, transfer, and no-dues certificates with institute-wise verification tokens.</p>
        </div>
        <span class="tag">QR / token verification ready</span>
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
            <p>Click a row to review the student, purpose, and verification status.</p>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz certificate-grid"
          [rowData]="requests()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="6"
          [animateRows]="true"
          (rowClicked)="openDetails($event.data)"
        ></ag-grid-angular>
      </article>

      @if (selectedRequest()) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ formatType(selectedRequest()!.certificate_type) }}</h2>
                <p>{{ selectedRequest()!.request_number }} · {{ selectedRequest()!.institute_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <article>
                <span>Student</span>
                <strong>{{ selectedRequest()!.first_name }} {{ selectedRequest()!.last_name }}</strong>
                <small>{{ selectedRequest()!.gr_number }}</small>
              </article>
              <article>
                <span>Status</span>
                <strong>{{ selectedRequest()!.status }}</strong>
                <small>{{ selectedRequest()!.issued_on || 'Not issued yet' }}</small>
              </article>
              <article>
                <span>Requested by</span>
                <strong>{{ selectedRequest()!.requested_by || 'Office desk' }}</strong>
                <small>Verification token: {{ selectedRequest()!.verification_token || 'Pending' }}</small>
              </article>
            </div>

            <div class="info-box">
              <strong>Purpose</strong>
              <p>{{ selectedRequest()!.purpose || 'General student request.' }}</p>
            </div>

            <div class="action-row">
              @if (selectedRequest()!.status !== 'issued') {
                <button type="button" class="primary-btn" (click)="issueSelected()" [disabled]="isBusy()">
                  {{ isBusy() ? 'Issuing...' : 'Issue certificate' }}
                </button>
              }

              @if (selectedRequest()!.verification_token) {
                <a class="ghost-btn link-btn" [href]="verifyUrl(selectedRequest()!.verification_token!)" target="_blank" rel="noreferrer">
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
  protected readonly selectedRequest = signal<CertificateRow | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly columnDefs: ColDef<CertificateRow>[] = [
    { field: 'request_number', headerName: 'Request No' },
    {
      field: 'certificate_type',
      headerName: 'Certificate',
      valueFormatter: (params) => this.formatType(String(params.value ?? '')),
    },
    {
      headerName: 'Student',
      valueGetter: (params) => `${params.data?.first_name ?? ''} ${params.data?.last_name ?? ''}`.trim(),
      minWidth: 180,
    },
    { field: 'gr_number', headerName: 'GR No' },
    { field: 'status', headerName: 'Status' },
    { field: 'issued_on', headerName: 'Issued On' },
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
    return value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  protected verifyUrl(token: string): string {
    return `http://127.0.0.1:8080/api/verify/certificate/${token}`;
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

  private async loadData(instituteId: number): Promise<void> {
    const [summary, requests] = await Promise.all([
      this.certificateService.getSummary(instituteId),
      this.certificateService.getRequests(instituteId),
    ]);

    this.summary.set(summary);
    this.requests.set(requests);

    const selectedId = this.selectedRequest()?.id;
    if (selectedId) {
      this.selectedRequest.set(requests.find((row) => row.id === selectedId) ?? null);
    }
  }
}

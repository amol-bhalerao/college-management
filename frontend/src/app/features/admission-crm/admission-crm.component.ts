import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { AdmissionService, EnquiryRow, EnquirySummary } from '../../core/services/admission.service';

@Component({
  selector: 'app-admission-crm',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Clerk workflow</p>
          <h1>Enquiry & Admission CRM</h1>
          <p>Track website leads, walk-ins, follow-ups, and convert enquiries into admissions in one flow.</p>
        </div>
        <span class="tag">WhatsApp-ready follow-up</span>
      </div>

      <div class="stats-grid">
        <article>
          <span>Total enquiries</span>
          <strong>{{ summary().total }}</strong>
        </article>
        <article>
          <span>New / contacted</span>
          <strong>{{ summary().new }}</strong>
        </article>
        <article>
          <span>Follow-up queue</span>
          <strong>{{ summary().followUp }}</strong>
        </article>
        <article>
          <span>Converted</span>
          <strong>{{ summary().converted }} ({{ summary().conversionRate }}%)</strong>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Lead register</h2>
            <p>AG Grid table with institute-aware filters and quick conversion actions.</p>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz crm-grid"
          [rowData]="rowData()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="6"
          [animateRows]="true"
          (rowClicked)="openDetails($event.data)"
        ></ag-grid-angular>
      </article>

      @if (selectedEnquiry(); as enquiry) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ enquiry.student_name }}</h2>
                <p>{{ enquiry.enquiry_number }} · {{ enquiry.desired_course || 'Course not specified' }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-grid">
              <div><span>Source</span><strong>{{ enquiry.source || '—' }}</strong></div>
              <div><span>Status</span><strong>{{ enquiry.status }}</strong></div>
              <div><span>Assigned to</span><strong>{{ enquiry.assigned_to || 'Unassigned' }}</strong></div>
              <div><span>Follow-up</span><strong>{{ enquiry.follow_up_date || 'Not scheduled' }}</strong></div>
            </div>

            <div class="notes-box">
              <span>Notes</span>
              <p>{{ enquiry.notes || 'No notes added yet.' }}</p>
            </div>

            <div class="actions">
              <button type="button" class="primary-btn" (click)="convertSelected(enquiry)">Convert to admission</button>
              <a class="whatsapp-btn" [href]="buildWhatsAppLink(enquiry)" target="_blank" rel="noreferrer">Send WhatsApp reminder</a>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './admission-crm.component.scss',
})
export class AdmissionCrmComponent {
  protected readonly context = inject(AppContextService);
  private readonly admissionService = inject(AdmissionService);

  protected readonly summary = signal<EnquirySummary>({ total: 0, converted: 0, new: 0, followUp: 0, conversionRate: 0 });
  protected readonly rowData = signal<EnquiryRow[]>([]);
  protected readonly selectedEnquiry = signal<EnquiryRow | null>(null);

  protected readonly columnDefs: ColDef<EnquiryRow>[] = [
    { field: 'enquiry_number', headerName: 'Enquiry No.' },
    { field: 'student_name', headerName: 'Student' },
    { field: 'source', headerName: 'Source' },
    { field: 'desired_course', headerName: 'Desired Course' },
    { field: 'status', headerName: 'Status' },
    { field: 'assigned_to', headerName: 'Assigned To' },
    { field: 'follow_up_date', headerName: 'Follow-Up' },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 130,
  };

  constructor() {
    effect(() => {
      const instituteId = this.context.activeInstitute().id;
      void this.load(instituteId);
    });
  }

  protected openDetails(row?: EnquiryRow): void {
    if (row) {
      this.selectedEnquiry.set(row);
    }
  }

  protected closeDetails(): void {
    this.selectedEnquiry.set(null);
  }

  protected async convertSelected(enquiry: EnquiryRow): Promise<void> {
    await this.admissionService.convertEnquiry(enquiry.id);
    await Swal.fire({ icon: 'success', title: 'Converted', text: 'The enquiry has been converted into an admission record.' });
    this.closeDetails();
    await this.load(this.context.activeInstitute().id);
  }

  protected buildWhatsAppLink(enquiry: EnquiryRow): string {
    const phone = (enquiry.mobile_number ?? '').replace(/\D/g, '');
    const message = encodeURIComponent(`Dear ${enquiry.student_name}, this is a reminder from ${this.context.activeInstitute().name} regarding your admission enquiry ${enquiry.enquiry_number}. Please complete the next step.`);
    return `https://wa.me/91${phone}?text=${message}`;
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, enquiries] = await Promise.all([
      this.admissionService.getSummary(instituteId),
      this.admissionService.getEnquiries(instituteId),
    ]);

    this.summary.set(summary);
    this.rowData.set(enquiries);
  }
}

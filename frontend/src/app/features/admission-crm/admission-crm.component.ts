import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  AdmissionRecord,
  AdmissionService,
  AdmissionWizardPayload,
  EnquiryPayload,
  EnquiryRow,
  EnquirySummary,
} from '../../core/services/admission.service';

@Component({
  selector: 'app-admission-crm',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Clerk workflow</p>
          <h1>Enquiry, Admission Wizard & Student Master</h1>
          <p>Track leads, complete the admission form in steps, and create the student master from the same flow.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="secondary-btn" (click)="openEnquiryForm()">+ Add enquiry</button>
          <button type="button" class="primary-btn" (click)="openWizard(selectedEnquiry())" [disabled]="!selectedEnquiry()">
            Start admission wizard
          </button>
        </div>
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
            <p>Use row actions to view, edit, delete, or start the admission wizard from the same grid.</p>
          </div>
          <span class="tag">Wizard-ready</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz crm-grid"
          [rowData]="rowData()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="6"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Recent confirmed admissions</h2>
            <p>Student master and admission records created through the admissions desk.</p>
          </div>
          <span class="tag tag--accent">Student master</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz admissions-grid"
          [rowData]="recentAdmissions()"
          [columnDefs]="admissionColumnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="5"
          [animateRows]="true"
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
              <button type="button" class="primary-btn" (click)="openWizard(enquiry)">Start admission form</button>
              <button type="button" class="secondary-btn" (click)="openEnquiryForm(enquiry)">Edit enquiry</button>
              <button type="button" class="secondary-btn" (click)="convertSelected(enquiry)">Quick convert</button>
              <a class="whatsapp-btn" [href]="buildWhatsAppLink(enquiry)" target="_blank" rel="noreferrer">Send WhatsApp reminder</a>
            </div>
          </div>
        </div>
      }

      @if (showEnquiryForm()) {
        <div class="detail-modal" (click)="closeEnquiryForm()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveEnquiry()">
            <div class="panel__header">
              <div>
                <h2>{{ editingEnquiryId() ? 'Update enquiry' : 'Add new enquiry' }}</h2>
                <p>Capture new lead details or update follow-up progress from the same desk.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeEnquiryForm()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Student name
                <input type="text" name="student_name" [(ngModel)]="enquiryForm.student_name" required />
              </label>
              <label>
                Mobile number
                <input type="text" name="mobile_number" [(ngModel)]="enquiryForm.mobile_number" />
              </label>
              <label>
                Email
                <input type="email" name="email" [(ngModel)]="enquiryForm.email" />
              </label>
              <label>
                Source
                <input type="text" name="source" [(ngModel)]="enquiryForm.source" />
              </label>
              <label>
                Desired course
                <input type="text" name="desired_course" [(ngModel)]="enquiryForm.desired_course" />
              </label>
              <label>
                Current class
                <input type="text" name="current_class" [(ngModel)]="enquiryForm.current_class" />
              </label>
              <label>
                Category
                <input type="text" name="category" [(ngModel)]="enquiryForm.category" />
              </label>
              <label>
                Status
                <select name="status" [(ngModel)]="enquiryForm.status">
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="follow-up">follow-up</option>
                  <option value="converted">converted</option>
                </select>
              </label>
              <label>
                Assigned to
                <input type="text" name="assigned_to" [(ngModel)]="enquiryForm.assigned_to" />
              </label>
              <label>
                Follow-up date
                <input type="date" name="follow_up_date" [(ngModel)]="enquiryForm.follow_up_date" />
              </label>
              <label class="full-span">
                Notes
                <textarea rows="3" name="notes" [(ngModel)]="enquiryForm.notes"></textarea>
              </label>
            </div>

            <div class="actions wizard-actions">
              <button type="submit" class="primary-btn" [disabled]="isEnquirySaving()">
                {{ isEnquirySaving() ? 'Saving...' : (editingEnquiryId() ? 'Update enquiry' : 'Create enquiry') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (showWizard()) {
        <div class="detail-modal" (click)="closeWizard()">
          <form class="detail-card wizard-card" (click)="$event.stopPropagation()" (ngSubmit)="submitWizard()">
            <div class="panel__header">
              <div>
                <h2>Admission form wizard</h2>
                <p>{{ selectedEnquiry()?.enquiry_number }} · {{ selectedEnquiry()?.student_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeWizard()">Close</button>
            </div>

            <div class="wizard-steps">
              @for (step of [1, 2, 3]; track step) {
                <div class="step-chip" [class.active]="wizardStep() === step">Step {{ step }}</div>
              }
            </div>

            @if (wizardStep() === 1) {
              <div class="form-grid">
                <label>
                  First name
                  <input type="text" name="first_name" [(ngModel)]="wizardForm.first_name" required />
                </label>
                <label>
                  Last name
                  <input type="text" name="last_name" [(ngModel)]="wizardForm.last_name" required />
                </label>
                <label>
                  Gender
                  <select name="gender" [(ngModel)]="wizardForm.gender">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Date of birth
                  <input type="date" name="dob" [(ngModel)]="wizardForm.dob" />
                </label>
              </div>
            }

            @if (wizardStep() === 2) {
              <div class="form-grid">
                <label>
                  Mobile number
                  <input type="text" name="mobile_number" [(ngModel)]="wizardForm.mobile_number" />
                </label>
                <label>
                  Email
                  <input type="email" name="email" [(ngModel)]="wizardForm.email" />
                </label>
                <label>
                  Guardian name
                  <input type="text" name="guardian_name" [(ngModel)]="wizardForm.guardian_name" />
                </label>
                <label class="full-span">
                  Address
                  <textarea rows="3" name="address" [(ngModel)]="wizardForm.address"></textarea>
                </label>
              </div>
            }

            @if (wizardStep() === 3) {
              <div class="form-grid">
                <label>
                  Course / class
                  <input type="text" name="current_class" [(ngModel)]="wizardForm.current_class" />
                </label>
                <label>
                  Division
                  <input type="text" name="division" [(ngModel)]="wizardForm.division" />
                </label>
                <label>
                  Category
                  <input type="text" name="category" [(ngModel)]="wizardForm.category" />
                </label>
                <label class="full-span">
                  Admission remarks
                  <textarea rows="3" name="remarks" [(ngModel)]="wizardForm.remarks"></textarea>
                </label>
              </div>
            }

            <div class="actions wizard-actions">
              <button type="button" class="ghost-btn" (click)="prevStep()" [disabled]="wizardStep() === 1">Back</button>

              @if (wizardStep() < 3) {
                <button type="button" class="primary-btn" (click)="nextStep()">Next step</button>
              } @else {
                <button type="submit" class="primary-btn" [disabled]="isSaving()">
                  {{ isSaving() ? 'Creating...' : 'Create student master + admission' }}
                </button>
              }
            </div>
          </form>
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
  protected readonly recentAdmissions = signal<AdmissionRecord[]>([]);
  protected readonly selectedEnquiry = signal<EnquiryRow | null>(null);
  protected readonly showWizard = signal(false);
  protected readonly showEnquiryForm = signal(false);
  protected readonly wizardStep = signal(1);
  protected readonly isSaving = signal(false);
  protected readonly isEnquirySaving = signal(false);
  protected readonly editingEnquiryId = signal<number | null>(null);

  protected wizardForm: AdmissionWizardPayload = this.createEmptyForm();
  protected enquiryForm: EnquiryPayload = this.createEmptyEnquiryForm();

  protected readonly columnDefs: ColDef<EnquiryRow>[] = [
    { field: 'enquiry_number', headerName: 'Enquiry No.' },
    { field: 'student_name', headerName: 'Student', minWidth: 180 },
    { field: 'source', headerName: 'Source' },
    { field: 'desired_course', headerName: 'Desired Course', minWidth: 170 },
    { field: 'status', headerName: 'Status' },
    { field: 'assigned_to', headerName: 'Assigned To', minWidth: 160 },
    { field: 'follow_up_date', headerName: 'Follow-Up' },
    {
      headerName: 'Actions',
      minWidth: 260,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: () => `
        <div class="grid-actions">
          <button type="button" class="grid-action" data-action="view">View</button>
          <button type="button" class="grid-action" data-action="edit">Edit</button>
          <button type="button" class="grid-action" data-action="admit">Admit</button>
          <button type="button" class="grid-action grid-action--danger" data-action="delete">Delete</button>
        </div>
      `,
    },
  ];

  protected readonly admissionColumnDefs: ColDef<AdmissionRecord>[] = [
    { field: 'admission_number', headerName: 'Admission No.' },
    { field: 'student_name', headerName: 'Student' },
    { field: 'gr_number', headerName: 'GR No.' },
    { field: 'desired_course', headerName: 'Course' },
    { field: 'status', headerName: 'Status' },
    { field: 'admitted_on', headerName: 'Admitted On' },
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

  protected handleGridClick(event: { data?: EnquiryRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action) {
      this.openDetails(event.data);
      return;
    }

    if (action === 'view') {
      this.openDetails(event.data);
      return;
    }

    if (action === 'edit') {
      this.openEnquiryForm(event.data);
      return;
    }

    if (action === 'admit') {
      this.openWizard(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteEnquiry(event.data);
    }
  }

  protected openDetails(row?: EnquiryRow): void {
    if (row) {
      this.selectedEnquiry.set(row);
    }
  }

  protected closeDetails(): void {
    this.selectedEnquiry.set(null);
  }

  protected openEnquiryForm(enquiry?: EnquiryRow): void {
    if (enquiry) {
      this.editingEnquiryId.set(enquiry.id);
      this.enquiryForm = {
        institute_id: this.context.activeInstitute().id,
        student_name: enquiry.student_name,
        mobile_number: enquiry.mobile_number || '',
        email: enquiry.email || '',
        source: enquiry.source || 'Walk-in',
        desired_course: enquiry.desired_course || '',
        current_class: enquiry.current_class || '',
        category: enquiry.category || '',
        status: enquiry.status,
        assigned_to: enquiry.assigned_to || 'Admissions Desk',
        follow_up_date: enquiry.follow_up_date || '',
        notes: enquiry.notes || '',
      };
    } else {
      this.editingEnquiryId.set(null);
      this.enquiryForm = this.createEmptyEnquiryForm();
    }

    this.showEnquiryForm.set(true);
  }

  protected closeEnquiryForm(): void {
    this.showEnquiryForm.set(false);
    this.editingEnquiryId.set(null);
    this.enquiryForm = this.createEmptyEnquiryForm();
  }

  protected openWizard(enquiry: EnquiryRow | null): void {
    if (!enquiry) {
      return;
    }

    this.selectedEnquiry.set(enquiry);
    this.wizardForm = this.createFormFromEnquiry(enquiry);
    this.wizardStep.set(1);
    this.showWizard.set(true);
  }

  protected closeWizard(): void {
    this.showWizard.set(false);
    this.wizardStep.set(1);
  }

  protected nextStep(): void {
    if (this.wizardStep() === 1 && (!this.wizardForm.first_name || !this.wizardForm.last_name)) {
      void Swal.fire({ icon: 'warning', title: 'Student name required', text: 'Please fill first and last name before proceeding.' });
      return;
    }

    this.wizardStep.update((step) => Math.min(step + 1, 3));
  }

  protected prevStep(): void {
    this.wizardStep.update((step) => Math.max(step - 1, 1));
  }

  protected async saveEnquiry(): Promise<void> {
    this.isEnquirySaving.set(true);

    try {
      const payload: EnquiryPayload = {
        ...this.enquiryForm,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingEnquiryId()) {
        await this.admissionService.updateEnquiry(this.editingEnquiryId()!, payload);
      } else {
        await this.admissionService.createEnquiry(payload);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: this.editingEnquiryId() ? 'Enquiry updated successfully.' : 'New enquiry added successfully.',
      });
      this.closeEnquiryForm();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Please review the enquiry details and try again.',
      });
    } finally {
      this.isEnquirySaving.set(false);
    }
  }

  protected async convertSelected(enquiry: EnquiryRow): Promise<void> {
    try {
      await this.admissionService.convertEnquiry(enquiry.id);
      await Swal.fire({ icon: 'success', title: 'Converted', text: 'The enquiry has been converted into an admission record.' });
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Conversion failed',
        text: error?.error?.message || 'Unable to convert this enquiry right now.',
      });
    }
  }

  protected async submitWizard(): Promise<void> {
    if (!this.selectedEnquiry()) {
      return;
    }

    this.isSaving.set(true);

    try {
      const response = await this.admissionService.createAdmission(this.wizardForm);
      await Swal.fire({
        icon: 'success',
        title: 'Admission completed',
        text: `${response.admission.admission_number} created with student master record.`,
      });
      this.closeWizard();
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
    } catch {
      await Swal.fire({ icon: 'error', title: 'Admission failed', text: 'Please verify the form details and try again.' });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected buildWhatsAppLink(enquiry: EnquiryRow): string {
    const phone = (enquiry.mobile_number ?? '').replace(/\D/g, '');
    const message = encodeURIComponent(`Dear ${enquiry.student_name}, this is a reminder from ${this.context.activeInstitute().name} regarding your admission enquiry ${enquiry.enquiry_number}. Please complete the next step.`);
    return `https://wa.me/91${phone}?text=${message}`;
  }

  private createEmptyEnquiryForm(): EnquiryPayload {
    return {
      institute_id: this.context.activeInstitute().id,
      student_name: '',
      mobile_number: '',
      email: '',
      source: 'Walk-in',
      desired_course: '',
      current_class: '',
      category: '',
      status: 'new',
      assigned_to: 'Admissions Desk',
      follow_up_date: '',
      notes: '',
    };
  }

  private createEmptyForm(): AdmissionWizardPayload {
    return {
      enquiry_id: 0,
      first_name: '',
      last_name: '',
      guardian_name: '',
      gender: '',
      dob: '',
      mobile_number: '',
      email: '',
      address: '',
      current_class: '',
      division: 'A',
      category: '',
      remarks: 'Admission wizard completed.',
    };
  }

  private createFormFromEnquiry(enquiry: EnquiryRow): AdmissionWizardPayload {
    const [firstName, ...rest] = (enquiry.student_name || '').trim().split(/\s+/);

    return {
      enquiry_id: enquiry.id,
      first_name: firstName || '',
      last_name: rest.join(' '),
      guardian_name: '',
      gender: '',
      dob: '',
      mobile_number: enquiry.mobile_number || '',
      email: enquiry.email || '',
      address: '',
      current_class: enquiry.desired_course || enquiry.current_class || '',
      division: 'A',
      category: enquiry.category || '',
      remarks: `Admitted from enquiry ${enquiry.enquiry_number}.`,
    };
  }

  private async deleteEnquiry(enquiry: EnquiryRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete enquiry?',
      text: `Remove ${enquiry.student_name} from the lead register?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.admissionService.deleteEnquiry(enquiry.id);
      this.closeDetails();
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Enquiry removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this enquiry right now.',
      });
    }
  }

  private async load(instituteId: number): Promise<void> {
    const [summary, enquiries, admissions] = await Promise.all([
      this.admissionService.getSummary(instituteId),
      this.admissionService.getEnquiries(instituteId),
      this.admissionService.getRecentAdmissions(instituteId),
    ]);

    this.summary.set(summary);
    this.rowData.set(enquiries);
    this.recentAdmissions.set(admissions);

    const selectedId = this.selectedEnquiry()?.id;
    if (selectedId) {
      this.selectedEnquiry.set(enquiries.find((row) => row.id === selectedId) ?? null);
    }
  }
}

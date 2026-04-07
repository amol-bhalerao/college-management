import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AuthService } from '../../core/services/auth.service';
import { AppContextService } from '../../core/services/context.service';
import {
  StudentMasterPayload,
  StudentMasterRow,
  StudentMasterService,
} from '../../core/services/student-master.service';
import { MasterDataService, MasterOptionsMap } from '../../core/services/master-data.service';

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
        <div class="page-actions">
          <button type="button" class="secondary-btn" (click)="exportStudents()">Export CSV</button>
          @if (canManageStudents()) {
            <button type="button" class="secondary-btn" (click)="promoteSelected()" [disabled]="selectedStudentIds().length === 0">Promote selected</button>
            <button type="button" class="primary-btn" (click)="openCreate()">+ Add student</button>
          } @else {
            <span class="tag">Read-only admin view</span>
          }
        </div>
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
          <div class="grid-toolbar">
            <input
              class="search-field"
              type="search"
              [ngModel]="searchText()"
              (ngModelChange)="searchText.set($event)"
              placeholder="Search GR no, student, class..."
            />
            <select [(ngModel)]="filters.current_class">
              <option value="">All classes</option>
              @for (option of optionValues('class'); track option.id) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
            <select [(ngModel)]="filters.category">
              <option value="">All categories</option>
              @for (option of optionValues('caste_category'); track option.id) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
            <select [(ngModel)]="filters.status">
              <option value="">All status</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <button type="button" class="ghost-btn" (click)="applyFilters()">Search DB</button>
            <button type="button" class="ghost-btn" (click)="resetFilters()">Reset</button>
            <span class="tag">Institute-aware directory</span>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz student-grid"
          [rowData]="students()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [quickFilterText]="searchText()"
          [rowSelection]="'multiple'"
          [suppressRowClickSelection]="true"
          [pagination]="true"
          [paginationPageSize]="8"
          [animateRows]="true"
          (gridReady)="onGridReady($event)"
          (selectionChanged)="onSelectionChanged($event)"
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
                Mother name
                <input type="text" name="mother_name" [(ngModel)]="form.mother_name" />
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
                <select name="category" [(ngModel)]="form.category">
                  <option value="">Select</option>
                  @for (option of optionValues('caste_category'); track option.id) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </label>
              <label>
                Course / class
                <select name="current_class" [(ngModel)]="form.current_class" (ngModelChange)="onStudentClassChange($event)">
                  <option value="">Select</option>
                  @for (option of optionValues('class'); track option.id) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </label>
              <label>
                Division
                <select name="division" [(ngModel)]="form.division">
                  <option value="">Select</option>
                  @for (option of divisionOptions(form.current_class || ''); track option.id) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
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
                DOB in words
                <input type="text" name="date_of_birth_words" [(ngModel)]="form.date_of_birth_words" placeholder="Example: Twelfth January Two Thousand Eight" />
              </label>
              <label>
                Nationality
                <input type="text" name="nationality" [(ngModel)]="form.nationality" placeholder="Indian" />
              </label>
              <label>
                Religion
                <select name="religion" [(ngModel)]="form.religion">
                  <option value="">Select</option>
                  @for (option of optionValues('religion'); track option.id) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </label>
              <label>
                Caste / sub-caste
                <input type="text" name="caste_subcaste" [(ngModel)]="form.caste_subcaste" />
              </label>
              <label>
                Place of birth
                <input type="text" name="place_of_birth" [(ngModel)]="form.place_of_birth" />
              </label>
              <label>
                Birth taluka
                <input type="text" name="birth_taluka" [(ngModel)]="form.birth_taluka" />
              </label>
              <label>
                Birth district
                <input type="text" name="birth_district" [(ngModel)]="form.birth_district" />
              </label>
              <label>
                Birth state
                <input type="text" name="birth_state" [(ngModel)]="form.birth_state" />
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
              <label>
                Date of admission
                <input type="date" name="date_of_admission" [(ngModel)]="form.date_of_admission" />
              </label>
              <label>
                Date of leaving
                <input type="date" name="date_of_leaving" [(ngModel)]="form.date_of_leaving" />
              </label>
              <label>
                Class last attended
                <input type="text" name="class_last_attended" [(ngModel)]="form.class_last_attended" />
              </label>
              <label>
                Progress
                <input type="text" name="progress_status" [(ngModel)]="form.progress_status" placeholder="Good" />
              </label>
              <label>
                Conduct
                <input type="text" name="conduct" [(ngModel)]="form.conduct" placeholder="Good" />
              </label>
              <label class="full-span">
                Previous school / college
                <input type="text" name="previous_school" [(ngModel)]="form.previous_school" />
              </label>
              <label class="full-span">
                Reason for leaving
                <textarea rows="2" name="reason_for_leaving" [(ngModel)]="form.reason_for_leaving"></textarea>
              </label>
              <label class="full-span">
                TC remarks
                <textarea rows="2" name="tc_remarks" [(ngModel)]="form.tc_remarks"></textarea>
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
                <small>{{ student.category || 'Category not saved' }} · {{ student.nationality || 'Nationality not saved' }}</small>
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

            <div class="info-box">
              <strong>Transfer certificate profile</strong>
              <p>
                Mother: {{ student.mother_name || '—' }} · Birth: {{ student.place_of_birth || '—' }}
                · Admission: {{ student.date_of_admission || '—' }} · Leaving: {{ student.date_of_leaving || '—' }}
                · Conduct: {{ student.conduct || 'Good' }}
              </p>
            </div>

            <div class="actions">
              @if (canManageStudents()) {
                <button type="button" class="primary-btn" (click)="openEdit(student)">Edit student</button>
              }
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
  protected readonly auth = inject(AuthService);
  private readonly studentService = inject(StudentMasterService);
  private readonly masterService = inject(MasterDataService);

  protected readonly students = signal<StudentMasterRow[]>([]);
  protected readonly masterOptions = signal<MasterOptionsMap>({});
  protected readonly selectedStudent = signal<StudentMasterRow | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editingStudentId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedStudentIds = signal<number[]>([]);
  protected readonly canManageStudents = computed(() => this.auth.currentUser()?.role === 'CLERK');

  protected filters = {
    current_class: '',
    category: '',
    status: '',
  };

  protected form: StudentMasterPayload = this.createEmptyForm();

  private gridApi: GridApi<StudentMasterRow> | null = null;

  protected readonly columnDefs: ColDef<StudentMasterRow>[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 56,
      pinned: 'left',
      sortable: false,
      filter: false,
      resizable: false,
    },
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
      cellRenderer: () => this.canManageStudents()
        ? `
          <div class="grid-actions">
            <button type="button" class="grid-action" data-action="view">View</button>
            <button type="button" class="grid-action" data-action="edit">Edit</button>
            <button type="button" class="grid-action grid-action--danger" data-action="delete">Delete</button>
          </div>
        `
        : `
          <div class="grid-actions">
            <button type="button" class="grid-action" data-action="view">View</button>
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

  protected optionValues(type: string) {
    return this.masterOptions()[type] ?? [];
  }

  protected divisionOptions(className: string) {
    const divisions = this.optionValues('division');
    const key = className.trim().toLowerCase();

    if (!key) {
      return divisions;
    }

    const filtered = divisions.filter((option) => {
      const parent = (option.parent_value ?? '').trim().toLowerCase();
      return !parent || parent === key;
    });

    return filtered.length ? filtered : divisions;
  }

  protected applyFilters(): void {
    void this.loadStudents(this.context.activeInstitute().id);
  }

  protected resetFilters(): void {
    this.searchText.set('');
    this.filters = {
      current_class: '',
      category: '',
      status: '',
    };
    this.selectedStudentIds.set([]);
    void this.loadStudents(this.context.activeInstitute().id);
  }

  protected onGridReady(event: GridReadyEvent<StudentMasterRow>): void {
    this.gridApi = event.api;
  }

  protected onSelectionChanged(event: SelectionChangedEvent<StudentMasterRow>): void {
    this.selectedStudentIds.set(event.api.getSelectedRows().map((row) => Number(row.id)));
  }

  protected exportStudents(): void {
    this.gridApi?.exportDataAsCsv({
      fileName: `${this.context.activeInstitute().code.toLowerCase()}-student-master.csv`,
    });
  }

  protected async promoteSelected(): Promise<void> {
    if (!this.canManageStudents() || this.selectedStudentIds().length === 0) {
      return;
    }

    const selectedRows = this.students().filter((student) => this.selectedStudentIds().includes(Number(student.id)));
    const classNames = Array.from(new Set(selectedRows.map((student) => (student.current_class || '').trim()).filter(Boolean)));

    if (classNames.length !== 1) {
      await Swal.fire({
        icon: 'warning',
        title: 'Select same class students',
        text: 'Please select students from the same current class before promotion.',
      });
      return;
    }

    const currentClass = classNames[0];
    const targetOptions = this.promotionTargetsFor(currentClass);

    if (targetOptions.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Next class not configured',
        text: `Add the next progression value in Master Entries for ${currentClass} to use bulk promotion.`,
      });
      return;
    }

    const targetResult = await Swal.fire({
      title: `Promote ${selectedRows.length} students`,
      text: `Current class: ${currentClass}`,
      input: 'select',
      inputOptions: Object.fromEntries(targetOptions.map((value) => [value, value])),
      inputValue: targetOptions[0],
      inputPlaceholder: 'Select target class',
      showCancelButton: true,
      confirmButtonText: 'Continue',
    });

    if (!targetResult.isConfirmed || !targetResult.value) {
      return;
    }

    const targetClass = String(targetResult.value);
    const divisions = this.divisionOptions(targetClass);
    let targetDivision = '';

    if (divisions.length) {
      const divisionResult = await Swal.fire({
        title: 'Select target division',
        input: 'select',
        inputOptions: Object.fromEntries([['', 'Keep current division'], ...divisions.map((item) => [item.value, item.label])]),
        inputValue: '',
        showCancelButton: true,
        confirmButtonText: 'Promote',
      });

      if (!divisionResult.isConfirmed) {
        return;
      }

      targetDivision = String(divisionResult.value || '');
    }

    try {
      await this.studentService.promoteStudents(this.selectedStudentIds(), targetClass, targetDivision);
      await Swal.fire({
        icon: 'success',
        title: 'Promotion complete',
        text: `${selectedRows.length} students promoted to ${targetClass}.`,
      });
      this.selectedStudentIds.set([]);
      await this.loadStudents(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Promotion failed',
        text: error?.error?.message || 'Unable to promote the selected students right now.',
      });
    }
  }

  private promotionTargetsFor(currentClass: string): string[] {
    const classOptions = this.optionValues('class');
    const currentOption = classOptions.find((option) => option.value === currentClass);
    const currentMeta = this.parseOptionMeta(currentOption?.meta_json);
    const targets = new Set<string>();

    if (currentOption?.next_value) {
      targets.add(currentOption.next_value);
    }

    if (currentMeta.next_value) {
      targets.add(currentMeta.next_value);
    }

    const derived = this.deriveNextClass(currentClass);
    if (derived) {
      targets.add(derived);
    }

    const parentValue = (currentOption?.parent_value || currentMeta.parent_value || '').trim();
    if (parentValue) {
      classOptions
        .filter((option) => (option.parent_value || this.parseOptionMeta(option.meta_json).parent_value || '').trim() === parentValue && option.value !== currentClass)
        .sort((a, b) => Number(a.year_order || this.parseOptionMeta(a.meta_json).year_order || 0) - Number(b.year_order || this.parseOptionMeta(b.meta_json).year_order || 0))
        .forEach((option) => targets.add(option.value));
    }

    return Array.from(targets).filter((value) => value && value !== currentClass);
  }

  private deriveNextClass(currentClass: string): string | null {
    const replacements: Array<[string, string]> = [
      ['FY ', 'SY '],
      ['SY ', 'TY '],
      ['FYJC', 'SYJC'],
      ['First Year ', 'Second Year '],
      ['Second Year ', 'Third Year '],
    ];

    for (const [from, to] of replacements) {
      if (currentClass.startsWith(from)) {
        return currentClass.replace(from, to);
      }
    }

    return null;
  }

  private parseOptionMeta(metaJson?: string | null): { parent_value?: string; next_value?: string; year_order?: number } {
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

  protected onStudentClassChange(className: string): void {
    this.form.current_class = className;
    const divisions = this.divisionOptions(className);

    if (this.form.division && divisions.some((option) => option.value === this.form.division)) {
      return;
    }

    this.form.division = divisions[0]?.value ?? '';
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
      if (this.canManageStudents()) {
        this.openEdit(event.data);
      }
      return;
    }

    if (action === 'delete' && this.canManageStudents()) {
      void this.deleteStudent(event.data);
    }
  }

  protected openCreate(): void {
    if (!this.canManageStudents()) {
      return;
    }

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
      mother_name: student.mother_name || '',
      gender: student.gender || '',
      category: student.category || '',
      nationality: student.nationality || 'Indian',
      religion: student.religion || '',
      caste_subcaste: student.caste_subcaste || '',
      current_class: student.current_class || '',
      division: student.division || '',
      mobile_number: student.mobile_number || '',
      email: student.email || '',
      dob: student.dob || '',
      date_of_birth_words: student.date_of_birth_words || '',
      place_of_birth: student.place_of_birth || '',
      birth_taluka: student.birth_taluka || '',
      birth_district: student.birth_district || '',
      birth_state: student.birth_state || '',
      previous_school: student.previous_school || '',
      date_of_admission: student.date_of_admission || '',
      date_of_leaving: student.date_of_leaving || '',
      class_last_attended: student.class_last_attended || student.current_class || '',
      progress_status: student.progress_status || 'Good',
      conduct: student.conduct || 'Good',
      reason_for_leaving: student.reason_for_leaving || '',
      tc_remarks: student.tc_remarks || '',
      address: student.address || '',
      status: student.status,
      admission_status: student.admission_status,
    };
    this.onStudentClassChange(this.form.current_class || '');
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
    if (!this.canManageStudents()) {
      return;
    }

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
      mother_name: '',
      gender: '',
      category: '',
      nationality: 'Indian',
      religion: '',
      caste_subcaste: '',
      current_class: '',
      division: 'A',
      mobile_number: '',
      email: '',
      dob: '',
      date_of_birth_words: '',
      place_of_birth: '',
      birth_taluka: '',
      birth_district: '',
      birth_state: '',
      previous_school: '',
      date_of_admission: '',
      date_of_leaving: '',
      class_last_attended: '',
      progress_status: 'Good',
      conduct: 'Good',
      reason_for_leaving: '',
      tc_remarks: '',
      address: '',
      status: 'active',
      admission_status: 'confirmed',
    };
  }

  private async deleteStudent(student: StudentMasterRow): Promise<void> {
    if (!this.canManageStudents()) {
      return;
    }

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
    const [students, options] = await Promise.all([
      this.studentService.getStudents(instituteId, {
        search: this.searchText(),
        current_class: this.filters.current_class,
        category: this.filters.category,
        status: this.filters.status,
      }),
      this.masterService.getOptions(instituteId),
    ]);

    this.students.set(students);
    this.masterOptions.set(options);

    const selectedId = this.selectedStudent()?.id;
    if (selectedId) {
      this.selectedStudent.set(students.find((row) => row.id === selectedId) ?? null);
    }
  }
}

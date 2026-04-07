import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  ExamMarkPayload,
  ExamMarkRow,
  ExamPayload,
  ExamResultsService,
  ExamSessionRow,
  ExamSummary,
} from '../../core/services/exam-results.service';
import { MasterDataService, MasterOptionsMap } from '../../core/services/master-data.service';
import { StudentMasterRow, StudentMasterService } from '../../core/services/student-master.service';
import { InstituteService, InstituteSettings } from '../../core/services/institute.service';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Academics</p>
          <h1>Exam, Marks & Results</h1>
          <p>Create exam sessions, enter marks class-wise, and review result progress from one academic desk.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="secondary-btn" (click)="openMarkModal(selectedExam())" [disabled]="!selectedExam()">
            Enter marks
          </button>
          <button type="button" class="primary-btn" (click)="openCreate()">+ Add exam session</button>
        </div>
      </div>

      <div class="stats-grid">
        <article><span>Total exams</span><strong>{{ summary().totalExams }}</strong></article>
        <article><span>Published</span><strong>{{ summary().publishedResults }}</strong></article>
        <article><span>Marks entered</span><strong>{{ summary().marksEntered }}</strong></article>
        <article><span>Pass %</span><strong>{{ summary().passPercentage }}%</strong></article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Exam register</h2>
            <p>Start with the exam session, then enter marks against students in the selected class.</p>
          </div>
          <div class="grid-toolbar">
            <input
              class="search-field"
              type="search"
              [ngModel]="examSearchText()"
              (ngModelChange)="examSearchText.set($event)"
              placeholder="Search exam, class, subject..."
            />
            <span class="tag">Result-ready</span>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz exam-grid"
          [rowData]="exams()"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [quickFilterText]="examSearchText()"
          [pagination]="true"
          [paginationPageSize]="8"
          [animateRows]="true"
          (cellClicked)="handleGridClick($event)"
        ></ag-grid-angular>
      </article>

      @if (selectedExam(); as exam) {
        <article class="panel">
          <div class="panel__header">
            <div>
              <h2>Mark register · {{ exam.exam_name }}</h2>
              <p>{{ exam.class_name }} · {{ exam.subject_name }} · Max {{ exam.max_marks }}</p>
            </div>
            <div class="page-actions">
              <input
                class="search-field"
                type="search"
                [ngModel]="markSearchText()"
                (ngModelChange)="markSearchText.set($event)"
                placeholder="Search GR no, student, result..."
              />
              <button type="button" class="secondary-btn" (click)="printResultSheet('A4')">Print A4</button>
              <button type="button" class="secondary-btn" (click)="printResultSheet('A5')">Print A5</button>
              <button type="button" class="primary-btn" (click)="openMarkModal(exam)">+ Add / update mark</button>
            </div>
          </div>

          <div class="exam-summary">
            <span class="tag">{{ exam.status }}</span>
            <span>{{ exam.exam_date || 'Date pending' }}</span>
            <span>{{ exam.marks_entered || 0 }} marks entered</span>
            <span>Average {{ exam.average_score || 0 }}</span>
          </div>

          <div id="result-print-surface" class="print-sheet">
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
                <strong>Exam Marksheet / Result Sheet</strong>
              </div>
              <div>
                <span class="doc-label">Printed on</span>
                <strong>{{ printableDate() }}</strong>
              </div>
            </div>

            <div class="meta-grid">
              <article><span>Exam</span><strong>{{ exam.exam_name }}</strong><small>{{ exam.subject_name }}</small></article>
              <article><span>Class</span><strong>{{ exam.class_name }}</strong><small>Academic year {{ context.activeAcademicYear() }}</small></article>
              <article><span>Students appeared</span><strong>{{ marks().length }}</strong><small>Pass: {{ passedStudents() }} · Fail: {{ failedStudents() }}</small></article>
              <article><span>Evaluation</span><strong>Max {{ exam.max_marks }}</strong><small>Average {{ exam.average_score || 0 }}</small></article>
            </div>

            <table class="result-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>GR No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Result</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                @for (mark of marks(); track mark.id; let index = $index) {
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ mark.gr_number || '—' }}</td>
                    <td>{{ mark.first_name }} {{ mark.last_name }}</td>
                    <td>{{ mark.current_class || exam.class_name }} {{ mark.division || '' }}</td>
                    <td>{{ mark.obtained_marks }} / {{ exam.max_marks }}</td>
                    <td>{{ mark.grade || '—' }}</td>
                    <td>{{ mark.result_status }}</td>
                    <td>{{ mark.remarks || '—' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="8">No marks have been entered yet for this exam session.</td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="doc-footer">
              <div>
                <strong>Note</strong>
                <p>This result sheet is system-generated for office and student reference. Final promotion rules remain subject to institute policy.</p>
              </div>
              <div class="signature-block">
                <span>Exam In-Charge / Principal</span>
              </div>
            </div>
          </div>

          <ag-grid-angular
            class="ag-theme-quartz marks-grid"
            [rowData]="marks()"
            [columnDefs]="markColumnDefs"
            [defaultColDef]="defaultColDef"
            [quickFilterText]="markSearchText()"
            [pagination]="true"
            [paginationPageSize]="6"
            [animateRows]="true"
          ></ag-grid-angular>
        </article>
      }

      @if (showExamModal()) {
        <div class="detail-modal" (click)="closeExamModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveExam()">
            <div class="panel__header">
              <div>
                <h2>{{ editingId() ? 'Update exam session' : 'Add exam session' }}</h2>
                <p>Set the exam name, class, subject, and publication status.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeExamModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Exam name
                <input type="text" name="exam_name" [(ngModel)]="examForm.exam_name" required />
              </label>
              <label>
                Class
                <select name="class_name" [(ngModel)]="examForm.class_name" required>
                  <option value="">Select class</option>
                  @for (option of classOptions(); track option.id) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </label>
              <label>
                Subject
                <input type="text" name="subject_name" [(ngModel)]="examForm.subject_name" required />
              </label>
              <label>
                Max marks
                <input type="number" min="1" step="0.01" name="max_marks" [(ngModel)]="examForm.max_marks" />
              </label>
              <label>
                Exam date
                <input type="date" name="exam_date" [(ngModel)]="examForm.exam_date" />
              </label>
              <label>
                Status
                <select name="status" [(ngModel)]="examForm.status">
                  <option value="draft">draft</option>
                  <option value="ongoing">ongoing</option>
                  <option value="published">published</option>
                </select>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : (editingId() ? 'Update exam' : 'Create exam') }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (showMarkModal()) {
        <div class="detail-modal" (click)="closeMarkModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="saveMark()">
            <div class="panel__header">
              <div>
                <h2>Enter marks</h2>
                <p>{{ selectedExam()?.exam_name }} · {{ selectedExam()?.subject_name }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeMarkModal()">Close</button>
            </div>

            <div class="form-grid">
              <label class="full-span">
                Student
                <select name="student_id" [(ngModel)]="markForm.student_id" required>
                  <option [ngValue]="0">Select student</option>
                  @for (student of availableStudents(); track student.id) {
                    <option [ngValue]="student.id">{{ student.gr_number }} · {{ student.first_name }} {{ student.last_name }}</option>
                  }
                </select>
              </label>
              <label>
                Obtained marks
                <input type="number" min="0" step="0.01" name="obtained_marks" [(ngModel)]="markForm.obtained_marks" />
              </label>
              <label>
                Result status
                <select name="result_status" [(ngModel)]="markForm.result_status">
                  <option value="">Auto-calculate</option>
                  <option value="pass">pass</option>
                  <option value="fail">fail</option>
                  <option value="absent">absent</option>
                </select>
              </label>
              <label>
                Grade
                <input type="text" name="grade" [(ngModel)]="markForm.grade" placeholder="Optional" />
              </label>
              <label class="full-span">
                Remarks
                <textarea rows="3" name="remarks" [(ngModel)]="markForm.remarks"></textarea>
              </label>
            </div>

            <div class="actions actions--end">
              <button type="submit" class="primary-btn" [disabled]="isMarkSaving()">
                {{ isMarkSaving() ? 'Saving...' : 'Save marks' }}
              </button>
            </div>
          </form>
        </div>
      }
    </section>
  `,
  styleUrl: './exam-results.component.scss',
})
export class ExamResultsComponent {
  protected readonly context = inject(AppContextService);
  private readonly examService = inject(ExamResultsService);
  private readonly studentService = inject(StudentMasterService);
  private readonly masterService = inject(MasterDataService);
  private readonly instituteService = inject(InstituteService);

  protected readonly summary = signal<ExamSummary>({ totalExams: 0, publishedResults: 0, draftResults: 0, marksEntered: 0, passPercentage: 0 });
  protected readonly instituteSettings = signal<InstituteSettings | null>(null);
  protected readonly exams = signal<ExamSessionRow[]>([]);
  protected readonly students = signal<StudentMasterRow[]>([]);
  protected readonly marks = signal<ExamMarkRow[]>([]);
  protected readonly masterOptions = signal<MasterOptionsMap>({});
  protected readonly selectedExam = signal<ExamSessionRow | null>(null);
  protected readonly showExamModal = signal(false);
  protected readonly showMarkModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly isMarkSaving = signal(false);
  protected readonly examSearchText = signal('');
  protected readonly markSearchText = signal('');

  protected examForm: ExamPayload = this.createEmptyExamForm();
  protected markForm: ExamMarkPayload = this.createEmptyMarkForm();

  protected readonly columnDefs: ColDef<ExamSessionRow>[] = [
    { field: 'exam_name', headerName: 'Exam', minWidth: 180 },
    { field: 'class_name', headerName: 'Class', minWidth: 130 },
    { field: 'subject_name', headerName: 'Subject', minWidth: 160 },
    { field: 'exam_date', headerName: 'Exam Date', minWidth: 130 },
    { field: 'status', headerName: 'Status', maxWidth: 110 },
    { field: 'marks_entered', headerName: 'Marks', maxWidth: 100 },
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
          <button type="button" class="grid-action" data-action="marks">Marks</button>
          <button type="button" class="grid-action grid-action--danger" data-action="delete">Delete</button>
        </div>
      `,
    },
  ];

  protected readonly markColumnDefs: ColDef<ExamMarkRow>[] = [
    { field: 'gr_number', headerName: 'GR No', minWidth: 120 },
    {
      headerName: 'Student',
      valueGetter: (params) => `${params.data?.first_name ?? ''} ${params.data?.last_name ?? ''}`.trim(),
      minWidth: 180,
    },
    { field: 'current_class', headerName: 'Class', minWidth: 120 },
    { field: 'obtained_marks', headerName: 'Marks', maxWidth: 110 },
    { field: 'grade', headerName: 'Grade', maxWidth: 100 },
    { field: 'result_status', headerName: 'Result', minWidth: 120 },
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

  protected classOptions() {
    return this.masterOptions()['class'] ?? [];
  }

  protected printableDate(): string {
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  protected passedStudents(): number {
    return this.marks().filter((mark) => mark.result_status === 'pass').length;
  }

  protected failedStudents(): number {
    return this.marks().filter((mark) => mark.result_status === 'fail').length;
  }

  protected availableStudents(): StudentMasterRow[] {
    const className = this.selectedExam()?.class_name || this.examForm.class_name;
    return this.students().filter((student) => !className || (student.current_class ?? '') === className);
  }

  protected handleGridClick(event: { data?: ExamSessionRow; event?: Event | null }): void {
    if (!event.data) {
      return;
    }

    const action = (event.event?.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')?.dataset['action'];

    if (!action || action === 'view') {
      void this.selectExam(event.data);
      return;
    }

    if (action === 'edit') {
      this.openEdit(event.data);
      return;
    }

    if (action === 'marks') {
      void this.openMarkModal(event.data);
      return;
    }

    if (action === 'delete') {
      void this.deleteExam(event.data);
    }
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.examForm = this.createEmptyExamForm();
    this.showExamModal.set(true);
  }

  protected openEdit(row: ExamSessionRow): void {
    this.editingId.set(row.id);
    this.examForm = {
      academic_year_id: row.academic_year_id,
      exam_name: row.exam_name,
      class_name: row.class_name,
      subject_name: row.subject_name,
      max_marks: Number(row.max_marks || 100),
      exam_date: row.exam_date || '',
      status: row.status,
    };
    this.showExamModal.set(true);
  }

  protected closeExamModal(): void {
    this.showExamModal.set(false);
    this.examForm = this.createEmptyExamForm();
  }

  protected async openMarkModal(exam: ExamSessionRow | null): Promise<void> {
    if (!exam) {
      return;
    }

    await this.selectExam(exam);
    const firstStudentId = this.availableStudents()[0]?.id ?? 0;
    this.markForm = {
      ...this.createEmptyMarkForm(exam.id),
      student_id: firstStudentId,
    };
    this.showMarkModal.set(true);
  }

  protected closeMarkModal(): void {
    this.showMarkModal.set(false);
    this.markForm = this.createEmptyMarkForm(this.selectedExam()?.id ?? 0);
  }

  protected async saveExam(): Promise<void> {
    this.isSaving.set(true);

    try {
      const payload: ExamPayload = {
        ...this.examForm,
        institute_id: this.context.activeInstitute().id,
      };

      if (this.editingId()) {
        await this.examService.updateExam(this.editingId()!, payload);
      } else {
        await this.examService.createExam(payload);
      }

      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Exam session saved successfully.' });
      this.closeExamModal();
      await this.load(this.context.activeInstitute().id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Unable to save this exam session right now.',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  protected printResultSheet(pageSize: 'A4' | 'A5'): void {
    this.printSurface('result-print-surface', `${this.selectedExam()?.exam_name ?? 'Result Sheet'} Print`, pageSize);
  }

  protected async saveMark(): Promise<void> {
    if (!this.markForm.exam_id || !this.markForm.student_id) {
      await Swal.fire({ icon: 'warning', title: 'Student required', text: 'Please select a student first.' });
      return;
    }

    this.isMarkSaving.set(true);

    try {
      await this.examService.saveMark(this.markForm);
      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Marks saved successfully.' });
      this.closeMarkModal();
      await this.load(this.context.activeInstitute().id, this.markForm.exam_id);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: error?.error?.message || 'Unable to save these marks right now.',
      });
    } finally {
      this.isMarkSaving.set(false);
    }
  }

  private createEmptyExamForm(): ExamPayload {
    return {
      institute_id: this.context.activeInstitute().id,
      exam_name: '',
      class_name: '',
      subject_name: '',
      max_marks: 100,
      exam_date: '',
      status: 'draft',
    };
  }

  private createEmptyMarkForm(examId = 0): ExamMarkPayload {
    return {
      exam_id: examId,
      student_id: 0,
      obtained_marks: 0,
      grade: '',
      result_status: '',
      remarks: '',
    };
  }

  private async selectExam(row: ExamSessionRow): Promise<void> {
    this.selectedExam.set(row);
    await this.loadMarks(row.id);
  }

  private async deleteExam(row: ExamSessionRow): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete exam session?',
      text: `Remove ${row.exam_name} · ${row.subject_name}?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.examService.deleteExam(row.id);
      if (this.selectedExam()?.id === row.id) {
        this.selectedExam.set(null);
        this.marks.set([]);
      }
      await this.load(this.context.activeInstitute().id);
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Exam session removed successfully.' });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.error?.message || 'Unable to delete this exam session right now.',
      });
    }
  }

  private async load(instituteId: number, focusExamId?: number): Promise<void> {
    const [summary, exams, students, options, institute] = await Promise.all([
      this.examService.getSummary(instituteId),
      this.examService.getExams(instituteId),
      this.studentService.getStudents(instituteId),
      this.masterService.getOptions(instituteId),
      this.instituteService.getSettings(instituteId),
    ]);

    this.summary.set(summary);
    this.exams.set(exams);
    this.students.set(students);
    this.masterOptions.set(options);
    this.instituteSettings.set(institute);

    const selectedId = focusExamId ?? this.selectedExam()?.id;
    if (selectedId) {
      const selected = exams.find((row) => row.id === selectedId) ?? null;
      this.selectedExam.set(selected);

      if (selected) {
        await this.loadMarks(selected.id);
      } else {
        this.marks.set([]);
      }
    }
  }

  private async loadMarks(examId: number): Promise<void> {
    const response = await this.examService.getMarks(examId);
    this.marks.set(response.marks);

    const existing = this.selectedExam();
    this.selectedExam.set({
      ...(existing ?? response.exam),
      ...response.exam,
    });
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
            .meta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3mm; margin: 4mm 0; }
            .meta-grid article { padding: 3mm; border: 1px solid #e2e8f0; border-radius: 3mm; background: #fff; }
            .meta-grid span { display: block; color: #64748b; font-size: 11px; margin-bottom: 1mm; }
            .result-table { width: 100%; border-collapse: collapse; margin-top: 4mm; font-size: 12px; }
            .result-table th, .result-table td { border: 1px solid #cbd5e1; padding: 2.4mm; text-align: left; vertical-align: top; }
            .result-table th { background: #eef2ff; }
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

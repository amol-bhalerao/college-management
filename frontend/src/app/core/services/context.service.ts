import { Injectable, signal } from '@angular/core';

export interface InstituteContext {
  id: number;
  code: string;
  name: string;
  type: string;
}

const DEFAULT_INSTITUTES: InstituteContext[] = [
  { id: 1, code: 'JC', name: 'Junior College', type: 'Higher Secondary' },
  { id: 2, code: 'DC', name: 'Degree College', type: 'Undergraduate' },
  { id: 3, code: 'BED', name: 'B.Ed College', type: 'Professional' },
];

@Injectable({ providedIn: 'root' })
export class AppContextService {
  private readonly institutesState = signal<InstituteContext[]>(DEFAULT_INSTITUTES);
  private readonly academicYearsState = signal<string[]>(['2025-26', '2026-27']);

  readonly institutes = this.institutesState.asReadonly();
  readonly academicYears = this.academicYearsState.asReadonly();

  readonly activeInstitute = signal<InstituteContext>(DEFAULT_INSTITUTES[0]);
  readonly activeAcademicYear = signal<string>('2025-26');

  syncFromSession(session: {
    institutes?: Array<{ id: number; code: string; name: string; type: string }>;
    academicYears?: Array<{ label: string }>;
  }): void {
    const institutes = session.institutes?.length ? session.institutes : DEFAULT_INSTITUTES;
    const academicYears = session.academicYears?.length
      ? session.academicYears.map((item) => item.label)
      : ['2025-26', '2026-27'];

    this.institutesState.set(institutes);
    this.academicYearsState.set(academicYears);
    this.activeInstitute.set(institutes[0]);
    this.activeAcademicYear.set(academicYears[0]);
  }

  reset(): void {
    this.institutesState.set(DEFAULT_INSTITUTES);
    this.academicYearsState.set(['2025-26', '2026-27']);
    this.activeInstitute.set(DEFAULT_INSTITUTES[0]);
    this.activeAcademicYear.set('2025-26');
  }

  selectInstitute(instituteId: string): void {
    const nextInstitute = this.institutesState().find((item) => String(item.id) === instituteId);

    if (nextInstitute) {
      this.activeInstitute.set(nextInstitute);
    }
  }

  selectAcademicYear(year: string): void {
    this.activeAcademicYear.set(year);
  }
}

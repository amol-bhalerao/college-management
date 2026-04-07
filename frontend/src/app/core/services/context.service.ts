import { Injectable, signal } from '@angular/core';

export interface InstituteContext {
  id: number;
  code: string;
  name: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class AppContextService {
  readonly institutes: InstituteContext[] = [
    { id: 1, code: 'JC', name: 'Junior College', type: 'Higher Secondary' },
    { id: 2, code: 'DC', name: 'Degree College', type: 'Undergraduate' },
    { id: 3, code: 'BED', name: 'B.Ed College', type: 'Professional' },
  ];

  readonly academicYears = ['2025-26', '2026-27'];

  readonly activeInstitute = signal<InstituteContext>(this.institutes[0]);
  readonly activeAcademicYear = signal<string>(this.academicYears[0]);

  selectInstitute(instituteId: string): void {
    const nextInstitute = this.institutes.find((item) => String(item.id) === instituteId);

    if (nextInstitute) {
      this.activeInstitute.set(nextInstitute);
    }
  }

  selectAcademicYear(year: string): void {
    this.activeAcademicYear.set(year);
  }
}

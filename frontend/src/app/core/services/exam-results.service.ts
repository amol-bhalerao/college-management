import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ExamSummary {
  totalExams: number;
  publishedResults: number;
  draftResults: number;
  marksEntered: number;
  passPercentage: number;
}

export interface ExamSessionRow {
  id: number;
  institute_id: number;
  academic_year_id: number;
  exam_name: string;
  class_name: string;
  subject_name: string;
  max_marks: number;
  exam_date: string | null;
  status: string;
  institute_name?: string | null;
  marks_entered?: number;
  pass_count?: number;
  average_score?: number;
}

export interface ExamPayload {
  institute_id?: number;
  academic_year_id?: number;
  exam_name: string;
  class_name: string;
  subject_name: string;
  max_marks?: number;
  exam_date?: string;
  status?: string;
}

export interface ExamMarkRow {
  id: number;
  exam_id: number;
  student_id: number;
  obtained_marks: number;
  grade: string | null;
  result_status: string;
  remarks: string | null;
  gr_number: string | null;
  first_name: string | null;
  last_name: string | null;
  current_class: string | null;
  division: string | null;
}

export interface ExamMarkPayload {
  exam_id: number;
  student_id: number;
  obtained_marks: number;
  grade?: string;
  result_status?: string;
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class ExamResultsService {
  private readonly http = inject(HttpClient);

  async getSummary(instituteId: number): Promise<ExamSummary> {
    return firstValueFrom(this.http.get<ExamSummary>(`${environment.apiBaseUrl}/exams/summary/${instituteId}`));
  }

  async getExams(instituteId: number): Promise<ExamSessionRow[]> {
    const response = await firstValueFrom(this.http.get<{ exams: ExamSessionRow[] }>(`${environment.apiBaseUrl}/exams/${instituteId}`));
    return response.exams;
  }

  async getMarks(examId: number): Promise<{ exam: ExamSessionRow; marks: ExamMarkRow[] }> {
    return firstValueFrom(this.http.get<{ exam: ExamSessionRow; marks: ExamMarkRow[] }>(`${environment.apiBaseUrl}/exams/marks/${examId}`));
  }

  async createExam(payload: ExamPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/exams`, payload));
  }

  async updateExam(id: number, payload: Partial<ExamPayload>): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/exams/${id}`, payload));
  }

  async deleteExam(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/exams/${id}`));
  }

  async saveMark(payload: ExamMarkPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/exams/marks`, payload));
  }
}

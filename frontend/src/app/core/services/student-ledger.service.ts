import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LedgerRow {
  date: string;
  reference: string;
  mode: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface ReceiptRow {
  receiptNumber: string;
  receiptDate: string;
  amount: number;
  paymentMode: string;
  receivedBy: string | null;
  remarks: string | null;
  verificationToken: string | null;
}

export interface StudentLedgerResponse {
  studentId: string;
  studentName: string;
  institute: string;
  academicYear: string;
  grossFee: number;
  paidAmount: number;
  outstandingAmount: number;
  entries: LedgerRow[];
  receipts: ReceiptRow[];
}

export interface CounterReceiptRow {
  receiptNumber: string;
  receiptDate: string;
  amount: number;
  paymentMode: string;
  receivedBy: string | null;
  studentName: string;
  studentId: string;
  verificationToken: string | null;
}

export interface FeeCounterSummary {
  totalCollected: number;
  receiptCount: number;
  cashCollected: number;
  digitalCollected: number;
  pendingAmount: number;
  recentReceipts: CounterReceiptRow[];
}

export interface CollectPaymentPayload {
  amount: number;
  mode: string;
  remarks?: string;
  receivedBy?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentLedgerService {
  private readonly http = inject(HttpClient);

  async getLedger(studentId: string): Promise<StudentLedgerResponse> {
    return firstValueFrom(this.http.get<StudentLedgerResponse>(`${environment.apiBaseUrl}/students/${studentId}/ledger`));
  }

  async getCounterSummary(instituteId: number): Promise<FeeCounterSummary> {
    return firstValueFrom(this.http.get<FeeCounterSummary>(`${environment.apiBaseUrl}/fees/summary/${instituteId}`));
  }

  async collectPayment(studentId: string, payload: CollectPaymentPayload): Promise<{ message: string; receipt: ReceiptRow }> {
    return firstValueFrom(
      this.http.post<{ message: string; receipt: ReceiptRow }>(`${environment.apiBaseUrl}/students/${studentId}/collect`, payload),
    );
  }
}

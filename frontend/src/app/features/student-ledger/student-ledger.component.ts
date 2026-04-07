import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import { LedgerRow, ReceiptRow, StudentLedgerResponse, StudentLedgerService } from '../../core/services/student-ledger.service';

@Component({
  selector: 'app-student-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, CurrencyPipe],
  template: `
    <section class="ledger-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Account module</p>
          <h1>Student Ledger & Fee Collection</h1>
          <p>Collect fees, print A5-friendly receipts, and verify payment tokens from one accountant screen.</p>
        </div>

        <div class="head-actions">
          <label class="search-box">
            Student ID / GR No
            <input type="text" [(ngModel)]="studentSearch" placeholder="JC2025001" />
          </label>
          <button type="button" class="ghost-btn" (click)="reloadLedger()">Load ledger</button>
          <button type="button" class="primary-btn" (click)="openCollectModal()" [disabled]="!ledger()">Collect fee</button>
        </div>
      </div>

      @if (ledger(); as currentLedger) {
        <div class="ledger-body">
          <div class="summary-grid">
            <article>
              <span>Gross fee</span>
              <strong>{{ currentLedger.grossFee | currency:'INR':'symbol':'1.0-0' }}</strong>
            </article>
            <article>
              <span>Total paid</span>
              <strong>{{ currentLedger.paidAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
            </article>
            <article>
              <span>Outstanding</span>
              <strong>{{ currentLedger.outstandingAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
            </article>
            <article>
              <span>Student</span>
              <strong>{{ currentLedger.studentName }}</strong>
              <small>{{ currentLedger.studentId }} · {{ currentLedger.institute }}</small>
            </article>
          </div>

          <div class="content-grid">
            <article class="panel">
              <div class="panel__header">
                <div>
                  <h2>Ledger timeline</h2>
                  <p>{{ currentLedger.academicYear }} · All fee assignments, receipts, and adjustments.</p>
                </div>
                <span class="tag">Accountant view</span>
              </div>

              <ag-grid-angular
                class="ag-theme-quartz ledger-grid"
                [rowData]="currentLedger.entries"
                [columnDefs]="columnDefs"
                [defaultColDef]="defaultColDef"
                [pagination]="true"
                [paginationPageSize]="6"
              ></ag-grid-angular>
            </article>

            <article class="panel receipt-panel" id="receipt-preview-card">
              <div class="panel__header">
                <div>
                  <h2>A5 Receipt Preview</h2>
                  <p>Ready for print and token verification.</p>
                </div>
                <button type="button" class="ghost-btn" (click)="printReceipt()">Print A5</button>
              </div>

              @if (latestReceipt(); as receipt) {
                <div class="receipt-card">
                  <p class="receipt-number">{{ receipt.receiptNumber }}</p>
                  <h3>{{ currentLedger.institute }}</h3>
                  <p>{{ currentLedger.studentName }} · {{ currentLedger.studentId }}</p>

                  <div class="receipt-meta">
                    <span>Date</span>
                    <strong>{{ receipt.receiptDate }}</strong>
                    <span>Mode</span>
                    <strong>{{ receipt.paymentMode }}</strong>
                    <span>Amount</span>
                    <strong>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</strong>
                  </div>

                  <p class="receipt-note">{{ receipt.remarks || 'Fee payment recorded successfully.' }}</p>
                  <a class="verify-link" [href]="verifyUrl(receipt.verificationToken)" target="_blank" rel="noreferrer">
                    Verify receipt token
                  </a>
                </div>
              } @else {
                <p class="empty-state">No receipt issued yet for this student.</p>
              }
            </article>
          </div>

          <article class="panel">
            <div class="panel__header">
              <div>
                <h2>Recent receipts</h2>
                <p>Latest payment acknowledgements with verification links.</p>
              </div>
            </div>

            <div class="receipt-list">
              @for (receipt of currentLedger.receipts; track receipt.receiptNumber) {
                <div class="receipt-list__item">
                  <div>
                    <strong>{{ receipt.receiptNumber }}</strong>
                    <small>{{ receipt.receiptDate }} · {{ receipt.paymentMode }}</small>
                  </div>
                  <div>
                    <strong>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</strong>
                    <a [href]="verifyUrl(receipt.verificationToken)" target="_blank" rel="noreferrer">Verify</a>
                  </div>
                </div>
              }
            </div>
          </article>
        </div>
      }

      @if (showCollectModal()) {
        <div class="detail-modal" (click)="closeCollectModal()">
          <form class="detail-card" (click)="$event.stopPropagation()" (ngSubmit)="submitCollection()">
            <div class="panel__header">
              <div>
                <h2>Collect fee</h2>
                <p>Post payment and generate a verification-ready receipt.</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeCollectModal()">Close</button>
            </div>

            <div class="form-grid">
              <label>
                Amount
                <input type="number" min="1" step="0.01" name="amount" [(ngModel)]="collectForm.amount" required />
              </label>

              <label>
                Payment mode
                <select name="mode" [(ngModel)]="collectForm.mode">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </label>

              <label>
                Received by
                <input type="text" name="receivedBy" [(ngModel)]="collectForm.receivedBy" />
              </label>

              <label class="full-span">
                Remarks
                <textarea rows="3" name="remarks" [(ngModel)]="collectForm.remarks"></textarea>
              </label>
            </div>

            <button type="submit" class="primary-btn" [disabled]="isSaving()">
              {{ isSaving() ? 'Posting...' : 'Save payment & issue receipt' }}
            </button>
          </form>
        </div>
      }
    </section>
  `,
  styleUrl: './student-ledger.component.scss',
})
export class StudentLedgerComponent {
  protected readonly context = inject(AppContextService);
  private readonly ledgerService = inject(StudentLedgerService);

  protected readonly ledger = signal<StudentLedgerResponse | null>(null);
  protected readonly showCollectModal = signal(false);
  protected readonly isSaving = signal(false);
  protected studentSearch = 'JC2025001';

  protected readonly collectForm = {
    amount: 1000,
    mode: 'Cash',
    remarks: '',
    receivedBy: 'Account Office',
  };

  protected readonly columnDefs: ColDef<LedgerRow>[] = [
    { field: 'date', headerName: 'Date' },
    { field: 'reference', headerName: 'Reference', minWidth: 200 },
    { field: 'mode', headerName: 'Mode' },
    { field: 'debit', headerName: 'Debit' },
    { field: 'credit', headerName: 'Credit' },
    { field: 'balance', headerName: 'Balance' },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  constructor() {
    effect(() => {
      const instituteId = this.context.activeInstitute().id;
      const defaults: Record<number, string> = {
        1: 'JC2025001',
        2: 'DC2025001',
        3: 'BED2025001',
      };

      this.studentSearch = defaults[instituteId] ?? 'JC2025001';
      void this.loadLedger(this.studentSearch);
    });
  }

  protected latestReceipt(): ReceiptRow | null {
    return this.ledger()?.receipts?.[0] ?? null;
  }

  protected verifyUrl(token: string | null): string {
    return `http://127.0.0.1:8080/api/verify/receipt/${token ?? ''}`;
  }

  protected async reloadLedger(): Promise<void> {
    await this.loadLedger(this.studentSearch);
  }

  protected openCollectModal(): void {
    this.collectForm.amount = Math.max(500, Math.min(5000, this.ledger()?.outstandingAmount ?? 1000));
    this.collectForm.mode = 'Cash';
    this.collectForm.remarks = '';
    this.collectForm.receivedBy = 'Account Office';
    this.showCollectModal.set(true);
  }

  protected closeCollectModal(): void {
    this.showCollectModal.set(false);
  }

  protected printReceipt(): void {
    window.print();
  }

  protected async submitCollection(): Promise<void> {
    this.isSaving.set(true);

    try {
      const response = await this.ledgerService.collectPayment(this.studentSearch, this.collectForm);
      await this.loadLedger(this.studentSearch);
      this.closeCollectModal();
      await Swal.fire({
        icon: 'success',
        title: 'Receipt issued',
        text: `${response.receipt.receiptNumber} created successfully.`,
      });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Unable to collect fee', text: 'Please verify the student ID and amount.' });
    } finally {
      this.isSaving.set(false);
    }
  }

  private async loadLedger(studentId: string): Promise<void> {
    try {
      this.ledger.set(await this.ledgerService.getLedger(studentId));
    } catch {
      this.ledger.set(null);
      await Swal.fire({ icon: 'error', title: 'Student not found', text: 'Please enter a valid GR number or student ID.' });
    }
  }
}

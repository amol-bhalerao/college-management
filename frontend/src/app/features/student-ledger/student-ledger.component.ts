import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { AppContextService } from '../../core/services/context.service';
import {
  CounterReceiptRow,
  FeeCounterSummary,
  LedgerRow,
  ReceiptRow,
  StudentLedgerResponse,
  StudentLedgerService,
} from '../../core/services/student-ledger.service';

@Component({
  selector: 'app-student-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, CurrencyPipe],
  template: `
    <section class="ledger-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Account module</p>
          <h1>Fee Counter Dashboard</h1>
          <p>Track counter collections, print A5 receipts, and verify student payments from one screen.</p>
        </div>

        <div class="head-actions">
          <label class="search-box">
            Student ID / GR No
            <input type="text" [(ngModel)]="studentSearch" placeholder="JC2025001" />
          </label>
          <button type="button" class="ghost-btn" (click)="reloadLedgerAndSummary()">Refresh</button>
          <button type="button" class="primary-btn" (click)="openCollectModal()" [disabled]="!ledger()">Collect fee</button>
        </div>
      </div>

      <div class="counter-grid-cards">
        <article>
          <span>Total collected</span>
          <strong>{{ counterSummary().totalCollected | currency:'INR':'symbol':'1.0-0' }}</strong>
          <small>All receipts for {{ context.activeInstitute().name }}</small>
        </article>
        <article>
          <span>Receipts issued</span>
          <strong>{{ counterSummary().receiptCount }}</strong>
          <small>Verification-ready payment records</small>
        </article>
        <article>
          <span>Cash / Digital</span>
          <strong>{{ counterSummary().cashCollected | currency:'INR':'symbol':'1.0-0' }}</strong>
          <small>Digital: {{ counterSummary().digitalCollected | currency:'INR':'symbol':'1.0-0' }}</small>
        </article>
        <article>
          <span>Pending dues</span>
          <strong>{{ counterSummary().pendingAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
          <small>Latest balances across selected institute</small>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Counter activity board</h2>
            <p>Recent receipt register from the live API response for the selected institute.</p>
          </div>
          <div class="grid-toolbar">
            <input
              class="search-field"
              type="search"
              [ngModel]="counterSearchText()"
              (ngModelChange)="counterSearchText.set($event)"
              placeholder="Search receipt, student, payment mode..."
            />
            <span class="tag">AG Grid</span>
          </div>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz counter-grid"
          [rowData]="counterSummary().recentReceipts"
          [columnDefs]="counterColumnDefs"
          [defaultColDef]="defaultColDef"
          [quickFilterText]="counterSearchText()"
          [pagination]="true"
          [paginationPageSize]="5"
        ></ag-grid-angular>
      </article>

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
                <div class="grid-toolbar">
                  <input
                    class="search-field"
                    type="search"
                    [ngModel]="ledgerSearchText()"
                    (ngModelChange)="ledgerSearchText.set($event)"
                    placeholder="Search reference, date, mode..."
                  />
                  <span class="tag">Accountant view</span>
                </div>
              </div>

              <ag-grid-angular
                class="ag-theme-quartz ledger-grid"
                [rowData]="currentLedger.entries"
                [columnDefs]="columnDefs"
                [defaultColDef]="defaultColDef"
                [quickFilterText]="ledgerSearchText()"
                [pagination]="true"
                [paginationPageSize]="6"
              ></ag-grid-angular>
            </article>

            <article class="panel receipt-panel" id="receipt-preview-card">
              <div class="panel__header no-print">
                <div>
                  <h2>Printable A5 Receipt</h2>
                  <p>Student copy with verification token and payment summary.</p>
                </div>
                <button type="button" class="ghost-btn" (click)="printReceipt()">Print A5</button>
              </div>

              @if (latestReceipt(); as receipt) {
                <div class="receipt-card">
                  <div class="receipt-header">
                    <small>College Management ERP · Student Copy</small>
                    <h3>{{ currentLedger.institute }}</h3>
                    <p>Academic Year {{ currentLedger.academicYear }}</p>
                  </div>

                  <div class="receipt-line"><span>Receipt No</span><strong>{{ receipt.receiptNumber }}</strong></div>
                  <div class="receipt-line"><span>Date</span><strong>{{ receipt.receiptDate }}</strong></div>
                  <div class="receipt-line"><span>Student</span><strong>{{ currentLedger.studentName }}</strong></div>
                  <div class="receipt-line"><span>GR Number</span><strong>{{ currentLedger.studentId }}</strong></div>
                  <div class="receipt-line"><span>Payment Mode</span><strong>{{ receipt.paymentMode }}</strong></div>
                  <div class="receipt-line"><span>Received By</span><strong>{{ receipt.receivedBy || 'Account Office' }}</strong></div>

                  <div class="receipt-highlight">
                    <span>Amount Received</span>
                    <strong>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</strong>
                    <small>Outstanding after payment: {{ currentLedger.outstandingAmount | currency:'INR':'symbol':'1.0-0' }}</small>
                  </div>

                  <p class="receipt-note">{{ receipt.remarks || 'Fee payment recorded successfully.' }}</p>

                  <div class="receipt-footer">
                    <small>Verification Token: {{ receipt.verificationToken || 'Pending' }}</small>
                    <a class="verify-link no-print" [href]="verifyUrl(receipt.verificationToken)" target="_blank" rel="noreferrer">
                      Verify receipt token
                    </a>
                  </div>
                </div>
              } @else {
                <p class="empty-state">No receipt issued yet for this student.</p>
              }
            </article>
          </div>

          <article class="panel">
            <div class="panel__header">
              <div>
                <h2>Student receipt history</h2>
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
  protected readonly counterSummary = signal<FeeCounterSummary>({
    totalCollected: 0,
    receiptCount: 0,
    cashCollected: 0,
    digitalCollected: 0,
    pendingAmount: 0,
    recentReceipts: [],
  });
  protected readonly showCollectModal = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly counterSearchText = signal('');
  protected readonly ledgerSearchText = signal('');
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

  protected readonly counterColumnDefs: ColDef<CounterReceiptRow>[] = [
    { field: 'receiptNumber', headerName: 'Receipt No', minWidth: 150 },
    { field: 'studentName', headerName: 'Student', minWidth: 180 },
    { field: 'studentId', headerName: 'GR No' },
    { field: 'paymentMode', headerName: 'Mode' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'receiptDate', headerName: 'Date' },
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
      void this.reloadLedgerAndSummary();
    });
  }

  protected latestReceipt(): ReceiptRow | null {
    return this.ledger()?.receipts?.[0] ?? null;
  }

  protected verifyUrl(token: string | null): string {
    return `http://127.0.0.1:8080/api/verify/receipt/${token ?? ''}`;
  }

  protected async reloadLedgerAndSummary(): Promise<void> {
    await Promise.all([
      this.loadLedger(this.studentSearch),
      this.loadCounterSummary(this.context.activeInstitute().id),
    ]);
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
      await this.reloadLedgerAndSummary();
      this.closeCollectModal();
      await Swal.fire({
        icon: 'success',
        title: 'Receipt issued',
        text: `${response.receipt.receiptNumber} created successfully.`,
      });
    } catch {
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

  private async loadCounterSummary(instituteId: number): Promise<void> {
    this.counterSummary.set(await this.ledgerService.getCounterSummary(instituteId));
  }
}

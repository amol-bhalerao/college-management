import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

interface LedgerRow {
  date: string;
  reference: string;
  mode: string;
  debit: number;
  credit: number;
  balance: number;
}

@Component({
  selector: 'app-student-ledger',
  standalone: true,
  imports: [CommonModule, AgGridAngular, CurrencyPipe],
  template: `
    <section class="ledger-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">Account module</p>
          <h1>Student Ledger</h1>
          <p>Ledger-ready foundation for accountant workflows, dues tracking, and QR-backed receipt follow-up.</p>
        </div>
        <button type="button">Send WhatsApp summary</button>
      </div>

      <div class="summary-grid">
        <article>
          <span>Gross fee</span>
          <strong>{{ 54000 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </article>
        <article>
          <span>Total paid</span>
          <strong>{{ 35500 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </article>
        <article>
          <span>Outstanding</span>
          <strong>{{ 18500 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Ledger timeline</h2>
            <p>All fee assignments, receipts, concessions, and adjustments in one place.</p>
          </div>
          <span class="tag">Accountant view</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz ledger-grid"
          [rowData]="rowData"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="6"
        ></ag-grid-angular>
      </article>
    </section>
  `,
  styleUrl: './student-ledger.component.scss',
})
export class StudentLedgerComponent {
  protected readonly columnDefs: ColDef<LedgerRow>[] = [
    { field: 'date', headerName: 'Date' },
    { field: 'reference', headerName: 'Reference' },
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

  protected readonly rowData: LedgerRow[] = [
    { date: '2026-04-01', reference: 'Opening balance', mode: 'System', debit: 0, credit: 0, balance: 54000 },
    { date: '2026-04-05', reference: 'Admission fee receipt', mode: 'Cash', debit: 0, credit: 12000, balance: 42000 },
    { date: '2026-04-10', reference: 'Scholarship expected', mode: 'MahaDBT', debit: 0, credit: 8000, balance: 34000 },
    { date: '2026-04-17', reference: 'Tuition fee receipt', mode: 'UPI', debit: 0, credit: 15500, balance: 18500 },
    { date: '2026-04-22', reference: 'Lab fee assignment', mode: 'System', debit: 2500, credit: 0, balance: 21000 },
    { date: '2026-04-24', reference: 'Concession approved', mode: 'Admin approval', debit: 0, credit: 2500, balance: 18500 },
  ];
}
